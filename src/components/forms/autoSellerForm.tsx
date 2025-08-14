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
import { signIn } from 'next-auth/react'
import { useHomeContext } from '@/providers/homePageProvider'
import { formSellerAction } from '@/actions/actionSellerForm'

type SellerFormDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    callback?: string;
}

export default function AutoSellerFormDialog({ open, setOpen, callback = '/' }: SellerFormDialogProps) {
    const [state, action, pending] = useActionState(formSellerAction, undefined);
    const router = useRouter();
    const { user } = useHomeContext()

    const [businessName, setBusinessName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState(''); // will store address
    const [country, setCountry] = useState(''); // postcode
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isOpenAddress, setIsOpenAddress] = useState(false)

    useEffect(() => {
        if (!state) return
        if (state.success) {
            setOpen(false)
            toast.success(state.message)
            const a = async () => {
                await signIn("credentials", {
                    email: user?.email,
                    password: "test_password",
                    callbackUrl: callback
                });
                router.refresh();
            }
            a();
        } else if (state.redirect) {
            router.push(state.redirect)
        } else {
            toast.error(state.error);
        }
    }, [state]);

    const searchAddresses = async (pc: string) => {
        setCountry(pc);

        if (pc.length < 3) return; // wait until at least 3 chars
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                pc
            )}&countrycodes=gb&addressdetails=1&limit=50`
        );
        const data = await res.json();
        setAddresses(data);
        setIsOpenAddress(data.length != 0)
    };

    const handleSelect = (address: string) => {
        setCity(address);
        //setAddresses([]); // hide dropdown
        setIsOpenAddress(false); // hide dropdown
    };
    //console.log(addresses,';;;;;;;;;;;;;;;;;;;;');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Become a Seller</DialogTitle>
                </DialogHeader>
                <form action={action} className="space-y-4">
                    <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                            id="businessName"
                            name="businessName"
                            onChange={(e) => setBusinessName(e.target.value)}
                            value={businessName}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="country">Post Code</Label>
                        <Input
                            id="country"
                            name="country"
                            onChange={(e) => searchAddresses(e.target.value)}
                            onFocus={(e) => setIsOpenAddress(addresses.length != 0)}
                            onBlur={(e) => {
                                setTimeout(() => {
                                    setIsOpenAddress(false)
                                }, 500)
                            }}
                            value={country}
                            placeholder="Enter postcode"
                            required
                        />
                        {isOpenAddress && (
                            <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto bg-white">
                                {addresses.map((place, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelect(place.display_name)}
                                        className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                    >
                                        {place.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="city">Address</Label>
                        <Input
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Selected address will appear here"
                            required
                        />
                    </div>

                    <Button disabled={pending} type="submit" className="w-full">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
