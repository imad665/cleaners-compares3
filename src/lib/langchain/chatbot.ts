// app/lib/chatbot.ts
"use server";

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DocumentInterface } from "@langchain/core/documents";

export const askStoreBot = async (userQuestion: string): Promise<string> => {

    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        embeddings,
        {
            client: supabaseClient,
            tableName: "documents",
            queryName: "match_documents", // make sure this exists
        }
    );

    const retriever = vectorStore.asRetriever({
        filter: { doc_type: "product" },
        k: 4,
    });




    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.2,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant for an online store.

        Use the following product details to answer the question:

        {context}

        Question:
        {input}
        `);

    


    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const retrievalChain = await createRetrievalChain({
        retriever,
        combineDocsChain,
    });

    console.log(retriever, '⚠️');
    return 'hie'

    const result = await retrievalChain.invoke({
        input: userQuestion,
    });

    return result.answer;
};
