import { Header } from "@/components/header/header";
import { authOptions } from "@/lib/auth";
import { getNotifications } from "@/lib/payement/get-notification-for-icon";
import { getGeneralInquiries } from "@/lib/products/homeCategories";
import { getFeaturedProducts, getFooterData, getRecentOrdersCount } from "@/lib/products/homeProducts";
import { getServerSession } from "next-auth";
import Footer from "@/components/home_page/footer";
import { FeaturedAndProducts } from "@/components/home_page/featured_product";
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [
        featuredProducts,
        /* footerData, */
    ] = await Promise.all([
        getFeaturedProducts({ page: 1, pageSize: 10 }),
        /*  getFooterData(), */
    ]);
    //console.log('refreshed,');

    return (
        <div>
            {children}
            <FeaturedAndProducts initFeaturedProducts={featuredProducts.editProducts} />
        </div>
    )
}