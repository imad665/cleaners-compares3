import { Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SignInUpModal } from "./header";
import SellerFormDialog from "../forms/sellerForm";
import SellerFormDialog2 from "../forms/sellerForm2";
import { useState } from "react";
import { useHomeContext } from "@/providers/homePageProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function ButtonSellAnItem({
    className,
    buttonClassName,
    body,
    path,
    variant,
    isEmail = false
}: {
    className?: string,
    buttonClassName?: string
    body?: React.ReactNode;
    path?: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    isEmail?: boolean;
}) {
    const [buttonLoading, setButtonLoading] = useState(false);
    const { user } = useHomeContext();
    const router = useRouter()
    const [openSellerDialog, setOpenSellerDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    function handleClickBigButton() {
        if (user) {
            router.push("/admin/addNewProduct")
            return
        }
        if (isEmail) {
            setOpenSignIn(true);
            return
        }
        if (user) {
            if (user.role.toLocaleLowerCase() === 'seller' || user.role.toLocaleLowerCase() === 'admin') {
                setButtonLoading(true);
                router.push(path ?? '/admin/addNewProduct')
            } else {
                setOpenSellerDialog(true);
            }
        } else {
            setOpenDialog(true);
        }
    }

    return (
        <div className={className}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Button
                    disabled={buttonLoading}
                    onClick={handleClickBigButton}
                    variant={variant}
                    className={cn(
                        "relative cursor-pointer overflow-hidden group",
                        "h-10 px-4", // Balanced header size
                        "bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500", // Gradient
                        "text-white font-bold text-sm tracking-tight rounded-lg",
                        "shadow-[0_2px_10px_0_rgba(59,130,246,0.3)] hover:shadow-[0_4px_14px_rgba(59,130,246,0.2)]", // Refined shadow
                        "border-none transition-all duration-300",
                        buttonClassName
                    )}
                >
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

                    <div className="flex items-center gap-2 relative z-10">
                        {!body ? (
                            <>
                                <div className="bg-white/20 p-0.5 rounded transition-transform duration-300 group-hover:rotate-90">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span className="uppercase tracking-wide text-md font-extrabold px-2" >SELL</span>
                            </>
                        ) : body}
                    </div>
                </Button>
            </motion.div>

            <SignInUpModal
                openSignIn={openSignIn}
                openSignUp={openSignUp}
                setOpenSignIn={setOpenSignIn}
                setOpenSignUp={setOpenSignUp}
                callback="/admin/addNewProduct"
            />
            {openSellerDialog && <SellerFormDialog callback="/admin/addNewProduct" open={openSellerDialog} setOpen={setOpenSellerDialog} />}
            {openDialog && <SellerFormDialog2 callback="/admin/addNewProduct" text="" open={openDialog} setOpen={setOpenDialog} />}
        </div>
    )
}