import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role != 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email } = await req.json();
    const seller = await prisma.user.findUnique({
        where: { email }
    });
    if (!seller) {
        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const token = await encode({
        token: {
            name: seller.name,
            email: seller.email,
            id: seller.id,
            role: seller.role,
            image: seller.image
        },
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: 60 * 60 * 24
    });

    (await cookies()).set('next-auth.session-token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return NextResponse.json({ success: true });

}