"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import MessageSidebar from "./MessageSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileSidebarSheetProps {
    inquiries: any[];
    userId: string;
    role: "BUYER" | "SELLER";
}

export default function MobileSidebarSheet({ inquiries, userId, role }: MobileSidebarSheetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden ml-2 z-40"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="w-5 h-5" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="absolute inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <div className={cn(
                "absolute top-0 left-0 h-full w-80 bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden border-r shadow-xl flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                    <h2 className="font-semibold">Messages</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <div className="overflow-y-auto flex-1" onClick={() => setIsOpen(false)}>
                    <MessageSidebar 
                        initialInquiries={inquiries} 
                        userId={userId} 
                        role={role} 
                    />
                </div>
            </div>
        </>
    );
}
