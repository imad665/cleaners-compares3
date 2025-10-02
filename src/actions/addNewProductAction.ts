'use server'
import { authOptions } from "@/lib/auth";
import { deleteCloudinaryFileByUrl, uploadFileToCloud } from "@/lib/cloudStorage";
import { embedProductsToNeon } from "@/lib/langchain/embeding/embed-products";
import { reembedByRefId, removeEmbeddingByRefId } from "@/lib/langchain/embeding/utils/embed-handler";
import { processPayement } from "@/lib/payement/product-feature";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/products/slugGen";
import { deleteImageFileAt } from "@/lib/utils/saveImagesLocaly";
import { getServerSession } from "next-auth";
import slugify from "slugify";
//import { uploadFileToCloud } from "@/lib/cloudStorage"; // You can implement this based on your file upload logic

async function getSellerId() {
    const session = await getServerSession(authOptions);
    return session && session.user && session.user.id;
}



export async function addNewProductAction(prev: any, formData: FormData) {
    const sellerId = await getSellerId();
    if (!sellerId) return { success: false, redirect: '/login' };
    const productId = formData.get('productId')?.toString().trim();

    //console.log(formData, productId, 'ssssssss');
    const submitType = formData.get('submitType')?.toString().trim(); // 'post' | 'draft'
    const productName = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const product_condition = formData.get('product_condition')?.toString().trim().toUpperCase(); // 'new' | 'like_new' | 'used'
    const price = parseFloat(formData.get('price')?.toString().trim() || "0");
    const discount = parseFloat(formData.get('discount')?.toString().trim() || "0");
    let discountEnd = formData.get('discountEndDate')?.toString().trim();
    const units = parseInt(formData.get('units')?.toString().trim() || "0");
    const imagesFile = formData.getAll('imagesFile') as File[]; // this will be an array of files
    const imageUrls: string[] = formData.getAll('imageUrls').map(i=>i.toString()); // this will be an array of files
    const videoFile = formData.get('videoFile') as File; // this will be an array of files
    let videoUrl = formData.get('videoUrl'); // this will be an array of files
    const category = formData.get('category')?.toString().trim();
    const subCategory = formData.get('subCategory')?.toString().trim();
    const subcategoryId = formData.get('subcategoryId')?.toString().trim();
    const featuredDuration = formData.get('featuredDuration');
    const productWeight = formData.get('weight')?.toString().trim() || null;
    const machineDeliveryCharge = formData.get("delivery_charge")?.toString().trim() || null;
    const vat = formData.get('vat') // inc or exc
    const stock = parseFloat(formData.get('stock')?.toString().trim() || "0");
    const isIncVAT = vat === 'inc';

    //console.log(machineDeliveryCharge,productWeight,isIncVAT,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    
    // Validate required fields
    /* console.log(submitType,productName,description,product_condition);
    console.log(price,discount,discountEnd,category,subCategory);
    console.log(imagesFile.length,imageUrls.length ,subcategoryId); */
    
    if (!submitType || !productName || !description || !product_condition  ||
        !price ||
        !category || !subCategory ||
        (imagesFile.length === 0 && imageUrls.length === 0) ||
        !subcategoryId
    ) {
        return { success: false, error: 'All fields are required.---' };
    }

    // Check for subcategory existence under the given category
    const subcategory = await prisma.category.findFirst({
        where: {
            id: subcategoryId
        }
    });

    if (!subcategory) {
        return { success: false, error: 'This subcategory does not exist.' };
    }

    // Upload images to cloud storage (you should implement this method in your cloudStorage helper)

    for (const image of imagesFile) {
        const { url, public_id } = await uploadFileToCloud(image); // Upload each image and get the URL
        //console.log(url,public_id);
        imageUrls.push(url);
    }

    if (videoFile) {
        const { url, public_id } = await uploadFileToCloud(videoFile); // Upload video and get URL
        videoUrl = url;
    }


    if (!discountEnd && discount>0) {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 30);

        // Format as YYYY-MM-DD
        discountEnd = futureDate.toISOString().split('T')[0];
    }

    // Create the product in the database
    //return {success:true,message:'test'}
    //const slug = productName.replace(/ /g, '-').toLowerCase();
    //const slug = generateSlug();
    const slug = await generateUniqueSlug(productName)

    const discountAmount = price * (discount / 100);
    const discountedPrice = price - discountAmount;
    if (productId) {
        const product = await prisma.product.findFirst({
            where: { id: productId },
            select: {
                imagesUrl: true,
                videoUrl: true,
            }
        })
        const oldImages = product?.imagesUrl || [];
        const oldVideoUrl = product?.videoUrl || undefined;
        const urlsToDelete = oldImages.filter(url => !imageUrls.includes(url));
        urlsToDelete.forEach(async (url) => {
            await deleteCloudinaryFileByUrl(url)
        })

        if (oldVideoUrl) {
            await deleteCloudinaryFileByUrl(oldVideoUrl);
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                title: productName,
                description,
                price,
                discountPercentage: discount,
                discountPrice: discount > 0 ? discountedPrice : undefined,
                isDealActive: discount > 0,
                dealEndDate: discountEnd ? new Date(discountEnd + "T00:00:00.000Z") : undefined,
                dealStartDate: discountEnd ? new Date() : undefined,
                units: units,
                delivery_charge:parseFloat(machineDeliveryCharge),
                weight: parseFloat(productWeight!),
                isIncVAT:isIncVAT,
                condition: (product_condition as 'USED' | 'NEW'),
                imagesUrl: imageUrls,
                videoUrl: videoUrl?.toString() || null, // Optional, it can be null
                categoryId: subcategory.id,
                slug,
                sellerId: sellerId,
                featureDays: featuredDuration?.toString() || null,
                stock
            }
        });
        //console.log(updatedProduct,featuredDuration,';;;;;;;;;;;;');
        
        if (featuredDuration?.toString() && !updatedProduct.isFeatured) {
            const url = await processPayement(featuredDuration.toString(), { productId: updatedProduct.id, type: 'product-feature' });
            await reembedByRefId(productId)
            return { success: true, url, message: 'Product successfully created.' };

        }
        await reembedByRefId(productId)
        return { success: true, message: 'Product updated successfuly!' };
    }
    else {
        //console.log(featuredDuration?.toString(),'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
        
        const newProduct = await prisma.product.create({
            data: {
                title: productName,
                description,
                price,
                discountPercentage: discount,
                discountPrice: discount > 0 ? discountedPrice : undefined,
                isDealActive: discount > 0,
                dealEndDate: discountEnd ? new Date(discountEnd + "T00:00:00.000Z") : undefined,
                dealStartDate: discountEnd ? new Date() : undefined,
                units: units,
                weight: parseFloat(productWeight!),
                delivery_charge:parseFloat(machineDeliveryCharge),
                condition: (product_condition as 'USED' | 'NEW'),
                imagesUrl: imageUrls,
                isIncVAT:isIncVAT,
                videoUrl: videoUrl?.toString() || null, // Optional, it can be null
                categoryId: subcategory.id,
                slug,
                sellerId: sellerId,
                featureDays: featuredDuration?.toString() || null,
                isFeatured: false,
                stock
            }
        });
        
        if (featuredDuration?.toString()) {
            const url = await processPayement(featuredDuration.toString(), { productId: newProduct.id, type: 'product-feature' });
            await embedProductsToNeon();
            return { success: true, url, message: 'Product successfully created.' };
        }
        await embedProductsToNeon(); 
        return { success: true, url: '/admin/allProducts', message: 'Product successfully created.' };
    }



}
