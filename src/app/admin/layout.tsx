import { HeaderAdmin, SideBarDesktop } from "@/components/adminDashboard/menu/menu"
import { authOptions } from "@/lib/auth";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { getGeneralInquiries } from "@/lib/products/homeCategories";
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
    const messages = await getNotifications();
    const { buyerInquiries, sellerInquiries } = await getGeneralInquiries(user);
    //await deleteUserTested()
    //console.log(user,'ooooooooooooooo')
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <HeaderAdmin notificationData={[
                ...(messages || []),
                ...sellerInquiries,
                ...buyerInquiries
            ]} />
            <div className="flex flex-1 overflow-hidden">
                <SideBarDesktop />
                <main className="flex-1 overflow-y-auto p-2">
                    {children}
                </main>
            </div>
        </div>
    )
}