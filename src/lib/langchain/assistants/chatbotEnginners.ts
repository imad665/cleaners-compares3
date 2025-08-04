'use server'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { AIMessageChunk } from "@langchain/core/messages";
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "@/lib/prisma";

export const askEnginnerBotStream = async (userQuestion: string, docs: any, category: 'DRY_CLEANING' | 'FINISHING' | 'LAUNDRY'): Promise<ReadableStream> => {

    const enginnerDetails = await prisma.service.findMany({
        where: { category },
        select: {
            id: true,  // Required for matching with ref_id
            address: true,
            email: true,
            pictureUrl: true,
            experience: true,
            areaOfService: true,
            contactNumber: true,
        },
    });

    const enrichedDocs = docs.map((doc: any) => {
        const { title, ref_id } = doc.metadata || {};
        const enginner = enginnerDetails.find(p => p.id === ref_id);

        return `
**Service:** ${title || "Professional Service"}  
${enginner?.pictureUrl ? `<img src="${enginner.pictureUrl}" alt="${title}" width="150" />` : ''}  

**Key Details:**  
- **Service Area:** ${enginner?.areaOfService || "Multiple regions"}  
- **Experience:** ${enginner?.experience ? `${enginner.experience} years` : "Experienced"}  
- **Contact:** ${enginner?.contactNumber || "Available upon request"}  
- **Email:** ${enginner?.email || "Not specified"}  
- **Address:** ${enginner?.address || "Headquarters location available"}  

**Service Description:**  
${doc.pageContent || "Comprehensive service details available upon contact"}  
`.trim();
    });

    const context = enrichedDocs.join("\n\n---\n\n");

    const serviceType = category.toLowerCase().replace('_', ' ');

    const prompt = ChatPromptTemplate.fromTemplate(`
You are a professional assistant that helps users find the right engineer based on their request. You ONLY use the information provided in the context below — never make up information.

---

**How to respond:**

1. ✅ **Match the request with the best-fit engineer(s)**:
   - Identify relevant expertise (from description)
   - Check for location match or nearest area
   - Match specialty (hospital, eco, installation, hotel, etc.)

2. 🧾 **Present their service details clearly**:
   - Service name + specialty
   - Area of service
   - Years of experience
   - Rate
   - Company type
   - Contact info (phone/email/address if available)
   - Add service image if provided (Markdown format)

3. 📌 **Use a friendly, helpful tone. Keep response human.**

---

**If NO perfect match:**

> "🔍 I couldn’t find an exact match, but here are a few engineers who may still meet your needs:"

List the closest engineers based on area or specialty.

---

**Available Engineers:**  
{context}

---

**User Request:**  
"{input}"

---

**Your Response (Markdown):**
`);


    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini", // Recommended over gpt-4o-mini
        temperature: 0.3,
        streaming: true,
    });

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    return new ReadableStream({
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
                controller.enqueue(encoder.encode("⚠️ Service currently unavailable. Please try again later."));
                console.error("Streaming error:", error);
            }
            controller.close();
        },
    });
};