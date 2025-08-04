"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { prisma } from "@/lib/prisma";

export const embedEngineersToSupabase = async () => {
    // Initialize Supabase client
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all existing engineer embeddings
    const { data: existingEmbeds, error } = await supabaseClient
        .from("documents")
        .select("metadata")
        .or("metadata->>doc_type.eq.finishing_enginner,metadata->>doc_type.eq.dry_cleaning_enginner,metadata->>doc_type.eq.laundry_enginner");

    if (error) {
        console.error("❌ Error fetching existing embeddings:", error.message);
        return;
    }

    const existingEngineerIds = new Set(
        (existingEmbeds ?? [])
            .map((row) => row.metadata?.ref_id)
            .filter((id): id is string => !!id)
    );

    // Fetch all active service providers
    const engineers = await prisma.service.findMany({
        where: {
            title: { not: "" } // Only services with non-empty titles
        },
        select: {
            id: true,
            title: true,
            description: true,
            areaOfService: true,
            experience: true,
            category:true, 
        },
        orderBy: { title: "asc" },
        
    });

    // Filter only new engineers not already embedded
    const newEngineers = engineers.filter(
        (e) => !existingEngineerIds.has(e.id)
    );

    if (newEngineers.length === 0) {
        console.log("⚠️ All active engineers are already embedded.");
        return;
    }

    // Prepare content and metadata
    const texts = newEngineers.map((e) =>
        `${e.title}: ${e.description}. Service type: ${e.category}. Area: ${e.areaOfService}. Experience: ${e.experience} years`
    );

    const metadata = newEngineers.map((e) => ({
        doc_type: `${e.category.toLowerCase()}_enginner`, // e.g. "dry_cleaning_enginner"
        ref_id: e.id,
        title: e.title,
        service_type: e.category,
        area: e.areaOfService,
        experience: e.experience
    }));

    // Initialize embedding model
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    // Store new embeddings in batches
    const batchSize = 100;
    for (let i = 0; i < texts.length; i += batchSize) {
        const batchTexts = texts.slice(i, i + batchSize);
        const batchMetadata = metadata.slice(i, i + batchSize);

        await SupabaseVectorStore.fromTexts(
            batchTexts,
            batchMetadata,
            embeddings,
            {
                client: supabaseClient,
                tableName: "documents",
                queryName: "match_documents",
            }
        );
    }
    console.log(`✅ ${newEngineers.length} new engineers embedded successfully.`);
};