import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/products/slugGen";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";


export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where:{parentId:null},
            include: {
                children: true,
                products: true,
            },
        });

        const data = categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: slugify(category.name, { lower: true }),
            subcategories: category.children.length,
            products: category.products.length,
            status: (category.products.length > 0 || category.status === 'ACTIVE') ? "active" : category.status.toLocaleLowerCase(),
            deletedAt:category.deletedAt
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("GET /api/admin/category error:", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, status } = body;
        const slug = await generateUniqueSlug(name)
        const category = await prisma.category.create({
            data: {
                name,
                description,
                status: status.toUpperCase(),
                slug
                //parent: parentId ? { connect: { id: parentId } } : undefined,
            },
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error("POST /api/admin/category error:", error);
        return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, name, status } = body;
        const slug = name.replace(/ /g, '-').toLowerCase();
        const updated = await prisma.category.update({
            where: { id },
            data: {
                name,
                status: status.toUpperCase(),
                slug,
            },
        });

        return NextResponse.json({ success: true, category: updated });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req:NextRequest) {
    try{
        const body = await req.json();
        const {id} = body;

        const deletedAt = addDays(new Date(),1);

        const category=await prisma.category.update({
            where:{id},
            data:{
                status:'DELETING',
                deletedAt
            }
        });

        /*await prisma.product.deleteMany({
            where:{categoryId:id},
        });

        await prisma.product.deleteMany({
            where:{category:{parentId:id}}
        });

        await prisma.category.deleteMany({
            where:{parentId:id}
        });

        await prisma.category.delete({
            where:{id},
        });*/
        return NextResponse.json({ success: true,category:{...category,slug:slugify(category.name)}, message: "Category scheduled for deletion." });
    }catch(error){
        console.error('DELETE error:',error);
        return NextResponse.json({status:false, error: "Failed to delete category" }, { status: 500 });
        
    }
}

