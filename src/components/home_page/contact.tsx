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
import { Mail } from 'lucide-react';

export function ContactUs() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

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
                <p className="mb-6 text-gray-600">
                    We're here to help. Send us your message or call us at{' '}
                    <span className="font-semibold text-black">+44 01702 597067</span>.
                </p>

                {submitted ? (
                    <div className="text-green-600 font-medium">Thank you! We’ll get back to you soon.</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                required
                                placeholder="Enter subject..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export function ContactDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-500 cursor-pointer">
                    Contact Us
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                </DialogHeader>
                <ContactUs />
            </DialogContent>
        </Dialog>
    );
}


 



export function SendMessageForm({to}:{to:string}) {
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
                    body: JSON.stringify({ subject, message,to }),
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
                    <div className="text-green-600 font-medium">Thank you! We’ll get back to you soon.</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                required
                                placeholder="Enter subject..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}








export function SendMessageDialogue({to}:{to:string}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-500 cursor-pointer">
                    <Mail/>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Send A Message</DialogTitle>
                </DialogHeader>
                <SendMessageForm to={to} />
            </DialogContent>
        </Dialog>
    );
}
