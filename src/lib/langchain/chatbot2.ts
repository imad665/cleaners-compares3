import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../prisma";

export const askStoreBot = async (userQuestion: string): Promise<string> => {
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
    });

    const retriever = vectorStore.asRetriever({
        filter: { doc_type: "product" },
        k: 4,
    });

    const docs = await retriever.getRelevantDocuments(userQuestion);

    // Extract ref_ids
    const productIds = docs
        .map((doc) => doc.metadata?.ref_id)
        .filter((id): id is string => !!id);

    // Fetch real-time product data from your DB
    const productDetails = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
        select: {
            id: true,
            title: true,
            price: true,
            discountPrice: true,
            discountPercentage: true,
            stock: true,
            isDealActive: true,
            imagesUrl: true,
        },
    });

    // Enrich the matched documents with DB data
    const enrichedDocs = docs.map((doc) => {
    const { title, ref_id } = doc.metadata || {};
    const product = productDetails.find(p => p.id === ref_id);

    return `
    **Product:** ${title ?? "N/A"}  
    <img src="${product?.imagesUrl?.[0] ?? ""}" alt="${title}" width="150" />  
    - **Price:** $${product?.discountPrice ?? product?.price ?? "N/A"}  
    - **Original Price:** $${product?.price ?? "N/A"} (${product?.discountPercentage ?? 0}% off)  
    - **Stock:** ${product?.stock ?? "N/A"}  
    - **Deal Active:** ${product?.isDealActive ? "✅ Yes" : "❌ No"}  
    - **Description:** ${doc.pageContent}
    `.trim();
    });

    const context = enrichedDocs.join("\n\n");

    console.log(context, '✅ ✅');

    const prompt = ChatPromptTemplate.fromTemplate(`
    You're a friendly store assistant helping customers.

    Use the context below to answer the customer's question clearly and helpfully.  
    Respond in **Markdown format** with structured details.

    Only use information found in the context.  
    If no matching product is found, respond with:  
    **"Sorry, I couldn't find any matching product."**

    ---

    {context}

    **Customer:** {input}  
    **Assistant:**
    `);




    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.2,
    });

    const chainPrompt = await prompt.format({
        context,
        input: userQuestion,
    });

    const response = await model.invoke(chainPrompt);
    
    return response.content;
};
