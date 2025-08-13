import { HeaderAdmin, SideBarDesktop  } from "@/components/adminDashboard/menu/menu"
import { authOptions } from "@/lib/auth";
import deleteUserTested from "@/lib/update-db";
import { getServerSession } from "next-auth";
 


export default async function Layout(
    {
        children
    }: {
        children: React.ReactNode
    }
) {
    //await prisma.category.deleteMany();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    //await deleteUserTested()
    //console.log(user,'ooooooooooooooo')
    return (
        <div className="flex w-full h-[100vh] overflow-hidden">
            {/*  <NavMobile />
            <NavDesktop /> */}
            
            <div className="h-[100vh] w-[100vw]">
                
                <HeaderAdmin />
                <div className="flex h-[100vh] ">
                    <SideBarDesktop />
                    
                    <div className="h-full overflow-auto p-2">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    )
}