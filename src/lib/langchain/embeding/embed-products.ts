"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import { prisma } from "@/lib/prisma";
import getLLmApiKey from "./llm_api_key";

export const embedProductsToNeon = async () => {
  // 1. Init PG pool (Neon connection)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Neon DB URL
  });

  // 2. Fetch existing embeddings (get metadata.ref_id)
  const res = await pool.query(
    `SELECT metadata->>'ref_id' as ref_id FROM documents WHERE metadata->>'doc_type' = $1`,
    ["product"]
  );

  const existingProductIds = new Set(res.rows.map((r) => r.ref_id));
  console.log(existingProductIds.size, ';;;;;;;;;;;;;;;⚠️⚠️⚠️;');

  // 3. Fetch products from Prisma
  const products = await prisma.product.findMany({
    where: { title: { not: "" } },
    //select: { id: true, title: true, description: true },
    include: { category: true },
    orderBy: { title: "asc" },
    //take:5,
  });
  /* console.log(products,existingProductIds,'iiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

  return products; */
  //console.log(products.length,';;;;;;;;;;;;;;;⚠️⚠️⚠️;');

  const newProducts = products.filter(
    (p) => !existingProductIds.has(p.id)
  );

  if (newProducts.length === 0) {
    console.log("⚠️ All active products already embedded.");
    return;
  }

  // 4. Prepare texts + metadata
  /* const texts = newProducts.map((p) => `${p.title}: ${p.description}`);
  const metadata = newProducts.map((p) => ({
    doc_type: "product",
    ref_id: p.id,
    title: p.title,
  })); */
  const texts = newProducts.map((p) => {
    const catName = p.category?.name ?? "Uncategorized";
    const now = new Date();
    const discount = p.dealEndDate && p?.dealEndDate >= now ? `Discount:${p.discountPercentage}%` : 'No discount';

    p.discountPercentage
      ? `Discount:${p.discountPercentage}%` :
      p.discountPrice;

    return `
      Product: ${p.title}
      Description: ${p.description}
      Category: ${catName}
      Price: $${p.price}
      ${discount}
      Condition: ${p.condition}
      Stock: ${p.stock ?? 0} units
      Featured: ${p.isFeatured ? "Yes" : "No"}
    `.replace(/\s+/g, " ");
  })

  const metadata = newProducts.map((p)=>({
    doc_type:'product',
    ref_id: p.id,
    title: p.title,
    
  }))


  /* console.log(texts,metadata,'sssssssssssssssssssssssss');

  return products; */
  // 5. Init embedding model
  const { apikey, geminiApiKey } = await getLLmApiKey()

  if (!apikey) return

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: apikey
  });

  // 6. Store in Neon via LangChain PGVectorStore
  const store = await PGVectorStore.initialize(embeddings, {
    pool,
    tableName: "documents",
  });

  await store.addDocuments(
    texts.map((text, i) => ({
      pageContent: text,
      metadata: metadata[i],
    }))
  );

  console.log(`✅ ${newProducts.length} new products embedded successfully.`);
};
