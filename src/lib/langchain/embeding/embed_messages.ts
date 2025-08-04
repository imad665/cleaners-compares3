"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { prisma } from "@/lib/prisma";

export const embedMessagesToSupabase = async () => {
    // Initialize Supabase client
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all existing message embeddings
    const { data: existingEmbeds, error } = await supabaseClient
        .from("documents")
        .select("metadata")
        .eq("metadata->>doc_type", "message");

    if (error) {
        console.error("❌ Error fetching existing embeddings:", error.message);
        return;
    }

    const existingMessageIds = new Set(
        (existingEmbeds ?? [])
            .map((row) => row.metadata?.ref_id)
            .filter((id): id is string => !!id)
    );

    // Fetch all unread messages
    const messages = await prisma.inquiry.findMany({
        where: {
            sellerRead: false,
            message: { not: "" } // Only messages with content
        },
        select: {
            id: true,
            subject: true,
            message: true,
            product: {
                select: {
                    title: true
                }
            },
            buyer: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { createdAt: "desc" },
        take:5
    });

    // Filter only new messages not already embedded
    const newMessages = messages.filter(
        (m) => !existingMessageIds.has(m.id)
    );

    if (newMessages.length === 0) {
        console.log("⚠️ All unread messages are already embedded.");
        return;
    }

    // Prepare content and metadata
    const texts = newMessages.map((m) => 
        `Subject: ${m.subject}. Message: ${m.message}. Regarding product: ${m.product?.title || 'N/A'}. From: ${m.buyer?.name || 'Unknown'}`
    );

    const metadata = newMessages.map((m) => ({
        doc_type: "message",
        ref_id: m.id,
        subject: m.subject,
        product_title: m.product?.title,
        buyer_name: m.buyer?.name,
        is_unread: true
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
    console.log(`✅ ${newMessages.length} new messages embedded successfully.`);
};