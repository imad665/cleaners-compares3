"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import { prisma } from "@/lib/prisma";
import getLLmApiKey from "./llm_api_key";

export const embedEngineersToNeon = async () => {
    // 1. Init Neon pool
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL, // Neon DB URL
    });

    // 2. Fetch existing engineer embeddings (check multiple doc_types)
    const res = await pool.query(
        `SELECT metadata->>'ref_id' as ref_id 
     FROM documents 
     WHERE metadata->>'doc_type' IN ($1, $2, $3)`,
        ["finishing_enginner", "dry_cleaning_enginner", "laundry_enginner"]
    );

    const existingEngineerIds = new Set(res.rows.map((r) => r.ref_id));

    // 3. Fetch engineers from Prisma
    const engineers = await prisma.service.findMany({
        where: { title: { not: "" } },
        select: {
            id: true,
            title: true,
            description: true,
            areaOfService: true,
            experience: true,
            category: true,
        },
        orderBy: { title: "asc" },
        take: 5
    });

    // 4. Filter new engineers
    const newEngineers = engineers.filter((e) => !existingEngineerIds.has(e.id));

    if (newEngineers.length === 0) {
        console.log("⚠️ All active engineers are already embedded.");
        return;
    }

    // 5. Prepare content + metadata
    const texts = newEngineers.map(
        (e) =>
            `${e.title}: ${e.description}. Service type: ${e.category}. Area: ${e.areaOfService}. Experience: ${e.experience} years`
    );

    const metadata = newEngineers.map((e) => ({
        doc_type: `${e.category.toLowerCase()}_enginner`,
        ref_id: e.id,
        title: e.title,
        service_type: e.category,
        area: e.areaOfService,
        experience: e.experience,
    }));

    // 6. Init embeddings
    const { apikey, geminiApiKey } = await getLLmApiKey()

    if (!apikey) return

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: apikey
    });

    // 7. Init Neon PGVectorStore
    const store = await PGVectorStore.initialize(embeddings, {
        pool,
        tableName: "documents",
    });

    // 8. Insert in batches (optional, for large datasets)
    const batchSize = 100;
    for (let i = 0; i < texts.length; i += batchSize) {
        const batchTexts = texts.slice(i, i + batchSize);
        const batchMetadata = metadata.slice(i, i + batchSize);

        await store.addDocuments(
            batchTexts.map((text, idx) => ({
                pageContent: text,
                metadata: batchMetadata[idx],
            }))
        );
    }

    console.log(`✅ ${newEngineers.length} new engineers embedded successfully.`);
};
