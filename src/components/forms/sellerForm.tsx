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

import { startTransition, useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useHomeContext } from '@/providers/homePageProvider'
import { formSellerAction } from '@/actions/actionSellerForm'

type SellerFormDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?: string;
}

export function SellerForm({
  setOpen,
  callback,
  redirect = true,
  onSuccess = undefined,
}: {
  setOpen?: (open: boolean) => void;
  callback: string;
  redirect?: boolean;
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(
    formSellerAction,
    undefined
  );

  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ktry, setKtry] = useState(0)

  const { user } = useHomeContext();

  useEffect(() => {
    if (!state) return;

    if (state.success || state.needToResignin && ktry <= 2) {
      setOpen?.(false);
      if (state.success) {
        toast.success(state.message);
      } else {
        setKtry(ktry + 1)
      }

      const signInUser = async () => {
        await signIn("credentials", {
          email: user?.email,
          password: "test_password",
          redirect,
          callbackUrl: callback,
        });

        onSuccess?.();

        router.refresh();
      };

      signInUser();
    } else if (state.redirect) {
      router.push(state.redirect);
    }
    else {

      toast.error(state.error);
    }
  }, [state]);

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("businessName", businessName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("city", city);
    formData.append("country", country);

    startTransition(() => {
      action(formData);
    });

  };

  return (
    <div onSubmit={handleSubmit}>
      <div>
        <label htmlFor="businessName">Business Name</label>

        <Input
          id="businessName"
          name="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone Number</label>

        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="city">Address</label>

        <Input
          id="city"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="country">Post Code</label>

        <Input
          id="country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>

      <Button
        disabled={pending}
        type="button"
        onClick={handleSubmit}
        className="w-full"
      >
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}

export default function SellerFormDialog({ open, setOpen, callback = '/' }: SellerFormDialogProps) {



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Become a Seller</DialogTitle>
        </DialogHeader>
        <SellerForm callback={callback} />
      </DialogContent>
    </Dialog>
  )
}
