"use server";

import { Pool } from "pg";
import { embedEngineersToNeon } from "../embed_enginner";
import { embedProductsToNeon } from "../embed-products";

// Function to clear all embeddings by doc_type
export const clearEmbeddingsByDocType = async (docType: string) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(
      `DELETE FROM documents WHERE metadata->>'doc_type' = $1`,
      [docType]
    );
    
    console.log(`✅ Cleared ${result.rowCount} embeddings with doc_type: ${docType}`);
    return { success: true, count: result.rowCount };
  } catch (error) {
    console.error("❌ Error clearing embeddings:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  } finally {
    await pool.end();
  }
};

// Function to remove a specific embedding by ref_id
export const removeEmbeddingByRefId = async (refId: string) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(
      `DELETE FROM documents WHERE metadata->>'ref_id' = $1`,
      [refId]
    );
    
    if (result.rowCount === 0) {
      console.log(`⚠️ No embedding found with ref_id: ${refId}`);
      return { success: false, message: "No embedding found" };
    }
    
    console.log(`✅ Removed embedding with ref_id: ${refId}`);
    return { success: true, count: result.rowCount };
  } catch (error) {
    console.error("❌ Error removing embedding:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  } finally {
    await pool.end();
  }
};

export const reembedByRefId = async (refId: string) =>{
    await removeEmbeddingByRefId(refId)
    await embedProductsToNeon()
}

// Function to clear all embeddings (use with caution!)
export const clearAllEmbeddings = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(`DELETE FROM documents`);
    
    console.log(`✅ Cleared all ${result.rowCount} embeddings`);
    return { success: true, count: result.rowCount };
  } catch (error) {
    console.error("❌ Error clearing all embeddings:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  } finally {
    await pool.end();
  }
};

// Function to get count of embeddings by doc_type
export const getEmbeddingCountByDocType = async (docType?: string) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    let query = "SELECT COUNT(*) FROM documents";
    let params: string[] = [];
    
    if (docType) {
      query += " WHERE metadata->>'doc_type' = $1";
      params = [docType];
    }
    
    const result = await pool.query(query, params);
    const count = parseInt(result.rows[0].count);
    
    console.log(`📊 Embedding count${docType ? ` for ${docType}` : ''}: ${count}`);
    return { success: true, count };
  } catch (error) {
    console.error("❌ Error getting embedding count:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  } finally {
    await pool.end();
  }
};


// Clear all engineer embeddings at once
export const clearAllEngineerEmbeddings = async () => {
  const docTypes = ["finishing_enginner", "dry_cleaning_enginner", "laundry_enginner"];
  let totalCount = 0;
  
  for (const docType of docTypes) {
    const result = await clearEmbeddingsByDocType(docType);
    if (result.success) {
      totalCount += result.count || 0;
    }
  }
  
  return { success: true, count: totalCount };
};

// Re-embed all products (clear then re-embed)
export const reembedAllProducts = async () => {
  // First clear existing product embeddings
  await clearEmbeddingsByDocType("product");
  
  // Then re-embed all products
  await embedProductsToNeon();
};

// Re-embed all engineers
export const reembedAllEngineers = async () => {
  // First clear existing engineer embeddings
  await clearAllEngineerEmbeddings();
  
  // Then re-embed all engineers
  await embedEngineersToNeon();
};