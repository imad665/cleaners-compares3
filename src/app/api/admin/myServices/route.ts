import { authOptions } from "@/lib/auth";
import { embedEngineersToNeon } from "@/lib/langchain/embeding/embed_enginner";
import { processPayement } from "@/lib/payement/servicePayement";
import { prisma } from "@/lib/prisma";
import { deleteImageFileAt, saveImageFileAt } from "@/lib/utils/saveImagesLocaly";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from 'uuid';
import { nullable } from "zod";
const tempData = [
    {
        title: "Dry Cleaning Expert",
        description: "High-quality dry cleaning with same-day service.",
        ratePerHour: 25,
        callOutCharge: 10,
        areaOfService: "London",
        address: "123 Baker Street, London NW1 6XE",
        companyType: "Private",
        experience: "5 years",
        email: "drycleaner@example.com",
        contactNumber: "07123456789",
        pictureUrl: "/test/ai_home.jpeg"
    },
    {
        title: "Home Cleaning Specialist",
        description: "Detailed residential cleaning with eco-friendly products.",
        ratePerHour: 20,
        callOutCharge: 8,
        areaOfService: "Manchester",
        address: "45 Kings Road, Manchester M16 0NS",
        companyType: "Freelancer",
        experience: "3 years",
        email: "homeclean@example.com",
        contactNumber: "07234567890",
        pictureUrl: "/images/home_cleaning.jpeg"
    },
    {
        title: "Commercial Cleaning Pro",
        description: "Reliable office and warehouse cleaning with flexible hours.",
        ratePerHour: 30,
        callOutCharge: 15,
        areaOfService: "Birmingham",
        address: "88 Industrial Way, Birmingham B1 2NP",
        companyType: "Agency",
        experience: "7 years",
        email: "commercialclean@example.com",
        contactNumber: "07345678901",
        pictureUrl: "/images/commercial_cleaning.jpeg"
    },
    {
        title: "Window Cleaning Expert",
        description: "Streak-free window cleaning for homes and offices.",
        ratePerHour: 22,
        callOutCharge: 12,
        areaOfService: "Leeds",
        address: "22 Hilltop Avenue, Leeds LS6 2PY",
        companyType: "Private",
        experience: "4 years",
        email: "windowpro@example.com",
        contactNumber: "07456789012",
        pictureUrl: "/images/window_cleaning.jpeg"
    },
    {
        title: "Deep Cleaning Technician",
        description: "Thorough deep cleaning for kitchens, bathrooms, and carpets.",
        ratePerHour: 28,
        callOutCharge: 14,
        areaOfService: "Glasgow",
        address: "76 River Street, Glasgow G1 1XX",
        companyType: "Freelancer",
        experience: "6 years",
        email: "deepclean@example.com",
        contactNumber: "07567890123",
        pictureUrl: "/images/deep_cleaning.jpeg"
    }
]




export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
        }

        const userId = session.user.id;

        const services = await prisma.service.findMany({
            where: { userId },
            orderBy: [

                { createdAt: 'desc' }
            ],
        });

        return NextResponse.json({ success: true, services });

    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) redirect('/login');

        const userId = session.user.id;

        const formData = await req.formData();
        const file = formData.get('picture') as File | null;

        let pictureUrl: string | null = null;

        if (file && file.size > 0) {
            const fileName = `${uuidv4()}-${file.name}`;
            const { url } = await saveImageFileAt(file, 'uploads/services', fileName)
            pictureUrl = url;
        }
        //console.log(formData);

        const featureDays = formData.get('featureDays')?.toString() === 'null' || formData?.get('featureDays') === 'undefined' ? null : formData.get('featureDays') as string;
        //console.log(featureDays,formData.get('featureDays'),'ooooooollllllkkkkkkkk');
         
        const service = await prisma.service.create({
            data: {
                title: formData.get('title') as string,
                callOutCharges: parseFloat(formData.get('callOutCharge') as string),
                ratePerHour: parseFloat(formData.get('hourlyRate') as string),
                experience: formData.get('experience') as string,
                areaOfService: formData.get('areaOfService') as string,
                email: formData.get('email') as string,
                contactNumber: formData.get('contactNumber') as string,
                companyType: formData.get('companyType') as any,
                address: formData.get('address') as string,
                description: formData.get('description') as string,
                isFeatured: false,
                isEnabled: formData.get('enabled') === 'true',
                category: formData.get('category') as any,
                featureDays: featureDays,
                pictureUrl: pictureUrl,
                userId: userId, // you must set this from session/auth
            },
        });
        await embedEngineersToNeon();
        if (featureDays?.toString()) {
            const url = await processPayement(featureDays.toString(), { productId: service.id, type: 'service-feature' });
            return NextResponse.json({ success: true, url, service, pictureUrl })
        }

        return NextResponse.json({ success: true, service, pictureUrl })

    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) redirect('/login');

        const formData = await req.formData();
        const id = formData.get('id') as string || null;

        if (!id?.trim())
            return NextResponse.json({ success: false, error: 'id required' });

        const file = formData.get('picture') as File | null;
        let pictureUrl = formData.get('pictureUrl') as string | null;

        //console.log(formData, 'oooooooooooooooooo');

        if (file && file.size > 0) {
            const fileName = `${uuidv4()}-${file.name}`;
            if (pictureUrl)
                await deleteImageFileAt('uploads/services', pictureUrl.split('/').pop());

            const { url } = await saveImageFileAt(file, 'uploads/services', fileName)
            pictureUrl = url;
        }
        const featureDays = formData.get('featureDays')?.toString() === 'null' ? null : formData.get('featureDays') as string;
        const service = await prisma.service.update({
            where: { id },
            data: {
                title: formData.get('title') as string,
                callOutCharges: parseFloat(formData.get('callOutCharge') as string),
                ratePerHour: parseFloat(formData.get('hourlyRate') as string),
                experience: formData.get('experience') as string,
                areaOfService: formData.get('areaOfService') as string,
                email: formData.get('email') as string,
                contactNumber: formData.get('contactNumber') as string,
                companyType: formData.get('companyType') as any,
                address: formData.get('address') as string,
                description: formData.get('description') as string,
                isEnabled: formData.get('enabled') === 'true',
                category: formData.get('category') as any,
                featureDays: featureDays,
                pictureUrl: pictureUrl,
            }
        })
        if (featureDays?.toString() && !service.isFeatured) {
            const url = await processPayement(featureDays.toString(), { productId: service.id, type: 'service-feature' });
            return NextResponse.json({ success: true, url, service, pictureUrl })
        }
        return NextResponse.json({ success: true, service, pictureUrl })

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 })
    }
}


export async function DELETE(req: NextRequest) {
    try {

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, error: 'the id required' }, { status: 400 });

        const deletedService = await prisma.service.delete({
            where: { id },
            select: {
                pictureUrl: true
            }
        });

        const pictureUrl = deletedService.pictureUrl;
        if (pictureUrl)
            await deleteImageFileAt('uploads/services', pictureUrl.split('/').pop());


        return NextResponse.json({ success: true, message: 'the service deleted successfuly' }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ success: false, error: 'failed to delete the service' }, { status: 500 });
    }
}