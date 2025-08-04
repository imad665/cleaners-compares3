import path from "path";
import fs from "fs/promises"
import { NextResponse } from "next/server";


export async function GET() {
    const logoPath = path.join(process.cwd(),'public', 'uploads', 'logo.png');

    try{
        const stat = await fs.stat(logoPath);
        return NextResponse.json({ version: stat.mtime.getTime() },{
            headers:{'Content-Type':'application/json'},
            status:200
        });
    }catch(e){
        return NextResponse.json({version: Date.now() },{status:200})
    }
}