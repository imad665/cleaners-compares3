// components/messaging/MessageSellerDialog.tsx
// components/messaging/MessageSellerDialog.tsx
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useHomeContext } from '@/providers/homePageProvider';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone } from 'lucide-react';
import { notifySellerOfMessageAction } from '@/actions/actionSellerForm';
import { usePathname } from 'next/navigation';
import { ProductMessageType } from '@/lib/types/product';
import { getSellerInfoAction } from '@/actions/registerAction';



interface MessageSellerDialogProps {
    product: ProductMessageType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MessageSellerDialog({
    product,
    open,
    onOpenChange
}: MessageSellerDialogProps) {
    const { user } = useHomeContext();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        getSellerInfoAction(user!.id).then((seller) => {
            setEmail(user?.email)
            setPhone(seller?.phoneNumber)
        })
    }, [])

    const [errors, setErrors] = useState<{
        message?: string;
        email?: string;
        phone?: string;
        contact?: string; // General contact error
    }>({});
    console.log(product, user, 'ssssssssssssssssssssssslddldlcc');

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Message validation
        if (!message.trim()) {
            newErrors.message = 'Message cannot be empty';
        } else if (message.length > 200) {
            newErrors.message = 'Message must be less than 200 characters';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare the message data
            const messageData = {
                productId: product.id,
                sellerEmail: product.sellerEmail,
                sellerName: product.sellerName,
                sellerId: product.sellerId,
                buyerId: user?.id || null,
                buyerName: user?.name || null,
                message: message.trim(),
                productPath: product.url || pathname,
                type: 'product_inquiry',
                createdAt: new Date().toISOString(),
            };

            // Save to database first
            /* const response = await fetch('/api/messages/send-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            } */

            // Send email notification to seller
            const res = await notifySellerOfMessageAction({
                productName: product.name,
                sellerName: messageData.sellerName,
                sellerEmail: messageData.sellerEmail,
                sellerId: messageData.sellerId,
                customerMessage: messageData.message,
                customerId: user?.id,
                customerName: messageData.buyerName || undefined,
                productId: product.id,
                productPath: product.url || pathname,
                productImage: product.image
            });
            if (res.success) {
                // Success handling
                toast({
                    title: 'Message Sent',
                    description: 'Your message has been sent to the seller. They will contact you soon.',
                    variant: 'default',
                });
            } else {
                toast({
                    title: 'Message Sent',
                    description: 'Your message has been sent to the seller. They will contact you soon.',
                    variant: 'default',
                });
            }

            // Reset form and close dialog
            setMessage('');
            setEmail('');
            setPhone('');
            onOpenChange(false);
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error',
                description: 'Failed to send message. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when dialog closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setMessage('');
            setEmail('');
            setPhone('');
            setErrors({});
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Message Seller</DialogTitle>
                    <DialogDescription>
                        Ask a question about {product.name}. The seller will respond to your
                        provided contact information.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Product Info Summary */}
                    <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Seller will receive your inquiry about this product
                        </p>
                    </div>

                    {/* Message Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="message">
                            Your Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="I'm interested in this product. Can you tell me more about..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={errors.message ? 'border-red-500' : ''}
                            maxLength={200}
                            rows={4}
                        />
                        <div className="flex justify-between text-xs">
                            <span className={errors.message ? 'text-red-500' : 'text-muted-foreground'}>
                                {errors.message || `${message.length}/200 characters`}
                            </span>
                            <span className="text-muted-foreground">
                                {200 - message.length} remaining
                            </span>
                        </div>
                    </div>



                    {/* User info hint if not logged in */}
                    {!user && (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            Not logged in? The seller will reply to your provided contact information.
                        </p>
                    )}

                    {/* Direct Contact Options */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or contact directly
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={() => {
                                if (product.sellerEmail) {
                                    window.location.href = `mailto:${product.sellerEmail}?subject=Inquiry about ${product.name}`;
                                }
                            }}
                        >
                            <Mail className="w-4 h-4" />
                            Email Seller
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={() => {
                                // Assuming product object or getSellerInfoAction provides seller phone
                                // We use a fallback if not directly available on product
                                const sellerPhone = (product as any).sellerPhone; 
                                if (sellerPhone) {
                                    window.location.href = `tel:${sellerPhone}`;
                                } else {
                                    toast({
                                        title: "Phone not available",
                                        description: "The seller hasn't provided a public phone number.",
                                        variant: "destructive"
                                    });
                                }
                            }}
                        >
                            <Phone className="w-4 h-4" />
                            Call Seller
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}







/*  */