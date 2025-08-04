'use server'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
 
import { AIMessageChunk } from "@langchain/core/messages";
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "@/lib/prisma";

export const askProductBotStream = async (userQuestion: string,productIds:any,docs:any): Promise<ReadableStream> => {
   
    const productDetails = await prisma.product.findMany({
        where: { id: { in: productIds } },
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

    const enrichedDocs = docs.map((doc:any) => {
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
        modelName: "gpt-4o-mini", // or "gpt-4o"
        temperature: 0.2,
        streaming: true,
    });

    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            
            try {
                const stream = await chain.stream({
                    context,
                    input: userQuestion,
                });

                for await (const chunk of stream) {
                    controller.enqueue(encoder.encode(chunk));
                }
            } catch (error) {
                controller.enqueue(encoder.encode("⚠️ Error streaming response."));
                console.error("Streaming error:", error);
            }

            controller.close();
        },
    });

    return stream;
};