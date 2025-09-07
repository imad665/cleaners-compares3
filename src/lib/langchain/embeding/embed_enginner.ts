"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import { prisma } from "@/lib/prisma";
import getLLmApiKey from "./llm_api_key";

export const embedEngineersToNeon = async () => {
  // 1️⃣ Init Neon pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // 2️⃣ Fetch existing engineer embeddings
  const res = await pool.query(
    `SELECT metadata->>'ref_id' as ref_id 
     FROM documents 
     WHERE metadata->>'doc_type' IN ($1, $2, $3)`,
    ["finishing_enginner", "dry_cleaning_enginner", "laundry_enginner"]
  );

  const existingEngineerIds = new Set(res.rows.map((r) => r.ref_id));
  console.log(existingEngineerIds.size, "⚠️ Existing engineers embedded");

  // 3️⃣ Fetch engineers from Prisma
  const engineers = await prisma.service.findMany({
     
    orderBy: { title: "asc" },
    });

  // 4️⃣ Filter new engineers
  const newEngineers = engineers.filter((e) => !existingEngineerIds.has(e.id));
  if (newEngineers.length === 0) {
    console.log("⚠️ All active engineers are already embedded.");
    return;
  }

  // 5️⃣ Prepare text content and metadata
  const now = new Date();
  const texts = newEngineers.map((e) => {
    const catName = e.category ?? "Uncategorized";
    const featured =
      e.featuredEndDate && e.featuredEndDate >= now ? "Yes" : "No";

    return `
      Engineer: ${e.title}
      Description: ${e.description ?? "N/A"}
      Service type: ${catName}
      Area: ${e.areaOfService ?? "N/A"}
      Experience: ${e.experience ?? "N/A"} years
      Featured: ${featured}
      ratePerHour:${e.ratePerHour}£
      callOutCharges:${e.callOutCharges}£
    `.replace(/\s+/g, " ");
  });

  const metadata = newEngineers.map((e) => {
    const docType = `${e.category.toLowerCase()}_enginner`;
    return {
      doc_type: docType,
      ref_id: e.id,
      featuredEnd:e.featuredEndDate,
    };
  });

  // 6️⃣ Init embeddings
  const { apikey } = await getLLmApiKey();
  if (!apikey) return;

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: apikey,
  });

  // 7️⃣ Init Neon PGVectorStore
  const store = await PGVectorStore.initialize(embeddings, {
    pool,
    tableName: "documents",
  });

  // 8️⃣ Insert in batches
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
