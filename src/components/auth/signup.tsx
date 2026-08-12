'use client'

import { registerAction } from "@/actions/registerAction"
import { useEffect, useState } from "react"
import { Eye, EyeOff, Loader2, User, Mail, Lock, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent } from "../ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

function InputPassword({ 
    label, 
    id, 
    name, 
    value, 
    onChange, 
    disabled, 
    placeholder, 
    autoComplete 
}: { 
    label: string, 
    id: string, 
    name: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    disabled: boolean, 
    placeholder?: string,
    autoComplete?: string
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <Lock size={18} />
                </div>
                <Input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    disabled={disabled}
                    autoComplete={autoComplete || (showPassword ? "off" : "new-password")}
                    value={value}
                    onChange={onChange}
                    required
                    className="pl-10 pr-10 h-11 transition-all shadow-sm"
                    placeholder={placeholder || "••••••••"}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none z-10"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    )
}

export default function SignUpComp({ 
    onSignInClick = null, 
    callback 
}: { 
    onSignInClick?: () => void; 
    callback?: string 
}) {
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
                setIsLoading(false);
            } else if (result?.success) {
                await signIn('credentials', {
                    email: result.email,
                    password: password,
                    callbackUrl: callback || '/'
                });
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
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
                if (result.error.includes('access_denied')) {
                    setError("Google sign-in was cancelled.");
                } else if (result.error.includes('OAuthAccountNotLinked')) {
                    setError("This email is already associated with another account.");
                } else {
                    setError("Google sign-in failed. Please try again.");
                }
            } else if (result?.ok) {
                window.location.href = result.url || "/";
            }
        } catch (err) {
            setError("An unexpected error occurred during sign-in.");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="w-full bg-transparent flex items-center justify-center">
            <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm overflow-hidden bg-white">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-navy">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                key="error"
                            >
                                <Alert variant="destructive" className="py-2.5">
                                    <AlertDescription className="flex items-center gap-2">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                                    <User size={18} />
                                </div>
                                <Input
                                    id="name"
                                    name="name"
                                    disabled={isLoading}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 h-11 transition-all shadow-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                                    <Mail size={18} />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-11 transition-all shadow-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-1">
                            <InputPassword
                                label="Password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="Create a password"
                            />
                            <InputPassword
                                label="Confirm Password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                            />
                        </div>
                        
                        <p className="text-[11px] text-muted-foreground mt-1 px-1">
                            Password must be at least 8 characters long
                        </p>

                        <Button type="submit" className="w-full h-11 font-semibold transition-all active:scale-[0.98] mt-2" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Sign Up
                                    <ArrowRight size={16} />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        className="w-full h-11 font-medium transition-all active:scale-[0.98] border-muted-foreground/20 hover:bg-muted/50"
                        onClick={handleGoogleSignUP}
                        disabled={isLoading || pending}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <Image src="/google_logo.svg" width={20} height={20} alt="Google" className="w-5 h-5" />
                            <span>Sign up with Google</span>
                        </div>
                    </Button>
                </CardContent>

                <CardFooter className="flex flex-wrap justify-center gap-1 py-4 text-sm text-muted-foreground border-t bg-muted/20">
                    Already have an account?{" "}
                    {onSignInClick ? (
                        <button
                            onClick={onSignInClick}
                            className="font-semibold text-primary hover:underline underline-offset-4 cursor-pointer bg-transparent border-none p-0"
                            disabled={isLoading}
                        >
                            Sign in
                        </button>
                    ) : (
                        <a 
                            href="/auth/signin" 
                            className="font-semibold text-primary hover:underline underline-offset-4"
                        >
                            Sign in
                        </a>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export function SignupModal({ 
    open, 
    setOpen, 
    onSignInClick, 
    callback 
}: {
    open: boolean,
    setOpen: (v: boolean) => void,
    onSignInClick: () => void;
    callback?: string;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl bg-white">
                <SignUpComp callback={callback} onSignInClick={onSignInClick} />
            </DialogContent>
        </Dialog>
    )
}
