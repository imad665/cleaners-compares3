"use server";

 
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { prisma } from "@/lib/prisma";

export const embedProductsToSupabase = async () => {
    // 1. Initialize Supabase client
    const supabaseClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );


    // 2. Get all existing product_ids from embeddings table (from metadata.ref_id)
    const docType = "product"; // or "faq", etc.
    /* const { data: existingEmbeds, error } = await supabaseClient.rpc("get_documents_metadata_by_type", {
        doc_type_param: docType,
    }); */
    const { data: existingEmbeds, error } = await supabaseClient
        .from("documents")
        .select("metadata")
        .contains("metadata", { doc_type: docType })
    //.filter("metadata->doc_type", "eq", docType);
    //.eq("metadata->>doc_type", "product"); // ✅ filter on metadata JSON field

    if (error) {
        console.error("❌ Error fetching existing embeddings:", error.message);
        return;
    }
    console.log(existingEmbeds.length, '⚠️⚠️⚠️⚠️');
    const existingProductIds = new Set(
        (existingEmbeds ?? [])
            .map((row) => row.metadata?.ref_id)
            .filter((id): id is string => !!id)
    );


    // 3. Fetch all ACTIVE products
    const products = await prisma.product.findMany({
        where: {
            title: {
                not: "", // Only products with non-empty titles
                  
            },
           /*  category:{
                name:{
                    in:['Laundry','Dry Cleaning','Finishing'],
                    mode:'insensitive'
                },
                parent:{
                    name:{
                        equals:'machines',
                        mode:'insensitive'
                    }
                    
                }
            } */
        },
        select: { 
            id: true,
            title: true,
            description: true,
             
        },
        orderBy: {
            title: "asc"
        },
        //take: 400
    });

    // 4. Filter only new products not already embedded
    const newProducts = products.filter(
        (p) => !existingProductIds.has(p.id)
    ); 

    if (newProducts.length === 0) {
        console.log("⚠️ All active products are already embedded.");
        return;
    }
 
    // 5. Prepare content and metadata
    const texts = newProducts.map((p) => `${p.title}: ${p.description}`);
    const metadata = newProducts.map((p) => ({
        doc_type: "product",
        ref_id: p.id,
        title: p.title,
         
    }));

    // 6. Initialize embedding model
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });
    console.log('⚠️⚠️⚠️⚠️');
    //return
    // 7. Store new embeddings
    const batchSize = 100;
    for (let i = 0; i < texts.length; i += batchSize) {
        const batchTexts = texts.slice(i, i + batchSize);
        const batchMetadata = metadata.slice(i, i + batchSize);

        await SupabaseVectorStore.fromTexts(
            batchTexts,
            batchMetadata,
            embeddings,
            {
                client: supabaseClient,
                tableName: "documents",
                queryName: "match_documents",
            }
        );  
    }
    console.log(`✅ ${newProducts.length} new products embedded successfully.`);
};
