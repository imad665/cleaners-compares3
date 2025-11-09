import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; emailId: string }> }
) {

    const { userId, emailId } = await params;

    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Check if email already exists (excluding current email)
        const existingEmail = await prisma.secondaryEmail.findFirst({
            where: {
                email,
                id: { not: emailId }
            }
        })

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            )
        }

        const updatedEmail = await prisma.secondaryEmail.update({
            where: {
                id: emailId,
                userId: userId
            },
            data: { email }
        })

        return NextResponse.json(updatedEmail)
    } catch (error) {
        console.error('Error updating secondary email:', error)
        return NextResponse.json(
            { error: 'Failed to update secondary email' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; emailId: string }> }
) {

    const { userId, emailId } = await params;
    try {
        await prisma.secondaryEmail.delete({
            where: {
                id: emailId,
                userId: userId
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting secondary email:', error)
        return NextResponse.json(
            { error: 'Failed to delete secondary email' },
            { status: 500 }
        )
    }
}