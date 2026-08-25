'use client';

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ServiceTable from "@/components/adminDashboard/serviceTable";
import { ServiceFormDialog } from "@/components/adminDashboard/serviceEngineer";
import { useAdminServices } from "@/hooks/useAdminServices";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ServicesPage() {
    const { mutate } = useAdminServices();
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get('paymentSuccess');
    const days = searchParams.get('days');
    const [toastShown, setToastShown] = useState(false); // prevents duplicate toast
    const router = useRouter();

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
        <main className="py-10 px-4 bg-gray-50 min-h-screen min-w-full">
            <div className="min-w-full mx-auto overflow-auto">
                <div className="flex justify-between items-center mb-6 w-full">
                    <h1 className="text-2xl font-semibold">My Enginners</h1>

                    <ServiceFormDialog onSubmitSuccess={() => {
                        mutate();
                    }} />
                </div>

                <ServiceTable />
            </div>

            <div className="w-[100vw] h-30"></div>
        </main>
    );
}
