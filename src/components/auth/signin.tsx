

'use client'

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, Eye, EyeClosed, Loader2 } from "lucide-react"
import BeatLoader from "react-spinners/BeatLoader"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent } from "../ui/dialog"
import { resetPasswordEmail } from "@/actions/resetPasswordActionEmail"
import { toast } from "sonner"

function InputPassword({ pending, password, setPassWord }: { pending: boolean, password: string, setPassWord: (v: string) => void }) {
    const [isCloseEye, setIsCloseEye] = useState(false);

    return (
        <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
                disabled={pending}
                autoComplete={!isCloseEye ? "current-password" : "off"}
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                id="password"
                type={!isCloseEye ? "password" : "text"}
                name="password"
                required
            />
            <button
                type="button"
                onClick={() => setIsCloseEye(!isCloseEye)}
                className="absolute cursor-pointer right-2 top-1/2 text-muted-foreground"
            >
                {!isCloseEye ? <Eye size={16} /> : <EyeClosed size={16} />}
            </button>
        </div>
    )
}

export default function SignInComp({ onSignUpClick, setOpen }:
    { onSignUpClick?: () => void, setOpen?: () => void }) {
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams?.get("error")) {
            setError("Invalid credentials. Please try again.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: pathname.includes('signin'),
            callbackUrl: "/"
        });

        if (res?.ok) {
            if (setOpen) {
                setTimeout(() => {
                    setOpen(false);
                }, 5000);
            }
            window.location.reload()
        } else {
            if (res?.error === "SUSPENDED") {
                setError("Your account is suspended. Please contact support.");
            } else if (res?.error === "CredentialsSignin") {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Try again.");
            }
            setPending(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        setPending(true);
        try {
            const { message } = await resetPasswordEmail(email)
            if (message) {
                toast.success(message);
                setResetSent(true);
                setError('');
            } else {
                setError("Failed to send reset email");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setPending(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setPending(true);
        setError("");

        try {
            const result = await signIn("google", {
                callbackUrl: "/",
                redirect: false
            });

            if (result?.error) {
                setError("Google sign-in failed. Please try again.");
                console.error("Google sign-in error:", result.error);
            } else if (result?.ok) {
                // Successful sign-in
                window.location.href = result.url || "/";
            }
        } catch (err) {
            setError("An unexpected error occurred during sign-in.");
            console.error("Google sign-in exception:", err);
        } finally {
            setPending(false);
        }
    };

    // In your JSX, update the Google button:


    return (
        <div className="w-full bg-white flex items-center justify-center px-4 relative">
            {pending && (
                <div className="w-full h-full bg-[rgba(0,0,0,0.5)] absolute z-1000 flex items-center justify-center">
                    <BeatLoader />
                </div>
            )}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        {showForgotPassword ? "Reset Password" : "Sign In to Your Account"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-4 text-sm text-red-500 text-center">
                            {error.includes('suspended') && <AlertTriangle />}
                            {error}
                        </div>
                    )}

                    {resetSent ? (
                        <div className="mb-4 text-sm text-green-500 text-center">
                            Password reset link sent to your email. Please check your inbox.
                        </div>
                    ) : showForgotPassword ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    disabled={pending}
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="your@email.com"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Make sure this matches the email you used to sign up
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError('');
                                    }}
                                    disabled={pending}
                                >
                                    Back to Sign In
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={handleForgotPassword}
                                    disabled={pending}
                                >
                                    {pending ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground mt-4">
                                Didn't receive an email? Check your spam folder or try again.
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        disabled={pending}
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                    />
                                </div>

                                <InputPassword pending={pending} password={password} setPassWord={setPassword} />

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-blue-600 hover:underline"
                                        disabled={pending}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full" disabled={pending}>
                                    {pending ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            <div className="my-4 flex items-center justify-between">
                                <hr className="w-full border-gray-300" />
                                <span className="px-2 text-gray-500 text-sm">or</span>
                                <hr className="w-full border-gray-300" />
                            </div>

                            <Button
                                variant="outline"
                                type="button"
                                className="cursor-pointer w-full flex items-center justify-center gap-2"
                                onClick={handleGoogleSignIn}
                                disabled={pending}
                            >
                                <Image src="/google_logo.svg" width={50} height={50} alt="Google" className="w-5 h-5" />
                                Sign in with Google
                            </Button>
                        </>
                    )}
                </CardContent>

                {!showForgotPassword && !resetSent && (
                    <CardFooter className="justify-center text-sm text-muted-foreground">
                        Don't have an account?
                        {!onSignUpClick && <a href="/auth/signup" className="text-blue-600 ml-1 hover:underline">
                            Sign up
                        </a>}
                        {onSignUpClick &&
                            <button onClick={onSignUpClick} className="text-blue-600 bg-none border-none ml-1 hover:underline">
                                Sign up
                            </button>}
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

export function SignInModal({ open, setOpen, onSignUpClick }:
    {
        open: boolean,
        setOpen: (v: boolean) => void
        onSignUpClick: () => void
    }) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" h-auto">
                <SignInComp setOpen={setOpen} onSignUpClick={onSignUpClick} />
            </DialogContent>
        </Dialog>
    )
}

