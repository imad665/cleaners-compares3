import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { notifySellerOfMessageAction } from "@/actions/actionSellerForm";

export default async function InquiryPage({
    params,
}: {
    params: { inquiryId: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const inquiry = await prisma.inquiry.findUnique({
        where: { id: params.inquiryId },
        include: {
            product: true,
            buyer: true,
            seller: true,
        },
        
    });

    if (!inquiry) return <div>Not found</div>;

    const isSeller =  session.user.role === "SELLER";
    const isBuyer =  session.user.role === "BUYER";

    // ✅ Fetch all inquiries with same buyerId + productId
    const conversation = await prisma.inquiry.findMany({
        where: {
            buyerId: inquiry.buyerId,
            productId: inquiry.productId,
        },
        include: {
            buyer: true,
            seller: true,
        },
        orderBy: { createdAt: "asc" }, // oldest first
    });
    for (const c of conversation) {
        await prisma.inquiry.update({
            where:{id:c.id},
            data:{
                sellerRead:c.sellerRead || isSeller,
                buyerRead:c.buyerRead || isBuyer
            }
        })
    }

    //console.log(conversation, 'fffffffffffffffffffffkkkgkgkggk');


    // ✅ Server Action to send a response
    async function sendResponse(formData: FormData) {
        "use server";
        const response = formData.get("response") as string;
        if (!response?.trim()) return;

        if (isSeller) {
            // Update the current inquiry with seller response
            await prisma.inquiry.update({
                where: { id: inquiry.id },
                data: {
                    response,
                    buyerRead: false,
                    sellerRead: true,
                },
            });
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

        revalidatePath(`/messages/${inquiry.id}`);
    }

    return (
        <div className="flex flex-col h-full p-6">
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">
                    {inquiry.product?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Buyer: {inquiry.buyer.name}
                </p>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 space-y-4 overflow-y-auto mb-6">
                {conversation.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                        {/* Buyer message */}
                        {msg.message && (
                            <div className="max-w-md p-3 rounded-lg bg-muted">
                                {msg.message}
                            </div>
                        )}

                        {/* Seller response */}
                        {msg.response && (
                            <div className="max-w-md p-3 rounded-lg bg-primary text-primary-foreground ml-auto">
                                {msg.response}
                            </div>
                        )}
                    </div>
                ))}
            </div>


            <form action={sendResponse} className="border-t pt-4">
                <div className="flex gap-2">
                    <input
                        name="response"
                        placeholder="Write your reply..."
                        type="text"
                        className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm"
                    >
                        Send
                    </button>
                </div>
            </form>

        </div>
    );
}