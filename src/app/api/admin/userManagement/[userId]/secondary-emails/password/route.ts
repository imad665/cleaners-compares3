import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encryptPassword } from '@/lib/crypto';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {

    const {userId} =  await params;

    try {
        const { password } = await request.json()

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            )
        }

        // Update password for all secondary emails of this user

        const encryptedPassword = encryptPassword(password)

        await prisma.secondaryEmail.updateMany({
            where: {
                userId: userId
            },
            data: {
                password:encryptedPassword
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating secondary emails password:', error)
        return NextResponse.json(
            { error: 'Failed to update secondary emails password' },
            { status: 500 }
        )
    }
}