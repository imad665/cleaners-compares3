"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

type WantedItemType = {
  id?:string
  title0?:string
  location0?:string 
  description0?:string 
  phone0?:string 
  email0?:string 
  imageUrl?:string 
  fullName0?:string
  open:boolean 
  setOpen:(open:boolean)=>void 
  onSubmitSuccess:()=>void 
}

const AddWantedItemDialog = ({
  title0='',
  description0,
  location0,
  phone0,
  email0,imageUrl,open,id,fullName0,
  setOpen,onSubmitSuccess}:WantedItemType) => {
  
  //console.log(title0,description0,location0,phone0);
  //console.log(email0,imageUrl,'***********');
  
  const [title, setTitle] = useState<String>(title0 || '');
  const [location, setLocation] = useState(location0);
  const [description, setDescription] = useState(description0);
  const [phone, setPhone] = useState(phone0);
  const [email, setEmail] = useState(email0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(imageUrl);
  const [fullName,setFullName] = useState(fullName0); 
  const [pending,setPending] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // show preview
    }
  };

  const handleSubmit = async () => {
    try{
      setPending(true);
      const formData = new FormData(); 
      formData.append('title',title);
      formData.append('location',location);
      formData.append('description',description);
      formData.append('phone',phone);
      formData.append('email',email);
      formData.append('id',id);
      if(imageFile) formData.append('imageFile',imageFile);
      if(previewUrl) formData.append('imageUrl',previewUrl);
      formData.append('fullName',fullName);

      const response = await fetch('/api/admin/myWantedItems',{
        method:id && id.trim()!=''?'PATCH':'POST',
        body:formData
      });

      if(!response.ok){
        toast.error('Failed to submit')
        throw new Error('Failed to submit');
      }
      
      const data = await response.json();
      toast.success('Successfuly submitted"');
      if(onSubmitSuccess) onSubmitSuccess(); 
      handleClose();

    }catch(error){
      toast.error('Error submitting wanted item');
    }finally{
      setPending(false);
    }


  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setPhone('');
    setEmail('');
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{/* optional trigger */}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-lg lg:max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Add New Wanted Item</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 w-full max-h-[75vh] overflow-y-auto md:grid-cols-2  gap-6 py-4">
          
          {/* Title */}
          <div className="grid gap-1">
            <Label htmlFor="title">Title <span className='text-red-500'>*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Used bicycle"
            />
            <p className="text-xs text-muted-foreground">
              Enter a short title for the item you want.
            </p>
          </div>

          {/* Location */}
          <div className="grid gap-1">
            <Label htmlFor="location">Location <span className='text-red-500'>*</span></Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., London, UK"
            />
            <p className="text-xs text-muted-foreground">
              Enter your preferred location to get the item.
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>

             {/* Full Name */}
             <div className="grid gap-1">
              <Label htmlFor="fullName">Full Name <span className='text-red-500'>*</span></Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., John doe"
              />
              {/* <p className="text-xs text-muted-foreground">
                Provide a valid phone number so sellers can contact you.
              </p> */}
            </div>

            {/* Phone Number */}
            <div className="grid gap-1">
              <Label htmlFor="phone">Phone Number <span className='text-red-500'>*</span></Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +212 612 345 678"
              />
              <p className="text-xs text-muted-foreground">
                Provide a valid phone number so sellers can contact you.
              </p>
            </div>

            {/* Email Address */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email Address <span className='text-red-500'>*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., yourname@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Provide an email address for more ways to reach you.
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid gap-1">
            <Label htmlFor="image">Upload Item Image <span className='text-xs text-muted-foreground'>(optional)</span></Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className='cursor-pointer'
              onChange={handleImageChange}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Image Preview"
                className="mt-2 rounded-md max-h-20 object-cover"
              />
            )}
            <p className="text-xs text-muted-foreground">
              Choose an image from your device.
            </p>
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're looking for in detail."
            />
            <p className="text-xs text-muted-foreground">
              Include details such as condition, size, brand preference, etc.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={handleSubmit}>
            {!pending && <span>{id && id.trim()!=''?'Save':'Add Item'}</span>}
            {pending && <span>Submitting...</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWantedItemDialog;
