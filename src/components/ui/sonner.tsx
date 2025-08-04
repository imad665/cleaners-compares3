"use client"

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Toaster as SonnerToaster, toast } from "sonner"

export function Toaster() {
    return <SonnerToaster richColors position="top-right" closeButton />
}
 