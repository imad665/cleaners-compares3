// chatbotMessages.ts
'use server';

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { WritableStream, ReadableStream } from 'web-streams-polyfill';

/**
 * Chatbot for CleanersCompare.com store assistant.
 * Responds directly to user input without embedding search.
 */
export const askMessageBotStream = async (
    userQuestion: string,
    openaikey: string,
    isProductQuery: boolean = false // Add flag to indicate if this was originally a product query
): Promise<ReadableStream> => {

    // 🟢 Define the prompt with knowledge about the store
    const prompt = ChatPromptTemplate.fromTemplate(`
    You are the friendly store assistant for **CleanersCompare.com**.
    This website sells professional laundry & dry cleaning equipment, machines, parts, sundries, and offers engineer services.

    IMPORTANT RULES:
    1. NEVER invent or make up specific products, models, or prices
    2. If asked about products we don't have, be honest about it
    3. Direct users to browse our catalog or contact support
    4. Only mention products that you know exist in our store
    5. If unsure, suggest general categories instead of specific items

    When responding:
    - Be friendly, helpful, and concise.
    - Mention products, categories, or services only if you're certain they exist.
    - Provide advice, recommendations, or steps if user asks for guidance.
    - Respond in Markdown format with clear structure.

    ${isProductQuery ? 'NOTE: This query was originally about products, but no matching products were found. Be helpful but do not invent products.' : ''}

    Examples:
    User: "Do you have washing machines under £1000?"
    Assistant: "I couldn't find specific washing machines under £1000 in our current inventory. You might want to browse our washing machine category to see all available options, or contact our sales team who can help you find the best solution for your budget."

    User: "What dry cleaning machines do you have?"
    Assistant: "We offer a variety of dry cleaning equipment from leading manufacturers. I recommend browsing our dry cleaning category to see all available models, or you can tell me more about your specific needs so I can guide you better."

    User: "hello!"
    Assistant: "Hello! Welcome to CleanersCompare.com! How can I assist you today?"

    Respond only to the user's question below.

    **User:** {input}
    **Assistant:**`);

    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini", // or "gpt-4-turbo"
        temperature: 0.2,
        streaming: true,
        apiKey: openaikey,
    });

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

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