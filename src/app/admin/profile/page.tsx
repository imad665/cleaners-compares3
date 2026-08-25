import EditProfileForm from "@/components/adminDashboard/profilForm";
import { authOptions } from "@/lib/auth";
import { getSellerProfile } from "@/lib/functions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const revalidate = 18000; // ISR every 5 hours
export default async function Page() {
    const sellerProfile = await getSellerProfile();
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: {
            password: true,
            sellerProfile: {
                select: {
                    businessName: true,
                    phoneNumber: true,
                    city: true,
                    country: true,

                }
            }
        }
    })

    return (
        <div>
            <EditProfileForm
                id={sellerProfile!.id}
                password={user!.password}
                sellerProfile={sellerProfile?.sellerProfile}
            />
            <div className="w-full h-32"></div>
        </div>
    )
}





