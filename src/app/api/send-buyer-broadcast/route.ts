// app/api/send-buyer-broadcast/route.ts
import { sendMessageBuyerAction } from '@/actions/send-message-buyer-action'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {

        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (user && user.role != 'ADMIN') return NextResponse.json({ message: '' }, { status: 401 });

        const formData = await request.json()
        const result = await sendMessageBuyerAction(formData)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error in broadcast API:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}