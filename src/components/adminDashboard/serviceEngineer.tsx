'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowRight,
    ChevronRight,
    Wrench,
    PoundSterling,
    Clock,
    GraduationCap,
    MapPin,
    Mail,
    Phone,
    Building2,
    Layers,
    Loader2,
    Upload,
    X,
    Star,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { dataFeatureProduct } from '@/lib/payement/data';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { useHomeContext } from '@/providers/homePageProvider';
import SellerFormDialog from '../forms/sellerForm';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceEngineerFormProps {
    onSubmitSuccess?: (v: any) => void;
    onCancel?: () => void;
    editItem?: any;
    className?: string;
}

export const ServiceEngineerForm = ({ onSubmitSuccess, onCancel, editItem, className }: ServiceEngineerFormProps) => {
    const [formData, setFormData] = useState({
        id: editItem?.id || undefined,
        title: editItem?.title || '',
        callOutCharge: editItem?.callOutCharges || '',
        hourlyRate: editItem?.ratePerHour || '',
        experience: editItem?.experience || '',
        areaOfService: editItem?.areaOfService || '',
        email: editItem?.email || '',
        contactNumber: editItem?.contactNumber || '',
        companyType: editItem?.companyType || 'PRIVATE',
        address: editItem?.address || '',
        featured: editItem?.isFeatured,
        enabled: editItem?.isEnabled,
        category: editItem?.category || 'LAUNDRY',
        pictureUrl: editItem?.pictureUrl || undefined,
        featureDays: editItem?.featureDays || null,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(editItem?.pictureUrl || null);
    const [isFeatured, setIsFeatured] = useState(formData.featured);
    const [featuredDuration, setFeaturedDuration] = useState(editItem?.featureDays?.toString());
    const [loading, setLoading] = useState(false);
    const [showSellerForm, setShowSellerForm] = useState(false);
    const router = useRouter();
    const { user } = useHomeContext();
    const role = user?.role;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Service Title is required");
            return;
        }
        if (!formData.callOutCharge) {
            toast.error("Call Out Charge is required");
            return;
        }
        if (!formData.hourlyRate) {
            toast.error("Hourly Rate is required");
            return;
        }
        if (!formData.experience.trim()) {
            toast.error("Experience is required");
            return;
        }
        if (!formData.areaOfService.trim()) {
            toast.error("Area of Service is required");
            return;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!formData.contactNumber.trim()) {
            toast.error("Contact Number is required");
            return;
        }
        if (!formData.address.trim()) {
            toast.error("Address is required");
            return;
        }

        if (user && role === 'BUYER' && !editItem) {
            setShowSellerForm(true);
            return;
        }

        await submitData();
    };

    const submitData = async () => {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, value as string);
            }
        });
        if (imageFile) {
            form.append('picture', imageFile);
        }

        if (featuredDuration) {
            form.set('featureDays', featuredDuration);
        }

        try {
            setLoading(true);
            const isUpdate = formData.id != undefined;
            const res = await fetch('/api/admin/myServices', {
                method: !isUpdate ? 'POST' : 'PATCH',
                body: form,
            });
            const { service, url } = await res.json();
            if (url) {
                router.push(url);
            } else {
                toast.success(`Service ${!isUpdate ? 'added' : 'updated'} successfully!`);
                if (onSubmitSuccess) onSubmitSuccess(service);
            }
        } catch (error) {
            toast.error('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("w-full space-y-8", className)}>
            <SellerFormDialog
                open={showSellerForm}
                setOpen={setShowSellerForm}
                redirect={false}
                title="Complete Your Seller Profile"
                description="To register as a service engineer, you first need to provide your business details."
                onSuccess={() => {
                    setShowSellerForm(false);
                    submitData();
                }}
            />

            <div className=' p-3 w-full overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar space-y-8'>
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Wrench size={14} /> Service Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Service Title <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Wrench size={18} />
                                </div>
                                <Input name="title" placeholder="Professional Laundry Repair" value={formData.title} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Experience <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <GraduationCap size={18} />
                                </div>
                                <Input name="experience" placeholder="e.g: 5 Years" value={formData.experience} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Category <span className="text-rose-500">*</span></Label>
                            <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} disabled={loading}>
                                <SelectTrigger className="h-11 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Layers size={18} className="text-slate-400" />
                                        <SelectValue placeholder="Select category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LAUNDRY">Laundry Engineers</SelectItem>
                                    <SelectItem value="DRY_CLEANING">Dry Cleaning Engineers</SelectItem>
                                    <SelectItem value="FINISHING">Finishing Engineers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Company Type <span className="text-rose-500">*</span></Label>
                            <Select value={formData.companyType} onValueChange={(val) => handleSelectChange('companyType', val)} disabled={loading}>
                                <SelectTrigger className="h-11 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={18} className="text-slate-400" />
                                        <SelectValue placeholder="Select type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRIVATE">Private / Individual</SelectItem>
                                    <SelectItem value="COMPANY">Registered Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Pricing & Location */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <PoundSterling size={14} /> Pricing & Reach
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Call Out Charge (£) <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <PoundSterling size={18} />
                                </div>
                                <Input name="callOutCharge" type="number" placeholder="0.00" value={formData.callOutCharge} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Hourly Rate (£) <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Clock size={18} />
                                </div>
                                <Input name="hourlyRate" type="number" placeholder="0.00" value={formData.hourlyRate} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Area of Service <span className="text-rose-500">*</span></Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                <MapPin size={18} />
                            </div>
                            <Input name="areaOfService" placeholder="e.g: Greater London, Kent, Essex" value={formData.areaOfService} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                        </div>
                    </div>
                </div>

                {/* Section 3: Contact & Address */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Email <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Mail size={18} />
                                </div>
                                <Input name="email" type="email" placeholder="contact@engineer.com" value={formData.email} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Contact Number <span className="text-rose-500">*</span></Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                    <Phone size={18} />
                                </div>
                                <Input name="contactNumber" placeholder="+44 123 456 789" value={formData.contactNumber} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Business Address <span className="text-rose-500">*</span></Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                                <MapPin size={18} />
                            </div>
                            <Input name="address" placeholder="Full business address" value={formData.address} onChange={handleChange} className="pl-10 h-11 transition-all shadow-sm" disabled={loading} />
                        </div>
                    </div>
                </div>

                {/* Section 4: Media */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Upload size={14} /> Professional Identity
                    </h3>
                    <div className="relative">
                        {!imagePreview ? (
                            <label className="group relative border-2 border-dashed border-slate-200 rounded-xl p-8 transition-all hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Upload size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-600">Upload profile photo or company logo</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </label>
                        ) : (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 h-48 w-full sm:w-64 bg-slate-50">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="destructive" className="h-8 gap-2" onClick={clearImage} type="button">
                                        <X size={14} /> Remove
                                    </Button>
                                    <div className="relative">
                                        <Button size="sm" variant="secondary" className="h-8 gap-2" asChild>
                                            <label className="cursor-pointer">
                                                <Upload size={14} /> Change
                                                <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 5: Promotion */}
                {!formData.featured && (
                    <div className="pt-6 border-t mt-4">
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-900 leading-tight">Featured Service</h4>
                                        <p className="text-xs text-amber-700 mt-0.5">Boost your visibility and reach more customers.</p>
                                    </div>
                                </div>
                                <Checkbox
                                    id="featured"
                                    className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                    checked={isFeatured}
                                    onCheckedChange={(checked) => {
                                        setIsFeatured(Boolean(checked));
                                        if (!checked) setFeaturedDuration(undefined);
                                    }}
                                />
                            </div>

                            <AnimatePresence>
                                {isFeatured && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-amber-200 space-y-3 overflow-hidden"
                                    >
                                        <Label htmlFor="featureDays" className="text-sm font-bold text-amber-900">
                                            Select Duration
                                        </Label>
                                        <Select
                                            name="featureDays"
                                            value={featuredDuration}
                                            onValueChange={(v) => setFeaturedDuration(v)}
                                        >
                                            <SelectTrigger className="w-full bg-white border-amber-200">
                                                <SelectValue placeholder="Choose plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dataFeatureProduct.map((feature) => (
                                                    <SelectItem key={feature.key} value={feature.key}>{feature.value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-start gap-2 text-amber-800">
                                            <Info size={14} className="mt-0.5 shrink-0" />
                                            <p className="text-[11px] font-medium italic">
                                                Charges vary based on duration. This is a one-time non-refundable fee.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {formData.featured && (
                    <div className="pt-6 border-t mt-4">
                        <Badge className='bg-emerald-100 border-emerald-200 text-emerald-700 py-1.5 px-3 rounded-full flex items-center gap-1.5 w-fit font-bold uppercase tracking-wider text-[10px]'>
                            <Star size={12} fill="currentColor" /> Featured Service
                        </Badge>
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                {onCancel && (
                    <Button variant="ghost" type="button" onClick={onCancel} disabled={loading} className="font-semibold text-slate-500 hover:text-slate-900">
                        Cancel
                    </Button>
                )}
                <Button
                    disabled={loading}
                    type="submit"
                    className="h-11 px-8 font-bold transition-all active:scale-[0.98] shadow-md shadow-primary/20"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {editItem ? "Save Changes" : "Register Engineer"}
                            <ArrowRight size={18} />
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default function ServiceForm({ onSubmitSuccess, editItem }: {
    onSubmitSuccess: (v: any) => void,
    editItem?: any
}) {
    return (
        <div className="max-w-4xl w-full mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-navy tracking-tight">{editItem ? 'Edit Engineer Profile' : 'Register New Engineer'}</h2>
                <p className="text-slate-500 mt-1">Provide the details below to list your engineering services on our platform.</p>
            </div>
            <ServiceEngineerForm
                onSubmitSuccess={onSubmitSuccess}
                editItem={editItem}
            />
        </div>
    );
}

export function ServiceFormDialog({ onSubmitSuccess, isOpen = false }: { onSubmitSuccess?: () => void; isOpen?: boolean }) {
    const [open, setOpen] = useState(isOpen);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isOpen && (
                <DialogTrigger asChild>
                    <Button className="h-10 font-bold bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98] cursor-pointer">
                        <Wrench className="mr-2" size={18} /> Add New Engineer
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="  sm:max-w-3xl lg:max-w-5xl p-0 overflow-hidden border-none shadow-2xl bg-white rounded-2xl">
                <div className="bg-navy p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="relative z-10">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                <Wrench className="text-primary" size={24} />
                                Service Engineer Registration
                            </DialogTitle>
                            <DialogDescription className="text-slate-300">
                                Join our network of professional laundry and dry cleaning engineers.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    <ServiceEngineerForm
                        onSubmitSuccess={() => {
                            onSubmitSuccess?.()
                            setOpen(false)
                        }}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
