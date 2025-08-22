// app/lib/chatbot.ts
"use server";

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const askStoreBot = async (userQuestion: string): Promise<string> => {
    // 1. Connect to Neon (Postgres)
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL, // Neon connection string
        ssl: true, // Neon requires SSL
    });

    // 2. Embeddings
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    // 3. VectorStore from Neon
    const vectorStore = await PGVectorStore.initialize(embeddings, {
        pool,
        tableName: "documents", // the table you created in Neon
        columns: {
            idColumnName: "id",
            vectorColumnName: "embedding",
            contentColumnName: "text",     // must match your table column
            metadataColumnName: "metadata" // must match your table column
        },
    });

    // 4. Retriever
    const retriever = vectorStore.asRetriever({
        k: 4,
        filter: (doc) => doc.metadata?.doc_type === "product", // filter inside LangChain
    });

    // 5. LLM
    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.2,
    });

    // 6. Prompt
    const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant for an online store.

    Use the following product details to answer the question:

    {context}

    Question:
    {input}
  `);

    // 7. Chains
    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const retrievalChain = await createRetrievalChain({
        retriever,
        combineDocsChain,
    });

    // 8. Run
    const result = await retrievalChain.invoke({
        input: userQuestion,
    });

    return result.answer;
};
