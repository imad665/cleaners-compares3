import { getServerSession } from "next-auth";
import { Header } from "./header";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function HeaderServer() {
    const session = await getServerSession(authOptions);
      //if(!session) redirect('/auth/login')
      console.log(session, '\\\\\\\\\\\\\\\\cm9lihb1e0000wne0uruq18u4');
      const users = await prisma.user.findMany();
      console.log(users);
    return (    
        <Header user={session?.user} />
    )
}