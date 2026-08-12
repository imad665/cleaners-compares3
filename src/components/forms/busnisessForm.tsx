'use client'

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    CircleDollarSign,
    MapPin,
    Building2,
    Tag,
    AlignLeft,
    User,
    Mail,
    Phone,
    Upload,
    X,
    Loader2,
    Store,
    PoundSterling,
    Briefcase
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { businessSchema, type BusinessSchema } from "@/lib/schemas/businessSchema";
import { toast } from "sonner";
import { useHomeContext } from "@/providers/homePageProvider";
import SellerFormDialog from "./sellerForm";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface BusinessType {
    id?: string;
    title?: string;
    location?: string;
    description?: string;
    datePosted?: string;
    turnoverRange0?: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
    reasonForSelling?: string;
    businessType?: string;
    open?: boolean;
    setOpen?: (v: boolean) => void;
    fullName?: string;
    onSubmitSuccess?: () => void;
}

export function BusinessListingForm({
    id, title, location, description, datePosted,
    turnoverRange0, email, phone, imageUrl, reasonForSelling,
    businessType, fullName, onSubmitSuccess
}: BusinessType) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<any>(imageUrl);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showSellerForm, setShowSellerForm] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter()

    const { user } = useHomeContext();
    const role = user?.role;

    const form = useForm<BusinessSchema>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            title: title || "",
            businessType: businessType || "Commercial Laundry",
            location: location || "",
            turnoverRange: turnoverRange0 || "100k - 250k",
            reasonForSelling: reasonForSelling || "Retirement",
            email: email || '',
            phone: phone || '',
            description: description || '',
            imageUrl: imageUrl || '',
            datePosted: datePosted,
            id: id || '',
            fullName: fullName || ''
        }
    });

    const turnoverRange = form.watch("turnoverRange");
    const showSpecificAmount = turnoverRange === "Specific amount";

    const reasons = [
        "Retirement",
        "Relocation",
        "Career Change",
        "Pursuing Another Business",
        "Other",
    ];

    const clearImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        form.setValue("imageUrl", "");
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const values = form.getValues();
        if (!values.title.trim()) {
            toast.error("Business Title is required");
            return;
        }
        if (!values.businessType) {
            toast.error("Business Type is required");
            return;
        }
        if (!values.location.trim()) {
            toast.error("Location is required");
            return;
        }
        if (!id && !imageFile) {
            toast.error("Business Image is required");
            return;
        }
        if (!values.turnoverRange) {
            toast.error("Annual Turnover is required");
            return;
        }
        if (values.turnoverRange === "Specific amount" && !values.specificAmount) {
            toast.error("Specific Amount is required");
            return;
        }
        if (!values.reasonForSelling) {
            toast.error("Reason for Selling is required");
            return;
        }
        if (!values.fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }
        if (!values.email.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!values.phone.trim()) {
            toast.error("Phone is required");
            return;
        }
        if (!values.description.trim()) {
            toast.error("Business Description is required");
            return;
        }

        if (user && role === 'BUYER' && !id) {
            setShowSellerForm(true);
            return;
        }

        await submitData(e.currentTarget);
    }

    async function submitData(formElement: HTMLFormElement) {
        const formData = new FormData(formElement);
        formData.append('businessType', form.getValues("businessType"));
        formData.append('turnoverRange', form.getValues("turnoverRange"));
        formData.append('reasonForSelling', form.getValues("reasonForSelling"));
        if (imageFile) formData.append('imageFile', imageFile);
        if (previewUrl && !imageFile) formData.append('imageUrl', previewUrl);

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/admin/myBusinesses", {
                method: id && id.trim() != '' ? 'PATCH' : 'POST',
                body: formData,
            });
            if (!res.ok) {
                toast.error(`failed to ${id && id.trim() != '' ? 'update' : 'add'} Data`);
                return
            }
            if (onSubmitSuccess) onSubmitSuccess();
            toast.success(`Success!`);
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={onSubmit} className="space-y-8 animate-in fade-in-50 duration-500">
            <SellerFormDialog
                open={showSellerForm}
                setOpen={setShowSellerForm}
                redirect={false}
                title="Complete Your Seller Profile"
                description="To list your business for sale, you first need to provide your business details."
                onSuccess={() => {
                    setShowSellerForm(false);
                    if (formRef.current) submitData(formRef.current);
                }}
            />

            <div className="  overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar space-y-8 p-1">
                {/* Section 1: Business Overview */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Store size={14} /> Business Overview
                    </h3>

                    <Input {...form.register("id")} type="hidden" />

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Business Title <span className="text-rose-500">*</span></Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                <Briefcase size={18} />
                            </div>
                            <Input
                                placeholder="e.g. Well-established Laundrette for Sale"
                                className="pl-10 h-11 transition-all shadow-sm"
                                {...form.register("title")}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Business Type <span className="text-rose-500">*</span></Label>
                            <Select
                                defaultValue={form.getValues("businessType")}
                                onValueChange={(value) => form.setValue("businessType", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="h-11 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={18} className="text-slate-400" />
                                        <SelectValue placeholder="Select type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Commercial Laundry">Commercial Laundry</SelectItem>
                                    <SelectItem value="Dry Cleaners">Dry Cleaners</SelectItem>
                                    <SelectItem value="Launderette">Launderette</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Location <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <MapPin size={18} />
                                </div>
                                <Input
                                    placeholder="e.g. London, UK"
                                    className="pl-10 h-11 transition-all shadow-sm"
                                    {...form.register("location")}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Financials & Reason */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <PoundSterling size={14} /> Financials & Details
                    </h3>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Annual Turnover <span className="text-rose-500">*</span></Label>
                        <RadioGroup
                            value={form.getValues("turnoverRange")}
                            onValueChange={(value) => form.setValue("turnoverRange", value)}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
                            disabled={isSubmitting}
                        >
                            {[
                                "0 - 25k", "25k - 50k", "50k - 100k", "100k - 250k",
                                "250k - 500k", "500k - 1m", "1m - 2m", "2m - 5m", "5m+", "Specific amount"
                            ].map((range) => (
                                <div key={range} className="flex">
                                    <RadioGroupItem value={range} id={range} className="peer sr-only" />
                                    <Label
                                        htmlFor={range}
                                        className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-slate-100 bg-slate-50 p-2 text-center text-[11px] font-bold transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary hover:bg-slate-100"
                                    >
                                        {range}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <AnimatePresence>
                            {showSpecificAmount && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2 overflow-hidden"
                                >
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                            <CircleDollarSign size={18} />
                                        </div>
                                        <Input
                                            type="number"
                                            placeholder="Enter exact amount ($)"
                                            className="pl-10 h-11 transition-all shadow-sm"
                                            {...form.register("specificAmount", { valueAsNumber: true })}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Reason for Selling <span className="text-rose-500">*</span></Label>
                        <Select
                            defaultValue={form.getValues("reasonForSelling")}
                            onValueChange={(value) => form.setValue("reasonForSelling", value)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className="h-11 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Tag size={18} className="text-slate-400" />
                                    <SelectValue placeholder="Select reason" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {reasons.map((reason) => (
                                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Section 3: Media */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Upload size={14} /> Business Media
                    </h3>
                    <div className="relative">
                        {!previewUrl ? (
                            <div className="group relative border-2 border-dashed border-slate-200 rounded-xl p-8 transition-all hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            const url = URL.createObjectURL(file);
                                            setPreviewUrl(url);
                                            form.setValue("imageUrl", url);
                                        }
                                    }}
                                />
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Upload size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-600">Upload business storefront or interior photo</p>
                                    <p className="text-xs text-slate-400 mt-1">Required for new listings. PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 max-w-md mx-auto">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="destructive" className="h-8 gap-2" onClick={clearImage} type="button">
                                        <X size={14} /> Remove
                                    </Button>
                                    <div className="relative">
                                        <Button size="sm" variant="secondary" className="h-8 gap-2">
                                            <Upload size={14} /> Change
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setImageFile(file);
                                                    const url = URL.createObjectURL(file);
                                                    setPreviewUrl(url);
                                                    form.setValue("imageUrl", url);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 4: Contact & Description */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> Contact & Details
                    </h3>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Full Name <span className="text-rose-500">*</span></Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                <User size={18} />
                            </div>
                            <Input
                                placeholder="John Doe"
                                className="pl-10 h-11 transition-all shadow-sm"
                                {...form.register("fullName")}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Email <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Mail size={18} />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-10 h-11 transition-all shadow-sm"
                                    {...form.register("email")}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Phone <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Phone size={18} />
                                </div>
                                <Input
                                    placeholder="+44 123 456 789"
                                    className="pl-10 h-11 transition-all shadow-sm"
                                    {...form.register("phone")}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Business Description <span className="text-rose-500">*</span></Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                <AlignLeft size={18} />
                            </div>
                            <Textarea
                                placeholder="Tell prospective buyers about your business, its history, equipment included, and potential for growth..."
                                className="pl-10 min-h-[140px] transition-all shadow-sm resize-none"
                                {...form.register("description")}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="h-11 px-8 font-bold transition-all active:scale-[0.98] shadow-md shadow-primary/20"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {id && id.trim() !== '' ? 'Update Listing' : 'Submit Business Listing'}
                            <ArrowRight size={18} />
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}

export function BusinessFormDialog({
    id, title, location, description, datePosted, fullName,
    turnoverRange0, email, phone, imageUrl, reasonForSelling,
    businessType, open, setOpen, onSubmitSuccess
}: BusinessType) {
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="sm:max-w-3xl lg:max-w-5xl p-0 overflow-hidden border-none shadow-2xl bg-white rounded-2xl">
                <div className="bg-navy p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="relative z-10">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                <Store className="text-primary" size={24} />
                                {id ? 'Edit Business Listing' : 'Sell Your Business'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-300">
                                Fill out the form below to list your business for sale on our professional platform.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    <BusinessListingForm
                        id={id}
                        fullName={fullName}
                        title={title}
                        location={location}
                        description={description}
                        datePosted={datePosted}
                        turnoverRange0={turnoverRange0}
                        email={email}
                        phone={phone}
                        imageUrl={imageUrl}
                        reasonForSelling={reasonForSelling}
                        businessType={businessType}
                        onSubmitSuccess={() => {
                            onSubmitSuccess?.();
                            setOpen?.(false);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
