
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req:NextRequest) {
    const {days} = await req.json();

    const pricing = {
        1:200,
        2:400,
        7:500,
    };

    const amount = pricing[days];
    if(!amount){
        return NextResponse.json({error:"Invalid duration"},{status:400});
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:`${days}-Day Featured Product`,
                    },
                    unit_amount:amount
                },
                quantity:1
            },
        ],
        mode:'payment',
        metadata:{
            userId:'123456789Simo',
            days:days.toString(),
        },
        success_url:'http://localhost:3000/success',
        cancel_url:'http://localhost:300/cancel',
    });

    return NextResponse.json({url:session.url},{status:200});

}