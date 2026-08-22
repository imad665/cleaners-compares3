'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useHomeContext } from '@/providers/homePageProvider';
import Script from 'next/script';

export default function GoogleOneTap() {
    const { user } = useHomeContext();
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Only run if user is not logged in and script is loaded
        if (!user && scriptLoaded && window.google) {
            try {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                    callback: async (response: any) => {
                        // Sign in with NextAuth using the credential from Google One Tap
                        await signIn('google', {
                            credential: response.credential,
                            redirect: false,
                        });
                        window.location.reload();
                    },
                    auto_select: false, // Encourages user to pick an account if multiple are available
                    cancel_on_tap_outside: true,
                });

                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed()) {
                        console.log('One Tap not displayed:', notification.getNotDisplayedReason());
                    } else if (notification.isSkippedMoment()) {
                        console.log('One Tap skipped:', notification.getSkippedReason());
                    } else if (notification.isDismissedMoment()) {
                        console.log('One Tap dismissed:', notification.getDismissedReason());
                    }
                });
            } catch (error) {
                console.error('Google One Tap initialization failed:', error);
            }
        }
    }, [user, scriptLoaded]);

    if (user) return null;

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                onLoad={() => setScriptLoaded(true)}
                strategy="afterInteractive"
            />
        </>
    );
}

// Add global type definition for Google Sign-In
declare global {
    interface Window {
        google: any;
        onGoogleLibraryLoad: () => void;
    }
}
