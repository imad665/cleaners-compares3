"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ImageIcon, 
  AlignLeft, 
  Loader2,
  X,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useHomeContext } from '@/providers/homePageProvider';
import SellerFormDialog from './sellerForm';
import { motion, AnimatePresence } from 'framer-motion';

type AddNewWantedItemProps = {
  id?: string;
  title0?: string;
  location0?: string;
  description0?: string;
  phone0?: string;
  email0?: string;
  imageUrl?: string;
  fullName0?: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
};

export const AddNewWantedItem = ({
  id,
  title0 = '',
  description0,
  location0,
  phone0,
  email0,
  imageUrl,
  fullName0,
  onSubmitSuccess,
  onCancel
}: AddNewWantedItemProps) => {
  const [title, setTitle] = useState<string>(title0 || '');
  const [location, setLocation] = useState(location0 || '');
  const [description, setDescription] = useState(description0 || '');
  const [phone, setPhone] = useState(phone0 || '');
  const [email, setEmail] = useState(email0 || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(imageUrl);
  const [fullName, setFullName] = useState(fullName0 || '');
  const [pending, setPending] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);

  const { user } = useHomeContext();
  const role = user?.role;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required");
    }
    if (!fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (user && role === 'BUYER' && !id) {
      setShowSellerForm(true);
      return;
    }

    await submitData();
  };

  const submitData = async () => {
    try {
      setPending(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('phone', phone);
      formData.append('email', email);

      if (id) formData.append('id', id);
      if (imageFile) formData.append('imageFile', imageFile);
      if (previewUrl && !imageFile) formData.append('imageUrl', previewUrl);
      formData.append('fullName', fullName);

      const response = await fetch('/api/admin/myWantedItems', {
        method: id && id.trim() !== '' ? 'PATCH' : 'POST',
        body: formData
      });

      if (!response.ok) {
        toast.error('Failed to submit');
        throw new Error('Failed to submit');
      }

      toast.success('Successfully submitted');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      toast.error('Error submitting wanted item');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full">
      <SellerFormDialog
        open={showSellerForm}
        setOpen={setShowSellerForm}
        redirect={false}
        title="Complete Your Seller Profile"
        description="To post a wanted item request, you first need to provide your business details."
        onSuccess={() => {
          setShowSellerForm(false);
          submitData();
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Package size={14} /> Item Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Item Title <span className='text-rose-500'>*</span></Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                  <Package size={18} />
                </div>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Industrial Cleaning Machine"
                  className="pl-10 h-11 transition-all shadow-sm"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">Location <span className='text-rose-500'>*</span></Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                  <MapPin size={18} />
                </div>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., London, UK"
                  className="pl-10 h-11 transition-all shadow-sm"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                  <AlignLeft size={18} />
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you're looking for (condition, brand, size...)"
                  className="pl-10 min-h-[120px] transition-all shadow-sm resize-none"
                  disabled={pending}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User size={14} /> Contact Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">Full Name <span className='text-rose-500'>*</span></Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                  <User size={18} />
                </div>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 h-11 transition-all shadow-sm"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone <span className='text-rose-500'>*</span></Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                    <Phone size={18} />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44..."
                    className="pl-10 h-11 transition-all shadow-sm"
                    disabled={pending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email <span className='text-rose-500'>*</span></Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-10 h-11 transition-all shadow-sm"
                    disabled={pending}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ImageIcon size={14} /> Visual Reference
            </h3>
            
            <div className="relative">
              {!previewUrl ? (
                <label className="group relative border-2 border-dashed border-slate-200 rounded-xl p-8 transition-all hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={pending}
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-600">Click to upload image</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-8 gap-2"
                      onClick={clearImage}
                      type="button"
                    >
                      <X size={14} /> Remove
                    </Button>
                    <div className="relative">
                      <Button size="sm" variant="secondary" className="h-8 gap-2" asChild>
                        <label className="cursor-pointer">
                          <Upload size={14} /> Change
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-slate-100">
        {onCancel && (
          <Button 
            variant="ghost" 
            onClick={onCancel}
            disabled={pending}
            className="font-semibold text-slate-500 hover:text-slate-900"
          >
            Cancel
          </Button>
        )}
        <Button 
          disabled={pending} 
          onClick={handleSubmit}
          className="h-11 px-8 font-bold transition-all active:scale-[0.98] shadow-md shadow-primary/20"
        >
          {pending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {id && id.trim() !== '' ? 'Save Changes' : 'Post Wanted Item'}
              <ArrowRight size={18} />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

const AddWantedItemDialog = ({
  title0 = '',
  description0,
  location0,
  phone0,
  email0, 
  imageUrl, 
  open, 
  id, 
  fullName0,
  setOpen, 
  onSubmitSuccess 
}: any) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl lg:max-w-5xl p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="bg-navy p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                {id ? 'Edit Wanted Item' : 'Post a Wanted Item'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Let sellers know exactly what you're looking for to get the best offers.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <AddNewWantedItem
            id={id}
            title0={title0}
            description0={description0}
            location0={location0}
            phone0={phone0}
            email0={email0}
            imageUrl={imageUrl}
            fullName0={fullName0}
            onSubmitSuccess={() => {
              onSubmitSuccess();
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWantedItemDialog;
