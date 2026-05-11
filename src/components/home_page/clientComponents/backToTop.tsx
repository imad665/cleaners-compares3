'use client'
import { ArrowUp } from "lucide-react";

export function BackToTop() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className="bg-gray-700 hover:bg-gray-600 block transition-colors cursor-pointer w-full"
        >
            <div className="container mx-auto p-3 text-center flex items-center justify-center">
                <ArrowUp className="h-4 w-4 mr-2" size={24} />
                <span className="text-sm">Back to top</span>
            </div>
        </button>
    )
}