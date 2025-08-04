'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, MapPin } from "lucide-react";


import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


import { businessSchema, type BusinessSchema } from "@/lib/schemas/businessSchema";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
/* import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
 */


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

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Manually append the fields that aren't in the FormData
        formData.append('businessType', form.getValues("businessType"));
        formData.append('turnoverRange', form.getValues("turnoverRange"));
        formData.append('reasonForSelling', form.getValues("reasonForSelling"));
        if(imageFile) formData.append('imageFile', imageFile);
        if(previewUrl) formData.append('imageUrl', previewUrl);

        const data = Object.fromEntries(formData.entries());
        //console.log("Form data:", data);

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
            toast.success(`success!`);
        } catch (error) {
            toast.error('somthing went wrong!');
        } finally{
            setIsSubmitting(false);
        }
        // Rest of your submission logic...
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 animate-in fade-in-50 duration-500">
            <Card className="overflow-hidden border-0">
                <CardContent className="p-6 pt-8 space-y-6">

                    {/* Hidden ID field */}
                    <Input
                        {...form.register("id")}
                        type="hidden"
                    />

                    {/* Business Title */}
                    <div className="space-y-2">
                        <label className="text-base">Business Title</label>
                        <Input
                            placeholder="e.g. Established Laundromat in Downtown"
                            className="h-12"
                            {...form.register("title")}
                            required
                        />
                    </div>

                    {/* Business Type and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-base">Business Type</label>
                            <Select
                                required
                                defaultValue={form.getValues("businessType")}
                                onValueChange={(value) => form.setValue("businessType", value)}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Commercial Laundry">Commercial Laundry</SelectItem>
                                    <SelectItem value="Dry Cleaners">Dry Cleaners</SelectItem>
                                    <SelectItem value="Launderette">Launderette</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                    
                                    
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-base">Location</label>
                            <div className="relative">
                                <Input
                                    required
                                    placeholder="e.g. New York, NY"
                                    className="h-12 pl-10"
                                    {...form.register("location")}
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-base">Business Image</label>
                        <Input
                            required={!id || id.trim() == ''}
                            type="file"
                            className="cursor-pointer"
                            accept="image/*"
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
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Preview" className="max-w-xs w-30 h-auto rounded-md border" />
                            </div>
                        )}
                    </div>

                    <Separator className="my-2" />

                    {/* Turnover Range */}
                    <div className="space-y-4">
                        <label className="text-base">Annual Turnover</label>
                        <RadioGroup
                            required
                            value={form.getValues("turnoverRange")}
                            onValueChange={(value) => form.setValue("turnoverRange", value)}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2"
                        >
                            {[
                                "0 - 25k", "25k - 50k", "50k - 100k", "100k - 250k",
                                "250k - 500k", "500k - 1m", "1m - 2m", "2m - 5m", "5m+", "Specific amount"
                            ].map((range) => (
                                <div key={range} className="flex">
                                    <RadioGroupItem value={range} id={range} className="peer sr-only" />
                                    <label
                                        htmlFor={range}
                                        className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-muted/20 p-3 text-center text-sm font-medium ring-offset-background hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2"
                                    >
                                        {range}
                                    </label>
                                </div>
                            ))}
                        </RadioGroup>

                        {showSpecificAmount && (
                            <div className="space-y-2 relative">
                                <label className="text-base">Specific Amount ($)</label>
                                <Input
                                    required
                                    type="number"
                                    placeholder="e.g. 75000"
                                    className="h-12 pl-10"
                                    {...form.register("specificAmount", {
                                        valueAsNumber: true,
                                    })}
                                />
                                <CircleDollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Reason for Selling */}
                    <div className="space-y-2">
                        <label className="text-base">Reason for Selling</label>
                        <Select
                            required
                            defaultValue={form.getValues("reasonForSelling")}
                            onValueChange={(value) => form.setValue("reasonForSelling", value)}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasons.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                        {reason}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="my-4" />

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>

                        <div className="space-y-2">
                            <label className="text-base">Full Name</label>
                            <Input
                                required
                                {...form.register("fullName")}
                                placeholder="e.g. John Doe"
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-base">Email</label>
                            <Input
                                required
                                {...form.register("email")}
                                placeholder="e.g. john@example.com"
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-base">Phone</label>
                            <Input
                                required
                                {...form.register("phone")}
                                placeholder="e.g. +1234567890"
                                className="h-12"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-base">Business Description</label>
                        <textarea
                            required
                            {...form.register("description")}
                            placeholder="Describe your business..."
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[120px]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 w-full bg-primary text-white rounded-md hover:bg-primary/90 transition"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Listing"}
                    </button>

                </CardContent>
            </Card>
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

            <DialogContent className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl ">
                <DialogHeader>
                    <DialogTitle>Sell Your Business</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to list your business for sale.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 border-1 rounded-xl max-h-[70vh] overflow-auto">
                    <BusinessListingForm
                        id={id}
                        fullName={fullName}
                        title={title} location={location}
                        description={description}
                        datePosted={datePosted}
                        turnoverRange0={turnoverRange0}
                        email={email}
                        phone={phone}
                        imageUrl={imageUrl}
                        reasonForSelling={reasonForSelling}
                        businessType={businessType}
                        onSubmitSuccess={onSubmitSuccess}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}