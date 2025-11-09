import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decryptPassword } from '@/lib/crypto';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {

    const {userId} = await params;

    try {
        const secondaryEmails = await prisma.secondaryEmail.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                email: true,
                password: true,
                userId: true
            }
        })
        

        return NextResponse.json(secondaryEmails.map((s)=>({...s,password:decryptPassword(s.password!)})));
    } catch (error) {
        console.error('Error fetching secondary emails:', error)
        return NextResponse.json(
            { error: 'Failed to fetch secondary emails' },
            { status: 500 }
        )
    }
}



export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { email, password } = await request.json();
        const {userId} = await params;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingEmail = await prisma.secondaryEmail.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            )
        }

        const secondaryEmail = await prisma.secondaryEmail.create({
            data: {
                email,
                password,
                userId: userId
            }
        })

        return NextResponse.json(secondaryEmail)
    } catch (error) {
        console.error('Error creating secondary email:', error)
        return NextResponse.json(
            { error: 'Failed to create secondary email' },
            { status: 500 }
        )
    }
}