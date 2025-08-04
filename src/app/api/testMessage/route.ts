import { sendWelcomMessage } from "@/lib/payement/sendMessage";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {
    const res = await req.json();
    sendWelcomMessage('programmingi77i@gmail.com')
    return NextResponse.json({success:true},{status:200});
}