import { authOptions } from "@/lib/auth";
import { deleteCloudinaryFileByUrl, uploadFileToCloud } from "@/lib/cloudStorage";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) redirect('/login');
        const user = session.user;
        const myBusinesses = (await prisma.businessForSale.findMany({
            where: { userId: user.id },
            include: {
                contactInfo: {
                    select: {
                        fullName: true,
                        email: true,
                        phone: true,
                    }
                }
            }

        })).map((item) => (
            {
                id: item.id,
                description: item.description,
                email: item.contactInfo?.email,
                phone: item.contactInfo?.phone,
                fullName: item.contactInfo?.fullName,
                imageUrl: item.imageUrl,
                location: item.location,
                title: item.title,
                turnoverRange: item.annualTurnover,
                businessType: item.businessType,
                reasonForSelling: item.reasonFoSale,
                datePosted: item.createdAt.toISOString().split('T')[0],
            }
        ));
        return NextResponse.json({ success: true, myBusinesses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'failed to fetch data' }, { status: 500 });
    }
}

`id : string
    description : string 
    email :string 
    phone : string
    imageUrl : string 
    location : string 
    title : string 
    turnoverRange : string
    fullName : string 
    businessType : string
    reasonForSelling : string`
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions); 
        if(!session || !session.user) redirect('/login'); 

        const userId = session.user.id;

        const formData = await req.formData();
        //console.log(formData);
         
        const title = formData.get('title')?.toString() || "";
        const location = formData.get('location')?.toString() || "";
        const fullName = formData.get('fullName')?.toString() || "";
        const email = formData.get('email')?.toString() || "";
        const phone = formData.get('phone')?.toString() || "";
        const description = formData.get('description')?.toString() || "";
        const businessType = formData.get('businessType')?.toString() || "";
        const turnoverRange = formData.get('turnoverRange')?.toString() || "";
        const reasonForSelling = formData.get('reasonForSelling')?.toString() || "";
        const imageFile = formData.get('imageFile') as File || null;
        let imageUrl = formData.get('imageUrl')?.toString() || "";
        
        
        if(imageFile && imageFile.size > 0){
            const {url,public_id} = await uploadFileToCloud(imageFile);
            imageUrl = url;    

        }
  
        const newBusiness = await prisma.businessForSale.create({
            data: {
                title,
                location,
                contactInfo: {
                    create: {
                        email,
                        phone,
                        fullName,
                    }
                },
                description,
                businessType,
                annualTurnover: turnoverRange,
                reasonFoSale: reasonForSelling,
                imageUrl,
                userId

            }
        })

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: '' }, { status: 500 })

    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions); 
        if(!session || !session.user) redirect('/login'); 

        const formData = await req.formData();
        console.log(formData);
        const id = formData.get('id')?.toString() || "";
        const title = formData.get('title')?.toString() || "";
        const location = formData.get('location')?.toString() || "";
        const fullName = formData.get('fullName')?.toString() || "";
        const email = formData.get('email')?.toString() || "";
        const phone = formData.get('phone')?.toString() || "";
        const description = formData.get('description')?.toString() || "";
        const businessType = formData.get('businessType')?.toString() || "";
        const turnoverRange = formData.get('turnoverRange')?.toString() || "";
        const reasonForSelling = formData.get('reasonForSelling')?.toString() || "";
        const imageFile = formData.get('imageFile') as File || null;
        let imageUrl = formData.get('imageUrl')?.toString() || "";

        if(imageFile && imageFile.size > 0){
            const {url,public_id} = await uploadFileToCloud(imageFile);
            imageUrl = url; 
            
            const business = await prisma.businessForSale.findFirst({
                where:{id},
                select:{imageUrl:true}
            })
            if(business?.imageUrl){
                deleteCloudinaryFileByUrl(business.imageUrl);
            }
        }
        const updated = await prisma.businessForSale.update({
            where: { id },
            data: {
                title,
                location,
                contactInfo: {
                    update: {
                        email,
                        phone,
                        fullName,
                    }
                },
                description,
                businessType,
                annualTurnover: turnoverRange,
                reasonFoSale: reasonForSelling,
                imageUrl,
            }
        })

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: '' }, { status: 500 })
    }
}

export async function DELETE(req:NextRequest) {
    try{
        const session = await getServerSession(authOptions); 
        if(!session || !session.user) redirect('/login'); 


        const {id} = await req.json();
        
        const deleted = await prisma.businessForSale.delete({
            where:{id}
        })

        return NextResponse.json({success:true,message:'item deleted successfuly.'},{status:200});
    }catch(error){
        return NextResponse.json({success:false,error:"failed to delete an item"});
    }
}