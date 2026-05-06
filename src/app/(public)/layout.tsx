import { Header } from "@/components/header/header";
import { authOptions } from "@/lib/auth";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { getGeneralInquiries } from "@/lib/products/homeCategories";
import { getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { getServerSession } from "next-auth";
import Footer from "@/components/home_page/footer";
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const messages = await getNotifications();
    const session = await getServerSession(authOptions);
    const recentOrderCount = await getRecentOrdersCount();
    const user = session?.user;
    const { buyerInquiries, sellerInquiries } = await getGeneralInquiries(user);
    const footerData = await getFooterData()
    console.log('refreshed,');

    return (
        <div>
            <Header recentOrderCount={recentOrderCount} notificationData={[
                ...(messages || []),
                ...sellerInquiries,
                ...buyerInquiries
            ]} />
            {children}
            <Footer footerData={footerData} />
        </div>
    )
}