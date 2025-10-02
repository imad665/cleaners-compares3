import { prisma } from "@/lib/prisma";
import { deleteImageFileAt, saveImageFileAt, updateImageFileAt } from "@/lib/utils/saveImagesLocaly";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { generateUniqueSlug } from "@/lib/products/slugGen";
import { deleteCloudinaryFileByUrl, uploadFileToCloud } from "@/lib/cloudStorage";

async function deleteSubCategories() {
    try {
        const now = new Date();
        const categories = await prisma.category.findMany({
            where: {
                status: 'DELETING',
                deletedAt: { lte: now },
            },
        });

        for (const category of categories) {
            const id = category.id;

            //await prisma.product.deleteMany({ where: { category: { parentId: id } } });
            //await prisma.category.deleteMany({ where: { parentId: id } });
            const imagePath = category.imageUrl;
            if (imagePath) {
                const fileName = path.basename(imagePath);
                await deleteImageFileAt('subCategory', fileName)
            }

            await prisma.product.deleteMany({ where: { categoryId: id } });

            await prisma.category.delete({ where: { id } })
            return categories
        }
    } catch (error) {
        return null
    }
}




export async function GET() {

    try {
        const [categories, deleted] = await Promise.all([
            prisma.category.findMany({
                where: {
                    parentId: null,
                    status: { not: "DELETING" }
                },
                include: {
                    children: {
                        where: {
                            status: {
                                not: 'DELETING'
                            },
                        },
                        include: {
                            products: true
                        },
                    },
                },
            }),
            deleteSubCategories(),
        ])

        const formatted = categories.map((category, index) => ({
            id: category.id,
            name: category.name,
            isExpanded: index === 0,
            subcategories: category.children.map((sub) => ({
                id: sub.id,
                name: sub.name,
                slug: slugify(sub.name),
                products: sub.products.length,
                status: sub.status === 'HIDDEN' ? 'hidden' : sub.status === "ACTIVE" ? 'active' : 'deleting',
                deletedAt: sub.deletedAt,
                imageUrl: sub.imageUrl,
                description: sub.description,
            })),

        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error('[GET_SUBCATEGORIES_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }

}

/* export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get('name')?.toString();
        const parentCategoryId = formData.get('parentCategoryId')?.toString();
        const status = formData.get('status')?.toString();
        const description = formData.get('description') as string;
        const imageFile = formData.get('imageFile') as File;

        if (!name || !parentCategoryId || !status || !imageFile) {
            return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
        }

        // Get file extension
        const ext = path.extname(imageFile.name) || '.png';
        const uniqueFileName = `${uuidv4()}${ext}`;

        // Save image with unique name
        const { url: imageUrl } = await saveImageFileAt(imageFile, 'subCategory', uniqueFileName);

        // Save subcategory to DB
        //const slug = name.replace(/ /g, '-').toLowerCase();
        const slug = await generateUniqueSlug(name);
        const subcategory = await prisma.category.create({
            data: {
                name,
                imageUrl,
                status: status.toUpperCase(),
                parentId: parentCategoryId,
                description,
                slug
            },
        });

        return NextResponse.json({ success: true, subcategory }, { status: 201 });
    } catch (error) {
        console.error('Failed adding subcategory', error);
        return NextResponse.json({ success: false, error: 'Failed to add subcategory!' }, { status: 500 });
    }
} */

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name")?.toString();
        const parentCategoryId = formData.get("parentCategoryId")?.toString();
        const status = formData.get("status")?.toString();
        const description = (formData.get("description") as string) || "";
        const imageFile = formData.get("imageFile") as File | null;

        if (!name || !parentCategoryId || !status || !imageFile) {
            return NextResponse.json(
                { success: false, error: "Missing fields" },
                { status: 400 }
            );
        }

        // ✅ Upload image to Cloudinary
        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            const { url } = await uploadFileToCloud(imageFile, {
                folder: "subCategory",
                publicId: `${uuidv4()}-${imageFile.name}`,
            });
            imageUrl = url;
        }

        // ✅ Generate unique slug
        const slug = await generateUniqueSlug(name);

        // ✅ Save subcategory in DB
        const subcategory = await prisma.category.create({
            data: {
                name: name.trim(),
                imageUrl,
                status: status.toUpperCase(),
                parentId: parentCategoryId,
                description,
                slug,
            },
        });

        return NextResponse.json({ success: true, subcategory }, { status: 201 });
    } catch (error) {
        console.error("Failed adding subcategory:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add subcategory!" },
            { status: 500 }
        );
    }
}

/* export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string
        const name = formData.get('name') as string;
        const status = formData.get('status') as string;
        const imageFile = formData.get('imageFile') as File;
        const description = formData.get('description') as string;

        // Validate input
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing subcategory ID.' },
                { status: 400 }
            );
        }

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Name is required.' },
                { status: 400 }
            );
        }

        if (!status || !['ACTIVE', 'HIDDEN'].includes(status.toUpperCase())) {
            return NextResponse.json(
                { success: false, error: 'Invalid status. Must be ACTIVE or INACTIVE.' },
                { status: 400 }
            );
        }
        let imageUrl = formData.get('imageUrl') as string;
        //console.log(imageUrl,imageFile,typeof imageFile,';;;;;;;;;;;;;;');

        if (imageFile && imageFile != 'null') {
            const ext = path.extname(imageFile.name) || '.png';
            const uniqueFileName = `${uuidv4()}${ext}`;
            const { url } = await saveImageFileAt(imageFile, 'subCategory', uniqueFileName);

            if (imageUrl) {
                const fileName = path.basename(imageUrl);
                await deleteImageFileAt('subCategory', fileName)
            }
            imageUrl = url;
        }

        const slug = name.replace(/ /g, '-').toLowerCase();
        // Update subcategory
        const updatedSubCategory = await prisma.category.update({
            where: { id },
            data: {
                name: name.trim(),
                status: status.toUpperCase(),
                imageUrl,
                description,
                slug 
            },
        });

        return NextResponse.json({
            success: true,
            subcategory: updatedSubCategory,
        });
    } catch (error: any) {
        console.error('Failed to update subcategory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update subcategory.' },
            { status: 500 }
        );
    }
} */

export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData();
        const id = (formData.get("id") as string) || null;
        const name = (formData.get("name") as string) || null;
        const status = (formData.get("status") as string) || null;
        const description = (formData.get("description") as string) || null;

        if (!id?.trim()) {
            return NextResponse.json(
                { success: false, error: "Invalid or missing subcategory ID." },
                { status: 400 }
            );
        }

        if (!name?.trim()) {
            return NextResponse.json(
                { success: false, error: "Name is required." },
                { status: 400 }
            );
        }

        if (!status || !["ACTIVE", "HIDDEN"].includes(status.toUpperCase())) {
            return NextResponse.json(
                { success: false, error: "Invalid status. Must be ACTIVE or HIDDEN." },
                { status: 400 }
            );
        }

        // handle image
        const file = formData.get("imageFile") as File | null;
        let imageUrl = (formData.get("imageUrl") as string) || null;

        if (file && file != 'null' && file.size > 0) {
            // delete old file if exists
            if (imageUrl) {
                await deleteCloudinaryFileByUrl(imageUrl);
            }

            // upload new file to cloudinary
            const { url } = await uploadFileToCloud(file, {
                folder: "subCategory",
                publicId: `${uuidv4()}-${file.name}`,
            });
            imageUrl = url;
        }

        // slug
        const slug = name.replace(/ /g, "-").toLowerCase();

        // update DB
        const updatedSubCategory = await prisma.category.update({
            where: { id },
            data: {
                name: name.trim(),
                status: status.toUpperCase(),
                description,
                slug,
                imageUrl,
            },
        });

        return NextResponse.json({
            success: true,
            subcategory: updatedSubCategory,
        });
    } catch (error: any) {
        console.error("Failed to update subcategory:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update subcategory." },
            { status: 500 }
        );
    }
}
/* export async function DELETE(req: NextRequest) {

    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Subcategory ID is required.' },
                { status: 400 }
            );
        }

        const deletedAt = addDays(new Date(), 1);
        const category = await prisma.category.update({
            where: { id },
            data: {
                deletedAt,
                status: 'DELETING'
            }
        });

        return NextResponse.json({
            success: true,
            category: {
                ...category,
                slug: slugify(category.name)
            },
            message: 'Subcategory scheduled for deletion in 7 days.'
        });
    } catch (error) {
        console.error('Failed to delete subcategory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to schedule deletion for subcategory.' },
            { status: 500 }
        );
    }
} */


export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) { 
            return NextResponse.json(
                { success: false, error: "Subcategory ID is required." },
                { status: 400 }
            );
        }

        // ✅ Find subcategory first
        const category = await prisma.category.findUnique({
            where: { id },
            select: { id: true, name: true, imageUrl: true },
        });

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Subcategory not found." },
                { status: 404 }
            );
        }

        // ✅ Schedule deletion (soft delete)
        const deletedAt = addDays(new Date(), 7); // 7 days instead of 1 day
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                deletedAt,
                status: "DELETING",
            },
        });

        // ✅ Delete associated image from Cloudinary immediately (optional: or delay)
        if (category.imageUrl) {
            try {
                await deleteCloudinaryFileByUrl(category.imageUrl);
            } catch (err) {
                console.error("Cloudinary delete failed:", err);
                // we don’t block DB update even if Cloudinary fails
            }
        }

        return NextResponse.json({
            success: true,
            category: {
                ...updatedCategory,
                slug: slugify(updatedCategory.name, { lower: true }),
            },
            message: "Subcategory scheduled for deletion in 7 days.",
        });
    } catch (error) {
        console.error("Failed to delete subcategory:", error);
        return NextResponse.json(
            { success: false, error: "Failed to schedule deletion for subcategory." },
            { status: 500 }
        );
    }
}
