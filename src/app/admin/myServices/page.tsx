'use client';

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ServiceTable from "@/components/adminDashboard/serviceTable";
import ServiceForm from "@/components/adminDashboard/serviceEngineer";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ServicesPage() {

    const [open, setOpen] = useState(false);
    const [newService, setNewService] = useState(null);
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get('paymentSuccess');
    const days = searchParams.get('days');
    const [toastShown, setToastShown] = useState(false); // prevents duplicate toast
    const router = useRouter();
    const onSubmitSuccess = (v: any) => {
        setNewService(v)
        setOpen(false)
    }
    useEffect(() => {
        if (!toastShown && paymentSuccess) {
            if (paymentSuccess === 'true') {
                toast.success(`✅ Payment successful! Featured for ${days} day(s).`);
            } else if (paymentSuccess === 'false') {
                toast.error('❌ Payment failed or was canceled.');
            }

            setToastShown(true); // prevent toast on rerender

            // OPTIONAL: remove params from URL after showing toast
            const newUrl = window.location.pathname;
            router.replace(newUrl);
        }
    }, [paymentSuccess, days, toastShown, router]);

    return (
        <main className="py-10 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">My Enginners</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white ">+ Add New Enginner</Button>
                        </DialogTrigger>
                        <DialogContent className=" min-w-fit">
                            <DialogHeader>
                                <DialogTitle>Add New Enginner</DialogTitle>
                            </DialogHeader>
                            <ServiceForm onSubmitSuccess={onSubmitSuccess} />
                        </DialogContent>
                    </Dialog>
                </div>

                <ServiceTable newService={newService} />
            </div>

            <div className="w-[100vw] h-30"></div>
        </main>
    );
}
