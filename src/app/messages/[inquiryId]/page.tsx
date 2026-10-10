import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { notifySellerOfMessageAction } from "@/actions/actionSellerForm";
import ChatWindow from "../_components/ChatWindow";
import { ImageClient } from "./ImageClient";
import { MessageSquareDashed, MousePointerClick } from "lucide-react";
import { sendInquiryEmailNotification } from "./resendMessage";
import { after } from "next/server";
import MobileSidebarSheet from "../_components/MobileSidebarSheet";

export default async function InquiryPage({
    params,
}: {
    params: Promise<{ inquiryId: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    const { inquiryId } = await params;
    const userId = session.user.id;
    const role = session.user.role;

    const inquiry = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        include: {
            product: true,
            buyer: true,
            seller: true,
        },
    });

    const allInquiries = await prisma.inquiry.findMany({
        where:
            role === "SELLER"
                ? { sellerId: userId, sellerDeleted: false }
                : { buyerId: userId, buyerDeleted: false },
        include: {
            product: { select: { id: true, title: true, imagesUrl: true } },
            buyer: { select: { id: true, name: true, image: true } },
            seller: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
    });

    const groupedInquiriesMap = new Map();
    allInquiries.forEach(item => {
        const otherPartyId = role === 'SELLER' ? item.buyerId : item.sellerId;
        const key = `${item.productId}-${otherPartyId}`;
        if (!groupedInquiriesMap.has(key)) {
            groupedInquiriesMap.set(key, item);
        }
    });

    const inquiriesList = Array.from(groupedInquiriesMap.values());

    if (!inquiry) {
        return (
            <div className="flex flex-col h-full overflow-hidden relative">
                <div className="flex items-center border-b p-4 md:hidden">
                    <MobileSidebarSheet inquiries={inquiriesList} userId={userId} role={role as any} />
                    <span className="font-semibold ml-2">Select Conversation</span>
                </div>
                <div className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center bg-gray-50/50">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <MessageSquareDashed className="w-7 h-7" />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                        No Conversation Selected
                    </h3>

                    <p className="text-sm text-gray-500 max-w-sm mb-4">
                        Select a conversation from the left sidebar to view details and reply.
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-medium text-gray-600 rounded-lg border border-gray-200 shadow-2xs">
                        <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
                        <span>Click any message on the left to start</span>
                    </div>
                </div>
            </div>
        );
    }

    const isSeller = session.user.role === "SELLER";
    const isBuyer = session.user.role === "BUYER";

    const conversation = await prisma.inquiry.findMany({
        where: {
            buyerId: inquiry.buyerId,
            productId: inquiry.productId,
        },
        include: {
            buyer: { select: { image: true } },
            seller: { select: { image: true } },
        },
        orderBy: { createdAt: "asc" },
    });

    for (const c of conversation) {
        if ((isSeller && !c.sellerRead) || (isBuyer && !c.buyerRead)) {
            await prisma.inquiry.update({
                where: { id: c.id },
                data: {
                    sellerRead: c.sellerRead || isSeller,
                    buyerRead: c.buyerRead || isBuyer
                }
            })
        }
    }

    async function sendResponse(formData: FormData) {
        "use server";
        const response = formData.get("response") as string;
        if (!response?.trim()) return;

        if (isSeller) {
            // Find the latest inquiry without a response, or just the latest inquiry
            const latestInquiry = await prisma.inquiry.findFirst({
                where: {
                    buyerId: inquiry.buyerId,
                    productId: inquiry.productId,
                },
                orderBy: { createdAt: "desc" },
            });

            if (latestInquiry) {
                await prisma.inquiry.update({
                    where: { id: latestInquiry.id },
                    data: {
                        response,
                        buyerRead: false,
                        sellerRead: true,
                    },
                });

                after(async () => {
                    try {
                        await sendInquiryEmailNotification({
                            to: inquiry.buyer.email,
                            senderName: inquiry.seller.name,
                            senderRole: 'seller',
                            recipientRole: 'buyer',
                            message: response,
                            inquiryId: inquiry.id
                        });
                    } catch (error) {
                        console.error(error);
                    }
                });
            }
        } else if (isBuyer) {
            await notifySellerOfMessageAction({
                customerMessage: response,
                productId: inquiry.productId!,
                productImage: inquiry.product?.imagesUrl?.[0] || '',
                productName: inquiry.product?.title || '',
                productPath: '',
                sellerId: inquiry.sellerId,
                sellerName: inquiry.seller.name,
                customerId: inquiry.buyer.id,
                sellerEmail: inquiry.seller.email,
            });
        }

        revalidatePath(`/messages/${inquiryId}`);
    }

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            <div className="flex items-center gap-1 border-b flex-shrink-0 bg-background">
                <MobileSidebarSheet inquiries={inquiriesList} userId={userId} role={role as any} />
                <ImageClient inquiry={inquiry} isSeller={isSeller} />
                <div className="p-6 ">
                    <h2 className="text-lg font-semibold">
                        {inquiry.product?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {isSeller ? `Customer: ${inquiry.buyer.name}` : `Seller: ${inquiry.seller.name}`}
                    </p>
                </div>
            </div>


            <ChatWindow
                initialConversation={conversation}
                inquiryId={inquiryId}
                buyerId={inquiry.buyerId}
                productId={inquiry.productId!}
                sellerId={inquiry.sellerId}
                role={session.user.role as any}
                sendResponseAction={sendResponse}
            />
        </div>
    );
}
