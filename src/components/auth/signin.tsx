'use client'

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import { AlertTriangle, Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
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
import { resetPasswordEmail } from "@/actions/resetPasswordActionEmail"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

function InputPassword({ pending, password, setPassWord }: { pending: boolean, password: string, setPassWord: (v: string) => void }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <Lock size={18} />
                </div>
                <Input
                    type={showPassword ? "text" : "password"}
                    disabled={pending}
                    autoComplete={showPassword ? "off" : "current-password"}
                    value={password}
                    onChange={(e) => setPassWord(e.target.value)}
                    id="password"
                    name="password"
                    required
                    className="pl-10 pr-10 h-11 transition-all shadow-sm"
                    placeholder="••••••••"
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

export default function SignInComp({
    onSignUpClick,
    setOpen,
    callback
}: {
    onSignUpClick?: () => void;
    setOpen?: (open: boolean) => void;
    callback?: string;
}) {
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
            redirect: callback != undefined || pathname.includes('signin') || email === 'admin@cleancompare.com',
            callbackUrl: email === 'admin@cleancompare.com' ? "/admin" : callback || '/'
        });

        if (!res) {
            setPending(false);
            return;
        }

        if (res?.ok) {
            window.location.reload();
        } else {
            if (res?.error === "SUSPENDED") {
                setError("Your account is suspended. Please contact support.");
            } else if (res?.error === "CredentialsSignin") {
                setError("Invalid email or password.");
            } else {
                if (email !== 'admin@cleancompare.com') {
                    setError("Something went wrong. Try again.");
                }
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
            const { message } = await resetPasswordEmail(email);
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
                        {showForgotPassword ? "Reset password" : "Welcome back"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {showForgotPassword 
                            ? "Enter your email to receive a reset link" 
                            : "Enter your credentials to access your account"}
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
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {resetSent ? (
                            <motion.div 
                                key="reset-sent"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center space-y-4 py-4"
                            >
                                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Check your inbox</p>
                                    <p className="text-xs text-muted-foreground px-4">
                                        We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                                    </p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    onClick={() => {
                                        setResetSent(false);
                                        setShowForgotPassword(false);
                                    }}
                                >
                                    Back to Sign In
                                </Button>
                            </motion.div>
                        ) : showForgotPassword ? (
                            <motion.div
                                key="forgot-password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email">Email Address</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                                            <Mail size={18} />
                                        </div>
                                        <Input
                                            id="reset-email"
                                            disabled={pending}
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            required
                                            className="pl-10 h-11 transition-all shadow-sm"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <Button
                                        className="w-full h-11"
                                        onClick={handleForgotPassword}
                                        disabled={pending}
                                    >
                                        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Send Reset Link
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full h-11"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setError('');
                                        }}
                                        disabled={pending}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sign-in"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                                                <Mail size={18} />
                                            </div>
                                            <Input
                                                disabled={pending}
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                className="pl-10 h-11 transition-all shadow-sm"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <InputPassword pending={pending} password={password} setPassWord={setPassword} />
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className="text-xs font-medium text-primary hover:underline underline-offset-4"
                                                disabled={pending}
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-11 font-semibold transition-all active:scale-[0.98]" disabled={pending}>
                                        {pending ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Signing in...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Sign In
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
                                    onClick={handleGoogleSignIn}
                                    disabled={pending}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <Image src="/google_logo.svg" width={20} height={20} alt="Google" className="w-5 h-5" />
                                        <span>Sign in with Google</span>
                                    </div>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                {!showForgotPassword && !resetSent && (
                    <CardFooter className="flex flex-wrap justify-center gap-1 py-4 text-sm text-muted-foreground border-t bg-muted/20">
                        Don't have an account?
                        {!onSignUpClick ? (
                            <a href="/auth/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                                Sign up
                            </a>
                        ) : (
                            <button 
                                onClick={onSignUpClick} 
                                className="font-semibold text-primary hover:underline underline-offset-4 cursor-pointer bg-transparent border-none p-0"
                            >
                                Sign up
                            </button>
                        )}
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}

export function SignInModal({ open, setOpen, onSignUpClick, callback }:
    {
        open: boolean,
        setOpen: (v: boolean) => void
        onSignUpClick: () => void
        callback?: string
    }) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl bg-white">
                <SignInComp setOpen={setOpen} onSignUpClick={onSignUpClick} callback={callback} />
            </DialogContent>
        </Dialog>
    )
}
