import { authOptions } from "@/lib/auth";
import { deleteCloudinaryFileByUrl, uploadFileToCloud } from "@/lib/cloudStorage";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, redirect: '/login' }, { status: 401 });
        }

        const user = session.user;
        const wantedItems = (await prisma.wantedItem.findMany({
            where: { userId: user.id },
            include: {
                contactInfo: {
                    select: {
                        email: true,
                        phone: true,
                        fullName: true
                    }
                }
            }
        })).map((item) => (
            {
                id: item.id,
                title: item.title,
                location: item.location,
                description: item.description,
                datePosted: item.createdAt.toISOString().split('T')[0],
                email: item.contactInfo?.email,
                phone: item.contactInfo?.phone,
                imageUrl: item.imageUrl,
                fullName: item.contactInfo?.fullName
            }
        ))
        return NextResponse.json({ success: true, wantedItems }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: '' });
    }
}
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, redirect: '/login' });
        if (!session.user) return NextResponse.json({ success: false, redirect: '/unauthorize' });
        const user = session.user;

        const formData = await req.formData();
        // console.log(formData,'9999999');

        const title = formData.get('title') as string;
        const location = formData.get('location') as string;
        const description = formData.get('description') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const imageFile = formData.get('imageFile') as File || null;
        const fullName = formData.get('fullName') as string;
        let imageUrl = formData.get('imageUrl') as string;

        if (!title || !location || !description   || !phone || !email) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        if (imageFile && imageFile.size > 0) {
            const { url, public_id } = await uploadFileToCloud(imageFile);
            imageUrl = url;
        }
        if(!imageUrl){
            imageUrl = '/uploads/ImageUnavailable.jpg'
        }


        const wantedItem = await prisma.wantedItem.create({
            data: {
                title,
                location,
                description,
                imageUrl,
                userId: user.id, // you must provide a real userId based on your auth
                contactInfo: {
                    create: {
                        phone,
                        email,
                        fullName,
                    },
                },
            },
        });

        return NextResponse.json(wantedItem, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, redirect: '/login' });
        if (!session.user) return NextResponse.json({ success: false, redirect: '/unauthorize' });

        const formData = await req.formData();



        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const location = formData.get('location') as string;
        const description = formData.get('description') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const fullName = formData.get('fullName') as string;
        const imageFile = formData.get('imageFile') as File || null;
        let imageUrl = formData.get('imageUrl') as string;
        console.log(imageFile);

        if (!title || !location || !description || !imageFile || !phone || !email) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        if (imageFile && imageFile.size > 0) {
            const { url, public_id } = await uploadFileToCloud(imageFile);
            imageUrl = url;

            const wanted = await prisma.wantedItem.findFirst({
                where: { id },
                select: { imageUrl: true }
            });

            if (wanted?.imageUrl) {
                deleteCloudinaryFileByUrl(wanted.imageUrl);
            }
        }
        const wantedItem = await prisma.wantedItem.update({
            where: { id },
            data: {
                title,
                location,
                description,
                imageUrl,
                contactInfo: {
                    update: {
                        phone,
                        email,
                        fullName
                    },
                },
            },
        });

        return NextResponse.json(wantedItem, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) redirect('/login');
        const { id } = await req.json();

        const deleted = await prisma.wantedItem.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'the item deleted successfuly' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'failed to delete item' })
    }
}