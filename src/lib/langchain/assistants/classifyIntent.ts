import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export async function classifyIntent(userQuestion: string, apiKey: string) {
  const IntentSchema = z.object({
    intent: z.enum(["greeting", "product_query", "engineer_query", "other"]),
    explanation: z
      .string()
      .describe("Short reason for why this intent was chosen"),
  });

  const llm_with_structured = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    apiKey: apiKey,
  }).withStructuredOutput(IntentSchema);

  const prompt = `
You are an intent classifier for a chatbot. 
Classify the following user input into one of these categories:

- greeting → when user greets or says hello/hi/etc.
- product_query → when user is asking about PRODUCTS or ITEMS (e.g., washing machines, detergents, cleaning tools, etc.).
- engineer_query → when user is asking about HUMAN EXPERTS or SERVICES (e.g., engineers, laundry service providers, dry cleaning specialists, finishing experts, technicians).
- other → anything else not covered above.

Important rules:
- If the user mentions engineers, services, fixing, laundry/finishing/dry cleaning **services**, or experts, it MUST be engineer_query.
- If the user mentions buying, price, cost, availability of machines or items, it MUST be product_query.
- Do not confuse services with products.

Respond ONLY in valid JSON following the schema.

User: "${userQuestion}"
`;

  const res = await llm_with_structured.invoke(prompt);
  return res;
}
