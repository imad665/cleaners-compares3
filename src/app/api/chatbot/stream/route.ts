import { askRouterBotStream } from "@/lib/langchain/assistants/router";
import getLLmApiKey from "@/lib/langchain/embeding/llm_api_key";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid question" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        /* const settings = await prisma.adminSetting.findMany({where:{key:{in:['openai','gemini']}}}) 
        //console.log(settings,'ooooooooooooooooooooooooooooo');
        const apikey = settings.find((s)=>s.key==='openai')?.value || '' 
        const geminiApiKey = settings.find((s)=>s.key === 'gemini')?.value || ''; */
        const {apikey,geminiApiKey}=await getLLmApiKey()

        
        const innerStream = await askRouterBotStream(question,apikey,geminiApiKey);

        if (!innerStream) {
            return new Response("Sorry, no matching documents found.", {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache",
                },
            });
        }

        // Wrap returned stream in a Response-compatible ReadableStream
        const encoder = new TextEncoder();
        const outerStream = new ReadableStream({
            async start(controller) {
                const reader = innerStream.getReader();

                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        controller.enqueue(value); // ← FIXED: remove encode
                    }
                } catch (err) {
                    controller.enqueue("⚠️ Error during response.");
                    console.error("Streaming wrapper error:", err);
                }

                controller.close();
            },
        });

        return new Response(outerStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        return new Response(JSON.stringify({ error: "Failed to stream answer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
