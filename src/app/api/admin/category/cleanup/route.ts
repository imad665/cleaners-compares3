
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try{
        
        //await deleteSubCategories();
        

        return NextResponse.json({
            success:true,
            //deletedCount:categories.length,
        })
    }catch(error){
        console.error('CRON Cleanup Error:', error);
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
    }
}