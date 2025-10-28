'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Mail, User, Phone, MessageCircle } from 'lucide-react';
import { useHomeContext } from '@/providers/homePageProvider';
import { SignInUpModal } from '../header/header';

export function ContactUs() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const phoneNumber = '01702597067'; // Remove spaces for tel: link

    const handleCall = () => {
        window.open(`tel:${phoneNumber}`, '_self');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sendMessage = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/contactus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subject, message }),
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error || 'Failed to send message');
                    return;
                }

                setSubmitted(true);
            } catch (error) {
                toast.error('Failed to send message.');
            } finally {
                setLoading(false);
            }
        };

        sendMessage();
    };

    return (
        <Card className="shadow-md w-full">
            <CardContent className="p-6">
                {/* Enhanced Contact Options */}
                <div className="mb-6 space-y-4">
                    <p className="text-gray-600 text-center">
                        We're here to help. Choose how you'd like to contact us:
                    </p>
                    
                    {/* Call Button Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <span className="text-gray-700">Call us at:</span>
                            <span className="font-semibold text-black">01702 597 067</span>
                        </div>
                        <Button 
                            onClick={handleCall}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            size="sm"
                        >
                            <Phone className="h-4 w-4" />
                            Call Now
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                </div>

                {submitted ? (
                    <div className="text-center py-6">
                        <div className="text-green-600 font-medium text-lg mb-2">
                            Thank you for your message!
                        </div>
                        <p className="text-gray-600">
                            We'll get back to you as soon as possible.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="subject" className="flex items-center gap-2 mb-2">
                                <MessageCircle className="h-4 w-4" />
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                name="subject"
                                required
                                placeholder="What is this regarding?"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                                <Mail className="h-4 w-4" />
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="Please provide details about your inquiry..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="focus:ring-2 focus:ring-blue-500 resize-vertical"
                            />
                        </div>

                        <Button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Send Message
                                </div>
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export function ContactDialog({ textButton }: { textButton?: string }) {
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const { user } = useHomeContext();
    const [open, setOpen] = useState(false)

    const handleContactClick = () => {
        if (!user) {
            setOpenSignIn(true);
        } else {
            setOpen(true);
        }
    }

    return (
        <div>
            <Button 
                onClick={handleContactClick}
                variant={textButton ? "destructive" : 'default'} 
                className={`cursor-pointer flex items-center gap-2 ${
                    textButton 
                    ? "bg-red-600 hover:bg-red-500" 
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
            >
                <MessageCircle className="h-4 w-4" />
                {textButton ? textButton : "Contact Us"}
            </Button>

            {/* Dialog only shown when user is authenticated */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            {textButton ? textButton : "Contact Us"}
                        </DialogTitle>
                    </DialogHeader>
                    <ContactUs />
                </DialogContent>
            </Dialog>
            
            <SignInUpModal
                openSignIn={openSignIn}
                openSignUp={openSignUp}
                setOpenSignIn={setOpenSignIn}
                setOpenSignUp={setOpenSignUp}
            />
        </div>
    );
}

export function SendMessageForm({ to }: { to: string }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sendMessage = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subject, message, to }),
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error || 'Failed to send message');
                    return;
                }

                setSubmitted(true);
            } catch (error) {
                toast.error('Failed to send message.');
            } finally {
                setLoading(false);
            }
        };

        sendMessage();
    };

    return (
        <Card className="shadow-md w-full">
            <CardContent className="p-6">
                {submitted ? (
                    <div className="text-center py-6">
                        <div className="text-green-600 font-medium text-lg mb-2">
                            Message Sent!
                        </div>
                        <p className="text-gray-600">
                            Your message has been delivered successfully.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="subject" className="flex items-center gap-2 mb-2">
                                <MessageCircle className="h-4 w-4" />
                                Subject
                            </Label>
                            <Input
                                id="subject"
                                name="subject"
                                required
                                placeholder="Enter subject..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                                <Mail className="h-4 w-4" />
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="focus:ring-2 focus:ring-blue-500 resize-vertical"
                            />
                        </div>

                        <Button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Send Message
                                </div>
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export function SendMessageDialogue({ to }: { to: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="default" 
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer flex items-center gap-2"
                >
                    <Mail className="h-4 w-4" />
                    Message
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Send A Message
                    </DialogTitle>
                </DialogHeader>
                <SendMessageForm to={to} />
            </DialogContent>
        </Dialog>
    );
}