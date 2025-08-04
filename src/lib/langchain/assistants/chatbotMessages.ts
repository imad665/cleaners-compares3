'use server'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { AIMessageChunk } from "@langchain/core/messages";
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "@/lib/prisma";

export const askMessageBotStream = async (userQuestion: string, docs: any): Promise<ReadableStream> => {
    
    const messagesDetails = await prisma.inquiry.findMany({
        where: {
            sellerRead: { not: true }
        },
        select: {
            id: true,
            buyer: {
                select: {
                    name: true
                }
            },
            message: true,
            subject: true,
            product: {
                select: {
                    title: true,
                    description: true,
                    imagesUrl: true,
                }
            }
        }
    });

    const enrichedDocs = docs.map((doc: any) => {
        const { title, ref_id } = doc.metadata || {};
        const inquiry = messagesDetails.find(p => p.id === ref_id);

        return `
**New Message Alert**  
**From:** ${inquiry?.buyer?.name ?? "Unknown"}  
**Subject:** ${inquiry?.subject ?? "No Subject"}  
**Regarding Product:** ${inquiry?.product?.title ?? "N/A"}  
<img src="${inquiry?.product?.imagesUrl?.[0] ?? ""}" alt="${inquiry?.product?.title}" width="150" />  
**Message Content:**  
${inquiry?.message ?? "N/A"}  
**Full Context:** ${doc.pageContent}
        `.trim();
    });

    const context = enrichedDocs.join("\n\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
You're an assistant helping manage customer inquiries and messages.

Use the context below to summarize or respond to messages appropriately.  
Format your response clearly in **Markdown**.

For new messages, highlight the key details.  
If no relevant messages are found, respond with:  
**"No unread messages found."**

---

{context}

**Request:** {input}  
**Assistant:**
    `);

    const model = new ChatOpenAI({
        modelName: "gpt-4-turbo", // or "gpt-4o"
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