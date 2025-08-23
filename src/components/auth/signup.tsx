'use client'

import { registerAction } from "@/actions/registerAction"
import { useActionState, useEffect, useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
import { signIn } from "next-auth/react"
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
import { useRouter } from "next/navigation"


export function InputPassword({ name, pending, text }: { name: string, pending: boolean, text: string }) {
    const [isCloseEye, setIsCloseEye] = useState(false);
    const [password, setPassWord] = useState('');
    return (
        <div className="relative">
            <Label htmlFor="password">{text}</Label>
            <Input
                disabled={pending}
                autoComplete={!isCloseEye ? "new-password" : 'off'}
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                id={name}
                type={!isCloseEye ? "password" : 'text'}
                name={name}
                required />
            <button type="button" onClick={() => setIsCloseEye(!isCloseEye)} className="absolute cursor-pointer right-2 top-1/2 text-muted-foreground" >
                {!isCloseEye ?
                    <Eye size={16} /> :
                    <EyeClosed size={16} />}
            </button>
        </div>
    )
}

export default function SignUpComp({ onSignInClick = null }: { onSignInClick?: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Client-side validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);

            const result = await registerAction(null, formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                await signIn('credentials', {
                    email: result.email,
                    password: password,
                    callbackUrl: '/'
                });
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 4000);
        }
    };

    const handleGoogleSignUP = async () => {
        setPending(true);
        setError("");

        try {
            const result = await signIn("google", {
                callbackUrl: "/",
                redirect: false
            });

            if (result?.error) {
                // Handle specific Google errors
                if (result.error.includes('access_denied')) {
                    setError("Google sign-in was cancelled.");
                } else if (result.error.includes('OAuthAccountNotLinked')) {
                    setError("This email is already associated with another account.");
                } else {
                    setError("Google sign-in failed. Please try again.");
                }
                console.error("Google sign-in error:", result.error);
            } else if (result?.ok) {
                // Successful sign-in - reload the page
                window.location.href = result.url || "/";
            }
        } catch (err) {
            setError("An unexpected error occurred during sign-in.");
            console.error("Google sign-in exception:", err);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="w-full bg-white flex items-center justify-center px-4 relative">
            {isLoading && <div className="w-full h-full bg-[rgba(0,0,0,0.5)] absolute z-1000 flex items-center justify-center"><BeatLoader /></div>}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                disabled={isLoading}
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name="name"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                disabled={isLoading}
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                name="email"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                disabled={isLoading}
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Password must be at least 8 characters
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                disabled={isLoading}
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="my-4 flex items-center justify-between">
                        <hr className="w-full border-gray-300" />
                        <span className="px-2 text-gray-500 text-sm">or</span>
                        <hr className="w-full border-gray-300" />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignUP}
                        disabled={isLoading}
                    >
                        <Image src="/google_logo.svg" width={50} height={50} alt="Google" className="w-5 h-5" />
                        Sign up with Google
                    </Button>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    {onSignInClick && <button
                        onClick={onSignInClick}
                        className="text-blue-600 ml-1 border-none bg-none hover:underline"
                        disabled={isLoading}
                    >
                        Sign in
                    </button>}
                    {!onSignInClick && <a
                        href="/auth/signin"
                        className="text-blue-600 ml-1 hover:underline"
                    >
                        Sign in
                    </a>}
                </CardFooter>
            </Card>
        </div>
    )
}

export function SignupModal({ open, setOpen, onSignInClick }:
    {
        open: boolean,
        setOpen: (v: boolean) => void
        onSignInClick: () => void
    }) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="   h-auto">
                <SignUpComp onSignInClick={onSignInClick} />
            </DialogContent>
        </Dialog>
    )
}
