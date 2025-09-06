'use server';

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { ReadableStream } from "web-streams-polyfill/ponyfill";

/**
 * Chatbot for CleanersCompare.com store assistant.
 * Responds directly to user input without embedding search.
 */
export const askMessageBotStream = async (
    userQuestion: string,
    openaikey: string
): Promise<ReadableStream> => {

    // 🟢 Define the prompt with knowledge about the store
    const prompt = ChatPromptTemplate.fromTemplate(`
    You are the friendly store assistant for **CleanersCompare.com**.
    This website sells professional laundry & dry cleaning equipment, machines, parts, sundries, and offers engineer services.

    When responding:
    - Be friendly, helpful, and concise.
    - Mention products, categories, or services only if relevant.
    - Provide advice, recommendations, or steps if user asks for guidance.
    - Respond in Markdown format with clear structure.

    Examples:
    User: "hello!"
    Assistant: "Hello! How can I assist you today? If you need help finding something specific, just let me know!"

    User: "Can you show me finishing machines on sale?"
    Assistant: "Sure! Here are some finishing machines currently available: ..."

    Respond only to the user's question below.

    **User:** {input}
    **Assistant:**`);


    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini", // or "gpt-4-turbo"
        temperature: 0.2,
        streaming: true,
        apiKey: openaikey,
    });

    function xmlWarapper(content:string){
        return `<Response><Text>${content}</Text></Response>`
    }

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser).pipe(xmlWarapper);

    return new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                const stream = await chain.stream({
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
};
