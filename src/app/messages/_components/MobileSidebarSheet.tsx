"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import MessageSidebar from "./MessageSidebar";
import { Button } from "@/components/ui/button";

interface MobileSidebarSheetProps {
    inquiries: any[];
    userId: string;
    role: "BUYER" | "SELLER";
}

export default function MobileSidebarSheet({ inquiries, userId, role }: MobileSidebarSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-2">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
                <SheetTitle className="p-4 border-b">Messages</SheetTitle>
                <div className="overflow-y-auto h-full">
                    <MessageSidebar 
                        initialInquiries={inquiries} 
                        userId={userId} 
                        role={role} 
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
