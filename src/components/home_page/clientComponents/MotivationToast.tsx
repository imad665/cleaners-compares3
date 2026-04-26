"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { generateMotivationMessagesAction } from "@/actions/motivationMessagesAction";

interface Message {
    id: number;
    text: string;
}

const TOAST_DURATION = 6000;      // 6 seconds visible
const MIN_INTERVAL = 60000;        // 1 min min between toasts
const MAX_INTERVAL = MIN_INTERVAL * 2;       // 2 min max
const MESSAGES_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

export default function MotivationToast() {
    // Generate initial 30 messages
    const [messages, setMessages] = useState<Message[]>([]);


    //console.log(messages, 'cscscsvvv');

    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Optional: refresh messages periodically to show new products
    useEffect(() => {
        if (messages.length === 0) {
            generateMotivationMessagesAction(30).then(d => setMessages(d));
        }
        const refreshInterval = setInterval(() => {
            generateMotivationMessagesAction(30).then(d => setMessages(d));

        }, MESSAGES_REFRESH_INTERVAL);
        return () => clearInterval(refreshInterval);
    }, []);

    // Function to pick a random message from current messages
    const getRandomMessage = (): Message | null => {
        if (messages.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    };

    // Show a new toast with animation
    const showToast = () => {
        const newMessage = getRandomMessage();
        if (!newMessage) return;
        setCurrentMessage(newMessage);
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
        }, TOAST_DURATION);
    };

    // Schedule next toast after a random interval
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const scheduleNext = () => {
            const randomInterval =
                Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
            timeoutId = setTimeout(() => {
                showToast();
                scheduleNext();
            }, randomInterval);
        };

        // Start first toast after a short delay (3 seconds, not 30)
        const initialDelay = setTimeout(() => {
            showToast();
            scheduleNext();
        }, 30000); // changed from 30000 to 3000 for better UX

        return () => {
            clearTimeout(initialDelay);
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]); // re-run if messages change (so getRandomMessage uses fresh list)

    if (!currentMessage) return null;

    return (
        <div
            className={cn(
                "fixed top-4 left-4 z-50 max-w-[280px] md:max-w-sm", // changed top-4 to bottom-4 as per earlier spec
                "transition-all duration-500 ease-out",
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0 pointer-events-none"
            )}
        >
            <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 p-3 dark:bg-gray-900/95 dark:border-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                    </svg>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {currentMessage.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}