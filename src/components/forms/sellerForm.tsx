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

type SellerFormDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?:string;
}

export default function SellerFormDialog({ open, setOpen,callback='/' }: SellerFormDialogProps) {
  const [state, action, pending] = useActionState(formSellerAction, undefined);
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { user } = useHomeContext()

  useEffect(() => {
    if (!state) return
    if (state.success) {
      setOpen(false)
      toast.success(state.message)
      const a = async () => {
        await signIn("credentials", {
          email: user?.email,
          password: "test_password",
          //redirect: false,
          callbackUrl:callback
        });
        //await signOut();
        router.refresh();
      }
      a();

    } else if (state.redirect) { router.push(state.redirect) }
    else {
      toast.error(state.error);
    }
  }, [state]);


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
            <Label htmlFor="city">Address</Label>
            <Input
              id="city"
              name="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Post Code</Label>
            <Input
              id="country"
              name="country"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
              required
            />
          </div>

          <Button disabled={pending} type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
