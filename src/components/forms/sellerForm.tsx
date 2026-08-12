'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { startTransition, useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useHomeContext } from '@/providers/homePageProvider'
import { formSellerAction } from '@/actions/actionSellerForm'
import { Building2, Phone, MapPin, Hash, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SellerFormDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?: string;
  onSuccess?: () => void;
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

    if (state.success || (state.needToResignin && ktry <= 2)) {
      if (state.success) {
        toast.success(state.message);
        setOpen?.(false);
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
            <Building2 size={18} />
          </div>
          <Input
            id="businessName"
            name="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            placeholder="Your cleaning business name"
            className="pl-10 h-11 transition-all shadow-sm"
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
            <Phone size={18} />
          </div>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="+44 123 456 7890"
            className="pl-10 h-11 transition-all shadow-sm"
            disabled={pending}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">Address</Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
              <MapPin size={18} />
            </div>
            <Input
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Street, City"
              className="pl-10 h-11 transition-all shadow-sm"
              disabled={pending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium">Post Code</Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
              <Hash size={18} />
            </div>
            <Input
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="E1 6AN"
              className="pl-10 h-11 transition-all shadow-sm"
              disabled={pending}
            />
          </div>
        </div>
      </div>

      <Button
        disabled={pending}
        type="submit"
        className="w-full h-11 mt-2 font-semibold transition-all active:scale-[0.98]"
      >
        {pending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Become a Seller
            <ArrowRight size={16} />
          </div>
        )}
      </Button>
    </form>
  );
}

export default function SellerFormDialog({
  open,
  setOpen,
  callback = '/',
  onSuccess,
  title,
  description,
  redirect = true
}: SellerFormDialogProps & {
  title?: string,
  description?: string;
  redirect?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="p-6">
          <DialogHeader className="space-y-2 pb-4">
            <DialogTitle className="text-2xl font-bold tracking-tight text-navy">
              {title || "Register as a Cleaner"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {description || "Join our community and start growing your cleaning business today."}
            </DialogDescription>
          </DialogHeader>
          <SellerForm callback={callback} redirect={redirect} setOpen={setOpen} onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
