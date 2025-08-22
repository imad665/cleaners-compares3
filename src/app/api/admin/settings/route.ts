import {  NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import path from 'path';
import fs from 'fs/promises';
export async function GET() {
    try {
        const allstg: { [key: string]: any } = {}
        const settings = await prisma.adminSetting.findMany();
        settings.forEach((s) => {
            allstg[s.key] = s.value;
        })
        return NextResponse.json({ success: true, allstg }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'something went wrong!' }, { status: 500 })
    }
}


export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const keysDays = []


         
        for (const [key, value] of formData.entries()) {
            console.log(`Key: ${key}, Value: ${value}`);
            if (key.includes('days_')) keysDays.push(key);
            if (key !== 'logo') {
                const stringValue = typeof value === 'string' ? value : value.name;
                await prisma.adminSetting.upsert({
                    where: { key: key },
                    update: { value: stringValue },
                    create: { key: key, value: stringValue },
                });
            }
        }
        if (keysDays.length > 0) {
            await prisma.adminSetting.deleteMany({
                where: {
                    key: {
                        startsWith: 'days_',
                        notIn: keysDays, // dd is your array of allowed keys
                    },
                },
            });
        }

        const logoFile = formData.get('logo') as File | null;

        if (logoFile) {
            const buffer = await logoFile.arrayBuffer();
            const bytes = Buffer.from(buffer);

            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });

            const logoPath = path.join(uploadDir, 'logo.png');

            // Delete old logo.png if exists (optional)
            try {
                await fs.unlink(logoPath);
            } catch (err) {
                // File might not exist yet — no problem
            }

            // Save the new logo as logo.png
            await fs.writeFile(logoPath, bytes);

            return NextResponse.json({
                success: true,
                message: 'Logo updated successfully',
                logoPath: `/uploads/logo.png`,
            }, { status: 200 });
        }
        else {
            return NextResponse.json({
                success: true,
                message: 'Settings saved successfully',
            }, { status: 200 });
        }

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to save settings'
        }, { status: 500 });
    }
}