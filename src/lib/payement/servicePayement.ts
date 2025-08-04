import Stripe from "stripe";
import { dataFeatureService } from "./data";
 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function processPayement(key:string,metadata:{}) {
    const featured = dataFeatureService.find((d)=>d.key===key);
    const amount = featured?.amount;
    const value = featured?.value;
    const days = featured?.days;
    if(!amount) return null;
    metadata.days = days;
    const baseUrl = process.env.NEXTAUTH_URL;
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:[
            {
                price_data:{
                    currency:'gbp',
                    product_data:{
                        name:`${value} Featured Product`,
                    },
                    unit_amount:amount,
                },
                quantity:1,
            },
        ],
        mode:'payment',
        metadata:metadata,
        success_url:`${baseUrl}/admin/myServices?paymentSuccess=true&days=${days}`,
        cancel_url:`${baseUrl}/admin/myServices?paymentSuccess=false`
    })

    return session.url;


}