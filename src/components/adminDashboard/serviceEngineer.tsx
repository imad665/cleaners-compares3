'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { dataFeatureProduct } from '@/lib/payement/data';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';




export default function ServiceForm({ onSubmitSuccess, editItem }: {
    onSubmitSuccess: (v: any) => void,
    editItem?: any
}) {
    //console.log(editItem, ';;;;;;;;;;;;;;tttttttt');

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
        description: editItem?.description || '',
        featured: editItem?.isFeatured,
        enabled: editItem?.isEnabled,
        category: editItem?.category || 'LAUNDRY',
        pictureUrl: editItem?.pictureUrl || undefined,
        featureDays: editItem?.featureDays || null,

    });
    //console.log(editItem,';;;;;;;;;;;;;;;;;');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(editItem?.pictureUrl || undefined);
    const [isFeatured, setIsFeatured] = useState(formData.featured);
    const [featuredDuration, setFeaturedDuration] = useState(editItem?.featureDays?.toString());
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
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
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => form.append(key, value));
        if (imageFile) {
            form.append('picture', imageFile);
        }

        //console.log(form,'uuuuuuuuuuuuuuu'); 
        form.set('featureDays', featuredDuration);

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
                //window.open(url);
            } else {
                toast.success(`new service ${!isUpdate? 'added':'updated'} successfuly!`);
                if (onSubmitSuccess) onSubmitSuccess(service)
            }

        } catch (error) {
            //console.error("Submit error:", error);
            toast.error('failed to add new service')
        } finally{
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl w-[90vw] mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6">
            <div className='max-h-[75vh] w-full overflow-auto py-3 flex flex-col gap-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="title" placeholder="Service Title" value={formData.title} onChange={handleChange} />
                    <Input name="callOutCharge" type="number" placeholder="Call Out Charge (£)" value={formData.callOutCharge} onChange={handleChange} />
                    <Input name="hourlyRate" type="number" placeholder="Hourly Rate (£)" value={formData.hourlyRate} onChange={handleChange} />
                    <Input name="experience" placeholder="Experience (e.g: 3 years)" value={formData.experience} onChange={handleChange} />
                    <Input name="areaOfService" placeholder="Area of Service" value={formData.areaOfService} onChange={handleChange} />
                    <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    <Input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} />

                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Upload Image</label>
                    <Input type="file" accept="image/*" className='cursor-pointer' onChange={handleImageChange} />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded-lg border" />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Type</label>
                        <Select value={formData.companyType} onValueChange={(val) => handleSelectChange('companyType', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRIVATE">Private</SelectItem>
                                <SelectItem value="COMPANY">Company</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LAUNDRY">Enginners<ChevronRight /> Laundry</SelectItem>
                                <SelectItem value="DRY_CLEANING">Enginners<ChevronRight />Dry Cleaning</SelectItem>
                                <SelectItem value="FINISHING">Enginners<ChevronRight />Finishing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

                {/* <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="featured" checked={formData.featured} onCheckedChange={(val) => setFormData(prev => ({ ...prev, featured: !!val }))} />
                        <label htmlFor="featured" className="text-sm">Featured</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="enabled" checked={formData.enabled} onCheckedChange={(val) => setFormData(prev => ({ ...prev, enabled: !!val }))} />
                        <label htmlFor="enabled" className="text-sm">Enabled</label>
                    </div>
                </div> */}
               { !formData.featured && <div className="pt-4 space-y-2 border-t mt-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="featured"
                            checked={isFeatured}
                            onCheckedChange={(checked) => {
                                setIsFeatured(Boolean(checked))
                                setFeaturedDuration(null);
                            }}
                        />
                        <Label htmlFor="featured" className="text-base font-medium">
                            Mark as Featured Product
                        </Label>
                    </div>
                    <Separator />
                    {isFeatured && (
                        <div className="space-y-2">
                            <Label htmlFor="featureDays" className="text-base font-medium">
                                Select Duration & Fee
                            </Label>
                            <Select
                                name="featureDays"
                                value={featuredDuration}
                                onValueChange={(v) => setFeaturedDuration(v)}
                            >
                                <SelectTrigger className="w-full md:w-[300px]">
                                    <SelectValue placeholder="Select a duration" />
                                </SelectTrigger>
                                <SelectContent className="z-20000">
                                    {dataFeatureProduct.map((feature) => (
                                        <SelectItem value={feature.key}>{feature.value}</SelectItem>
                                    ))}

                                    {/* <SelectItem value="5d-3$">5 days - $3 <span className="text-sm text-gray-600">(most popular)</span></SelectItem>
                                <SelectItem value="7d-5$">7 days - $5</SelectItem>
                                <SelectItem value="14d-10$">14 days - $10</SelectItem> */}
                                </SelectContent>
                            </Select>
                            <div className="text-muted-foreground text-xs">
                                This will charge you according to the selected duration.
                            </div>
                        </div>
                    )}
                </div>}
                {formData.featured && <Badge  className='bg-green-300 border-1 rounded-xl text-center text-black'>featured</Badge>}

                <Button disabled={loading} type="submit">{loading?"Submit...":"Submit"}</Button>
            </div>
        </form>
    );
}

/* export function DialogServiceForm({ open, setOpen }: {
    open: boolean,
    setOpen: (value: boolean) => void
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Create a Service</DialogTitle>
                </DialogHeader>
                <ServiceForm />
            </DialogContent>
        </Dialog>
    );
} */
