import App from "@/components/video_ui/App";

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Educational Videos for Laundry & Cleaning Professionals | CleanersCompare",
    description: "Explore categorized educational videos on laundry, dry cleaning, and equipment handling. Learn best practices, expert tips, and business strategies.",
    keywords: [
        "educational videos",
        "laundry training",
        "dry cleaning tutorials",
        "laundry business education",
        "how to run a cleaning business",
        "laundry equipment videos",
    ],
    openGraph: {
        title: "Free Educational Videos for Laundry Professionals",
        description: "Watch videos to improve your laundry and dry cleaning business. Learn from professionals and gain practical skills.",
        url: "https://cleanerscompare.com/app/educationa-videos",
        siteName: "CleanersCompare",
        images: [
            {
                url: "/uploads/logo.png", // Replace with your actual thumbnail
                alt: "Laundry Education Video",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Educational Videos for Laundry Business Owners",
        description: "Boost your knowledge with categorized video tutorials. Perfect for entrepreneurs and cleaning professionals.",
        images: ["/uploads/logo.png"], // Replace if you have a default cover image
    },
    robots: {
        index: true,
        follow: true,
    },
};


export default function Page() {
    return (
        <App />
    )
}