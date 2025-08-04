'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useHomeContext } from '@/providers/homePageProvider'
import { formSellerAction } from '@/actions/actionSellerForm'
import { registerAction } from '@/actions/registerAction'
import { InputPassword } from '../auth/signup'

type SellerFormDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    text: string;
    callback:string;
}   

export default function SellerFormDialog2({ open, setOpen, text,callback }: SellerFormDialogProps) {
    const router = useRouter();
    const [businessName, setBusinessName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submit, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const result = await registerAction(undefined, formData);

        if (result.success) {
            toast.success('Success! Please wait...')
            const { password, email, userId } = result;
            formData.append("userId", userId as string);
            const result2 = await formSellerAction(undefined, formData);
            if (result2.success) {
                toast.success(result2.message);
                await signIn('credentials', {
                    email: email,
                    password: password,
                    callbackUrl: callback
                })
            } else {
                toast.error(result2.error)
            }
        } else {
            toast.error(result.error)
        }
        setIsSubmitting(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-md w-full max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">{text}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-semibold">Create Your Seller Account</h2>
                        <p className="text-gray-600 text-sm">
                            Fill out the form below to start selling {text.toLowerCase()}. 
                            All fields are required to complete your registration.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Account Credentials Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg border-b pb-2">Account Information</h3>
                            
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    disabled={submit}   
                                    id="name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    name="name" 
                                    placeholder="Enter your full name"
                                    required 
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    disabled={submit}   
                                    autoComplete="off" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    id="email" 
                                    type="email" 
                                    name="email" 
                                    placeholder="your@email.com"
                                    required 
                                />
                            </div>

                            <InputPassword name="password" pending={submit} text="Password" />
                            <InputPassword name="confirmPassword" pending={submit} text="Confirm Password" />
                        </div>

                        {/* Business Information Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg border-b pb-2">Business Information</h3>
                            
                            <div>
                                <Label htmlFor="businessName">Business Name</Label>
                                <p className="text-xs text-gray-500 mb-1">The name that will appear to customers</p>
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    disabled={submit}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    value={businessName}
                                    placeholder="Your business name"
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="phoneNumber">Contact Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    disabled={submit}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                    placeholder="+1 (___) ___-____"
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="city">Business Address</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    disabled={submit}
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                    placeholder="Street address"
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="country">Postal Code</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    disabled={submit}
                                    onChange={(e) => setCountry(e.target.value)}
                                    value={country}
                                    placeholder="12345"
                                    required
                                />
                            </div>
                        </div>

                        <Button 
                            disabled={submit} 
                            type="submit" 
                            className="w-full py-2 text-lg font-semibold"
                        >
                            {submit ? "Processing..." : "Complete Registration"}
                        </Button>
                        
                        <p className="text-xs text-gray-500 text-center">
                            By registering, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}