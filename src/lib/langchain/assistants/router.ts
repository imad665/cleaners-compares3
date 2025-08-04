'use server'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { createClient } from "@supabase/supabase-js";

import { ReadableStream } from "web-streams-polyfill/ponyfill";

import { askProductBotStream } from "./chatbotProducts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { askEnginnerBotStream } from "./chatbotEnginners";
import { askMessageBotStream } from "./chatbotMessages";

export const askRouterBotStream = async (userQuestion: string): Promise<ReadableStream | undefined> => {
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    // 1. Get documents with scores using similaritySearchWithScore
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
    });

    // Search with scores
    const docsWithScores = await vectorStore.similaritySearchWithScore(userQuestion, 4);
    
    // Extract docs and scores separately
    const docs = docsWithScores.map(([doc, score]) => doc);
    const scores = docsWithScores.map(([_, score]) => score);

    // 2. Create a relevance threshold (adjust as needed)
    const RELEVANCE_THRESHOLD = 0.7; // Only consider docs above this score
    
    // 3. Filter and sort documents by score
    const getRelevantIds = (docType: string) => {
        return docsWithScores
            .filter(([doc, score]) => 
                doc.metadata?.doc_type === docType && 
                score >= RELEVANCE_THRESHOLD
            )
            .sort((a, b) => b[1] - a[1]) // Sort by score descending
            .map(([doc, _]) => doc.metadata?.ref_id)
            .filter((id): id is string => !!id);
    };

    const productIds = getRelevantIds('product');
    const enginnersDryCleanIds = getRelevantIds('dry_cleaning_enginner');
    const enginnersLaundryIds = getRelevantIds('laundry_enginner');
    const enginnersFinishingIds = getRelevantIds('finishing_enginner');
    //const messagesIds = getRelevantIds('message');

    // 4. Choose the most relevant category based on highest scoring document
    if (docsWithScores.length > 0) {
        const [[mostRelevantDoc, highestScore]] = docsWithScores.sort((a, b) => b[1] - a[1]);
        
        console.log('Most relevant doc type:', mostRelevantDoc.metadata?.doc_type);
        console.log('Score:', highestScore);
         
        // Route based on most relevant category
        switch (mostRelevantDoc.metadata?.doc_type) {
            case 'product':
                if (productIds.length > 0) {
                    return askProductBotStream(userQuestion, productIds, docs);
                }
                break;
                
            case 'dry_cleaning_enginner':
                if (enginnersDryCleanIds.length > 0) {
                    return askEnginnerBotStream(userQuestion, docs, 'DRY_CLEANING');
                }
                break;
                
            case 'laundry_enginner':
                if (enginnersLaundryIds.length > 0) {
                    return askEnginnerBotStream(userQuestion, docs, 'LAUNDRY');
                }
                break;
                
            case 'finishing_enginner':
                if (enginnersFinishingIds.length > 0) {
                    return askEnginnerBotStream(userQuestion, docs, 'FINISHING');
                }
                break;
                
            /*case 'message':
                if (messagesIds.length > 0) {
                    return askMessageBotStream(userQuestion, docs);
                }
                break;*/
        }
    }

    // Fallback if no relevant documents found
    return undefined;
};