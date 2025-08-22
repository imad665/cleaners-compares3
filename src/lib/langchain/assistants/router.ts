"use server";

import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pool } from "pg";
import { ReadableStream } from "web-streams-polyfill/ponyfill";

import { askProductBotStream } from "./chatbotProducts";
import { askEnginnerBotStream } from "./chatbotEnginners";
import { askMessageBotStream } from "./chatbotMessages";

export const askRouterBotStream = async (
  userQuestion: string,
  openaikey: string | null,
  geminiApikey: string | null,
): Promise<ReadableStream | undefined> => {
  // 1. Connect to Neon (Postgres)

  if (!openaikey /* || !geminiApikey */) {
    const msg = "⚠️ Please go to Dashboard (admin) → Settings → set your API key(s) for LLM before using the chatbot.";
    const encoder = new TextEncoder();

    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(msg));
        controller.close();
      },
    });
  }



  const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Neon DB connection string
    ssl: true, // Neon requires SSL
  });

  // 2. Embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: openaikey
  });

  // 3. VectorStore from Neon
  const vectorStore = await PGVectorStore.initialize(embeddings, {
    pool,
    tableName: "documents",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "text",     // use "content" if you didn’t rename
      metadataColumnName: "metadata",
    },
  });

  // 4. Search with scores
  const docsWithScores = await vectorStore.similaritySearchWithScore(
    userQuestion,
    4
  );

  const docs = docsWithScores.map(([doc]) => doc);
  const scores = docsWithScores.map(([_, score]) => score);

  // 5. Relevance threshold
  const RELEVANCE_THRESHOLD = 0.7;

  // 6. Utility function to extract IDs by doc_type
  const getRelevantIds = (docType: string) => {
    return docsWithScores
      .filter(
        ([doc, score]) =>
          doc.metadata?.doc_type === docType && score >= RELEVANCE_THRESHOLD
      )
      .sort((a, b) => b[1] - a[1]) // sort by score desc
      .map(([doc]) => doc.metadata?.ref_id)
      .filter((id): id is string => !!id);
  };

  const productIds = getRelevantIds("product");
  const enginnersDryCleanIds = getRelevantIds("dry_cleaning_enginner");
  const enginnersLaundryIds = getRelevantIds("laundry_enginner");
  const enginnersFinishingIds = getRelevantIds("finishing_enginner");
  // const messagesIds = getRelevantIds("message");

  // 7. Route based on most relevant doc type
  if (docsWithScores.length > 0) {
    const [[mostRelevantDoc, highestScore]] = docsWithScores.sort(
      (a, b) => b[1] - a[1]
    );

    console.log("Most relevant doc type:", mostRelevantDoc.metadata?.doc_type);
    console.log("Score:", highestScore);

    switch (mostRelevantDoc.metadata?.doc_type) {
      case "product":
        if (productIds.length > 0) {
          return askProductBotStream(userQuestion, productIds, docs, geminiApikey,openaikey);
        }
        break;

      case "dry_cleaning_enginner":
        if (enginnersDryCleanIds.length > 0) {
          return askEnginnerBotStream(userQuestion, docs, "DRY_CLEANING", geminiApikey,openaikey);
        }
        break;

      case "laundry_enginner":
        if (enginnersLaundryIds.length > 0) {
          return askEnginnerBotStream(userQuestion, docs, "LAUNDRY", geminiApikey,openaikey);
        }
        break;

      case "finishing_enginner":
        if (enginnersFinishingIds.length > 0) {
          return askEnginnerBotStream(userQuestion, docs, "FINISHING", geminiApikey,openaikey);
        }
        break;

      /* case "message":
        if (messagesIds.length > 0) {
          return askMessageBotStream(userQuestion, docs);
        }
        break; */
    }
  }

  // 8. Fallback
  return undefined;
};
