'use server';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "@/lib/prisma";

export const askProductBotStream = async (
  userQuestion: string,
  productIds: string[],
  docs: any,
  geminiApiKey: string | null,
  openaikey: string
  
): Promise<ReadableStream> => {
  // 1. Fetch products
  const productDetails = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      discountPercentage: true,
      discountPrice: true,
      stock: true,
      condition: true,
      isFeatured: true,
      imagesUrl: true,
      category: { select: { name: true } },
      units:true,
      isDealActive:true
    },
  });

  // 2. Prepare context with only productIds to save tokens
  const context = productDetails.map((p, idx) => `product${idx + 1}: <Product productId="${p.id}" />`).join("\n");

  // 3. Prompt with minimal product info
  const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful store assistant.  
        Always respond using this XML-like structure:

        <Response>
        <Text>Some friendly greeting or explanation for the customer.</Text>
        <Carousel>
            {products}
        </Carousel>
        <Text>Optional extra helpful advice or call to action.</Text>
        </Response>

        Guidelines:
        - Only include <Product> entries for products provided in the context.
        - Each <Product> must include attribute: productId.
        - Do not invent new products.
        - Only respond to the user's question below.
         

        Conversation History:
        user: Hello!
        assistant: Hello! Welcome to CleanersCompare.com! I'm your store assistant. How can I help you today?
        
        Context:
        {context}

        **Customer Question:** {input}
        **Assistant:**`);

  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.3,
    streaming: true,
    apiKey: openaikey,
  });

  const products = productDetails
  .map((p) => `<Product productId="${p.id}" />`)
  .join("\n");
   
  
  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        // 4. Generate initial response
        let response = '';
        const llmStream = await chain.stream({ context, input: userQuestion,products });

        for await (const chunk of llmStream) {
          response += chunk;
        }

        // 5. Replace each <Product productId="..."/> with full product data
        const fullResponse = response.replace(
          /<Product\s+productId="([^"]+)"\s*\/>/g,
          (_, productId) => {
            const p = productDetails.find(pd => pd.id === productId);
            if (!p) return ''; // skip if not found

            const discount = p.discountPercentage && p.discountPercentage > 0
              ? `${p.discountPercentage}%`
              : p.discountPrice
              ? `£${p.discountPrice}`
              : "No discount";

            const images = p.imagesUrl && p.imagesUrl.length > 0
              ? p.imagesUrl.join(", ")
              : "";

            const isFeatured= p.isFeatured;
            const units= p.units;
            const unitPrice= (!p.isDealActive ? p.price : (p.discountPrice || p.price)) / (p.units || 1);
            const priceExcVat= !p.isDealActive ? p.price : p.discountPrice;
            const price= p.price;
            const stock=p.stock;
            return `<Product
                    productId="${p.id}"
                    title="${p.title}"
                    description="${p.description ?? "N/A"}"
                    category="${p.category?.name ?? "Uncategorized"}"
                    price="£${price}"
                    priceExcVat="£${priceExcVat}"
                    unitPrice="£${unitPrice}"
                    discount="${discount}"
                    condition="${p.condition}"
                    units="${units}"
                    stock="${stock ?? "N/A"}"
                    featured="${isFeatured ? "Yes" : "No"}"
                    images="${images}"
                    />`;
          }
        );

        // 6. Stream final response
        controller.enqueue(encoder.encode(fullResponse));
      } catch (error) {
        controller.enqueue(encoder.encode("⚠️ Error streaming response."));
        console.error("Streaming error:", error);
      }
      controller.close();
    },
  });

  return stream;
};
