"use server";

import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pool } from "pg";
import { ReadableStream } from "web-streams-polyfill/ponyfill";

import { askProductBotStream } from "./chatbotProducts";
import { askMessageBotStream } from "./chatbotMessages";
import { classifyIntent } from "./classifyIntent";
import { askEngineerBotStream } from "./chatbotEnginners";

type DocWithScore = [any, number];

const ENGINEER_DOC_TYPES = new Set([
  "dry_cleaning_enginner",
  "laundry_enginner",
  "finishing_enginner",
]);

const mapDocTypeToCategory = (docType: string):
  | "DRY_CLEANING"
  | "LAUNDRY"
  | "FINISHING"
  | null => {
  switch (docType) {
    case "dry_cleaning_enginner":
      return "DRY_CLEANING";
    case "laundry_enginner":
      return "LAUNDRY";
    case "finishing_enginner":
      return "FINISHING";
    default:
      return null;
  }
};

const getRelevantIds = (
  docsWithScores: DocWithScore[],
  docType: string,
  threshold: number
): string[] =>
  docsWithScores
    .filter(([doc, score]) => doc.metadata?.doc_type === docType && score >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([doc]) => doc.metadata?.ref_id)
    .filter((id: unknown): id is string => !!id);

export const askRouterBotStream = async (
  userQuestion: string,
  openaikey: string | null,
  geminiApikey: string | null
): Promise<ReadableStream | undefined> => {
  if (!openaikey) {
    const msg =
      "⚠️ Please go to Dashboard → Settings → set your API key(s) for LLM before using the chatbot.";
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(msg));
        controller.close();
      },
    });
  }

  // 1) Classify the user's intent first
  const classification = await classifyIntent(userQuestion, openaikey);
  console.log(
    "User intent:",
    classification.intent,
    "Explanation:",
    classification.explanation
  );

  // 2) If greeting/other: do NOT hit RAG; reply directly
  if (classification.intent === "greeting" || classification.intent === "other") {
    return askMessageBotStream(userQuestion, openaikey);
  }

  // 3) Build vector store
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: openaikey,
  });

  const vectorStore = await PGVectorStore.initialize(embeddings, {
    pool,
    tableName: "documents",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "text",
      metadataColumnName: "metadata",
    },
  });

  // 4) Use intent-based filtering for the search
  let filterCondition: any = {};
  
  if (classification.intent === "product_query") {
    filterCondition = { doc_type: "product" };
  } else if (classification.intent === "engineer_query") {
    filterCondition = {
      doc_type: {
        $in: ["dry_cleaning_enginner", "laundry_enginner", "finishing_enginner"]
      }
    };
  }

  const K = 12;
  const RELEVANCE_THRESHOLD = 0.6;
  const docsWithScores = await vectorStore.similaritySearchWithScore(
    userQuestion, 
    K, 
    filterCondition
  );
  const docs = docsWithScores.map(([doc]) => doc);

  console.log(
    `Found ${docsWithScores.length} docs. Intent = ${classification.intent}, question: ${userQuestion}`
  );

  if (docsWithScores.length > 0) {
    console.log("Document types found:", docsWithScores.map(([doc]) => doc.metadata?.doc_type));
  }

  // 5) Route based on intent with the filtered results
  if (classification.intent === "product_query") {
    const productIds = getRelevantIds(docsWithScores, "product", RELEVANCE_THRESHOLD);

    if (productIds.length > 0) {
      console.log("Routing to PRODUCT bot with ids:", productIds.length);
      return askProductBotStream(userQuestion, productIds, docs, geminiApikey, openaikey);
    }
  }

  if (classification.intent === "engineer_query") {
    // Find the best scoring engineer document
    const engineerDocs = docsWithScores.filter(([doc]) => 
      ENGINEER_DOC_TYPES.has(doc.metadata?.doc_type)
    );
    
    if (engineerDocs.length > 0) {
      // Sort by score and get the best one
      const [[bestEngineerDoc, bestScore]] = engineerDocs.sort((a, b) => b[1] - a[1]);
      const bestDocType = bestEngineerDoc.metadata?.doc_type as string;
      const category = mapDocTypeToCategory(bestDocType);

      // Get all relevant engineer IDs for this doc type
      const engineerIds = getRelevantIds(docsWithScores, bestDocType, RELEVANCE_THRESHOLD);

      if (category && engineerIds.length > 0) {
        console.log(
          `Routing to ENGINEER bot | docType=${bestDocType} category=${category} ids=${engineerIds.length} topScore=${bestScore}`
        );
        return askEngineerBotStream(
          userQuestion,
          engineerIds,
          docs,
          category,
          geminiApikey ?? null,
          openaikey
        );
      }
    }
  }

  // 6) Fallback: If no documents found with intent filter, try without filter
  console.log("No documents found with intent filter, trying without filter...");
  
  const fallbackDocsWithScores = await vectorStore.similaritySearchWithScore(userQuestion, K);
  
  if (fallbackDocsWithScores.length > 0) {
    console.log("Fallback documents found:", fallbackDocsWithScores.map(([doc]) => doc.metadata?.doc_type));
  }

  // 7) If we have engineer intent but no engineer docs, use a targeted approach
  if (classification.intent === "engineer_query") {
    console.log("Engineer query detected but no engineer docs found, using targeted search...");
    
    // Try searching specifically for each engineer type
    for (const docType of ENGINEER_DOC_TYPES) {
      const targetedDocs = await vectorStore.similaritySearchWithScore(
        userQuestion, 
        4, 
        { doc_type: docType }
      );
      
      if (targetedDocs.length > 0) {
        const category = mapDocTypeToCategory(docType);
        const engineerIds = getRelevantIds(targetedDocs, docType, 0.4); // Lower threshold
        
        if (category && engineerIds.length > 0) {
          console.log(`Found ${engineerIds.length} ${docType} documents with targeted search`);
          return askEngineerBotStream(
            userQuestion,
            engineerIds,
            targetedDocs.map(([doc]) => doc),
            category,
            geminiApikey ?? null,
            openaikey
          );
        }
      }
    }
    
    // If still no engineers found, use the general message but explain we're looking for engineers
    console.log("No engineer documents found even with targeted search");
    const engineerFallbackMessage = "I understand you're looking for engineering services. While I couldn't find specific engineers in our database for your query, please contact our support team directly for assistance with equipment repairs and maintenance.";
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`<Response><Text>${engineerFallbackMessage}</Text></Response>`));
        controller.close();
      },
    });
  }

  // 8) Final fallback: general assistant message
  console.log("Falling back to general message assistant.");
  return askMessageBotStream(userQuestion, openaikey);
};