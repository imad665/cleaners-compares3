"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    message: string;
    response: string | null;
    createdAt: string;
    buyerRead: boolean;
    sellerRead: boolean;
    buyer: { image: string | null };
    seller: { image: string | null };
}

interface ChatWindowProps {
    initialConversation: Message[];
    inquiryId: string;
    buyerId: string;
    productId: string;
    sellerId: string;
    role: "BUYER" | "SELLER";
    sendResponseAction: (formData: FormData) => Promise<void>;
}

export default function ChatWindow({
    initialConversation,
    inquiryId,
    buyerId,
    productId,
    sellerId,
    role,
    sendResponseAction,
}: ChatWindowProps) {
    const [conversation, setConversation] = useState<Message[]>(initialConversation);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setConversation(initialConversation);
    }, [initialConversation]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/inquiries?buyerId=${buyerId}&productId=${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setConversation(data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [buyerId, productId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const formData = new FormData();
        formData.append("response", input);
        setInput("");

        await sendResponseAction(formData);
        router.refresh();
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 p-6">
            <div className="flex-1 space-y-6 overflow-y-auto mb-6 px-2 scroll-smooth" ref={scrollRef}>
                {conversation.map((msg) => {
                    const isBuyerMe = role === "BUYER";
                    const isSellerMe = role === "SELLER";

                    return (
                        <div key={msg.id} className="space-y-4">
                            {/* Buyer message */}
                            {msg.message && (
                                <div className={`flex items-end gap-2 ${isBuyerMe ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 overflow-hidden border">
                                        <img 
                                            src={msg.buyer?.image || "/user.png"} 
                                            alt="Buyer" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/user.png";
                                            }}
                                        />
                                    </div>
                                    <div className={`flex flex-col ${isBuyerMe ? "items-end" : "items-start"}`}>
                                        <div className={`max-w-md p-3 rounded-2xl text-sm ${
                                            isBuyerMe 
                                                ? "bg-primary text-primary-foreground rounded-br-none" 
                                                : "bg-muted rounded-bl-none"
                                        }`}>
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Seller response */}
                            {msg.response && (
                                <div className={`flex items-end gap-2 ${isSellerMe ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 overflow-hidden border">
                                        <img 
                                            src={msg.seller?.image || "/user.png"} 
                                            alt="Seller" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/user.png";
                                            }}
                                        />
                                    </div>
                                    <div className={`flex flex-col ${isSellerMe ? "items-end" : "items-start"}`}>
                                        <div className={`max-w-md p-3 rounded-2xl text-sm ${
                                            isSellerMe 
                                                ? "bg-primary text-primary-foreground rounded-br-none" 
                                                : "bg-muted rounded-bl-none"
                                        }`}>
                                            {msg.response}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} className="border-t pt-4">
                <div className="flex gap-2 items-center">
                    <input
                        name="response"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write your reply..."
                        type="text"
                        className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button
                        type="submit"
                        className="px-4 py-5 bg-primary text-primary-foreground rounded-xl text-sm"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}
