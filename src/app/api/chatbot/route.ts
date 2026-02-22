import { askStoreBot } from "@/lib/langchain/chatbot2";
import getLLmApiKey from "@/lib/langchain/embeding/llm_api_key";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { initChatModel } from "langchain";

export async function POST(req:NextRequest) {
    const {question} = await req.json();

    if(!question || typeof question !== 'string'){
        return NextResponse.json({error:'Missing or invalid question'},{status:400})
    }

    try{
        //const answer = await askStoreBot(question)
        const { apikey, geminiApiKey } = await getLLmApiKey()
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.7,
            apiKey:apikey,
           
        });
        const systemMessage = new SystemMessage('you are a helpful assistant.');
        const humanMessage = new HumanMessage("hello!");
        const response = await model.invoke([systemMessage, humanMessage]);

         
        return NextResponse.json({ response }, { status: 200 })
        //return NextResponse.json({answer});
    }catch(error){
        console.log('Chatbot error:',error);
        return NextResponse.json({error:'Failed to generate answer'},{status:500})
        
    }
}