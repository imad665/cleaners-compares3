import { askStoreBot } from "@/lib/langchain/chatbot2";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const {question} = await req.json();

    if(!question || typeof question !== 'string'){
        return NextResponse.json({error:'Missing or invalid question'},{status:400})
    }

    try{
        const answer = await askStoreBot(question)
        return NextResponse.json({answer});
    }catch(error){
        console.log('Chatbot error:',error);
        return NextResponse.json({error:'Failed to generate answer'},{status:500})
        
    }
}