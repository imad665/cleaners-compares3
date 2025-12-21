'use server';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { WritableStream, ReadableStream } from 'web-streams-polyfill';
import { prisma } from "@/lib/prisma";
import { ChatOpenAI } from "@langchain/openai";

export const askEngineerBotStream = async (
  userQuestion: string,
  engineerIds: string[],
  docs: any,
  category: 'DRY_CLEANING' | 'FINISHING' | 'LAUNDRY',
  geminiApiKey: string | null,
  openaikey: string
): Promise<ReadableStream> => {
 
  // 1️⃣ Fetch engineers
  const engineerDetails = await prisma.service.findMany({
    where: { id: { in: engineerIds }, category },
    select: {
      id: true,
      title: true,
      address: true,
      email: true,
      pictureUrl: true,
      experience: true,
      areaOfService: true,
      contactNumber: true,
      companyType: true,
      ratePerHour: true,
      isFeatured: true,
    },
  });

  // 2️⃣ Minimal context placeholders
  const context = engineerDetails
    .map((e, idx) => `engineer${idx + 1}: <Engineer engineerId="${e.id}" />`)
    .join("\n");

  // 3️⃣ Prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a professional assistant that helps users find the right engineer.
Always respond using this XML-like structure:

<Response>
  <Text>Friendly greeting or explanation for the customer.</Text>
  <EngineerCarousel>
    {engineers}
  </EngineerCarousel>
  <Text>Optional extra helpful advice or call to action.</Text>
</Response>

Guidelines:
- Only include <Engineer> entries for engineers provided in the context.
- Each <Engineer> must include attribute: engineerId.
- Never make up data.
- Respond only to the user's question below.

Conversation History:
user: Hello!
assistant: Hello! Welcome to CleanersCompare.com! I'm your service assistant. How can I help you today?

Context:
{context}

**Customer Question:** {input}
**Assistant:**`);

  // 4️⃣ Select model
  const model = geminiApiKey
    ? new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash", streaming: true, apiKey: geminiApiKey })
    : new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.3, streaming: true, apiKey: openaikey });

  const engineersPlaceholder = engineerDetails
    .map(e => `<Engineer engineerId="${e.id}" />`)
    .join("\n");

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  // 5️⃣ Stream response
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        let response = '';
        const llmStream = await chain.stream({ context, input: userQuestion, engineers: engineersPlaceholder });

        for await (const chunk of llmStream) {
          response += chunk;
        }

        // 6️⃣ Replace placeholders with full data
        const fullResponse = response.replace(
          /<Engineer\s+engineerId="([^"]+)"\s*\/>/g,
          (_, engineerId) => {
            const e = engineerDetails.find(en => en.id === engineerId);
            if (!e) return '';
            return `<Engineer
              engineerId="${e.id}"
              title="${e.title}"
              areaOfService="${e.areaOfService}"
              experience="${e.experience ?? 'Experienced'} years"
              contactNumber="${e.contactNumber ?? 'Available upon request'}"
              email="${e.email ?? 'Not specified'}"
              address="${e.address ?? 'Headquarters location available'}"
              ratePerHour="${e.ratePerHour ?? 'N/A'}"
              companyType="${e.companyType ?? 'N/A'}"
              pictureUrl="${e.pictureUrl ?? ''}"
              featured="${e.isFeatured ? 'Yes' : 'No'}"
            />`;
          }
        );

        controller.enqueue(encoder.encode(fullResponse));
      } catch (error) {
        controller.enqueue(encoder.encode("⚠️ Service currently unavailable. Please try again later."));
        console.error("Streaming error:", error);
      }
      controller.close();
    }
  });
};
