"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";
import { prisma } from "@/lib/prisma";

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

  // 3. Fetch products from Prisma
  const products = await prisma.product.findMany({
    where: { title: { not: "" } },
    select: { id: true, title: true, description: true },
    orderBy: { title: "asc" },
    take:5,
  });
  /* console.log(products,existingProductIds,'iiiiiiiiiiiiiiiiiiiiiiiiiiiiii');

  return products; */
  
  const newProducts = products.filter(
    (p) => !existingProductIds.has(p.id)
  );

  if (newProducts.length === 0) {
    console.log("⚠️ All active products already embedded.");
    return;
  }

  // 4. Prepare texts + metadata
  const texts = newProducts.map((p) => `${p.title}: ${p.description}`);
  const metadata = newProducts.map((p) => ({
    doc_type: "product",
    ref_id: p.id,
    title: p.title,
  }));
  /* console.log(texts,metadata,'sssssssssssssssssssssssss');

  return products; */
  // 5. Init embedding model
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
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
