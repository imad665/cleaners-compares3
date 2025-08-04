"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"
import { signIn } from "next-auth/react"

export function ContinueWithGoogleAlert() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 1500)
        return () => clearTimeout(timeout)
    }, [])

    if (!show) return null

    return (
        <div className="fixed top-6 right-6 z-50">
            <Card className="relative w-[320px] shadow-lg p-4 border border-gray-200">
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center gap-3 text-center">
                    <p className="text-sm text-muted-foreground">
                        To get started, sign in with your Google account.
                    </p>

                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                        <Image
                            src="/google_logo.svg"
                            alt="Google logo"
                            width={18}
                            height={18}
                        />
                        Continue with Google
                    </Button>
                </div>
            </Card>
        </div>
    )
}
