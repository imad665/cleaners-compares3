import { askRouterBotStream } from "@/lib/langchain/assistants/router";
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
        const innerStream = await askRouterBotStream(question);

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
