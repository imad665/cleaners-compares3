'use client';

import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MessageSquare, Send, Loader2, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChatWidget() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const kref = useRef(0);

    // WhatsApp configuration
    const whatsappNumber = "441702597067";
    const whatsappMessage = "Hello, I have a question about your products";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const askBot = async () => {
        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion("");
        setMessages(prev => [...prev, { type: "user", content: userQuestion }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chatbot/stream", {
                method: "POST",
                body: JSON.stringify({ question: userQuestion }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";

            // Add placeholder bot message (empty string)
            setMessages(prev => [...prev, { type: "bot", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botMessage += chunk;

                // Live update last message (bot)
                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex]?.type === "bot") {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            content: botMessage.replace('```', '').replace('markdown', ''),
                        };
                    }
                    return updated;
                });
            }

        } catch (error) {
            console.error("Stream error:", error);
            setMessages(prev => [...prev, { type: "bot", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            askBot();
        }
    };

    const adjustTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [question]);

    return (
        <>
            {/* Floating Chat Button - Responsive positioning */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed bottom-4 right-4 
                    sm:bottom-6 sm:right-6 
                    flex items-center justify-center 
                    w-12 h-12 sm:w-14 sm:h-14 
                    rounded-full shadow-lg transition-all duration-300 z-50 
                    ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'} 
                    text-white
                `}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
            </button>


            {isOpen && (
                <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
        fixed bottom-4 right-20 
        sm:bottom-6 sm:right-24 
        flex items-center justify-center 
        w-12 h-12 sm:w-14 sm:h-14 
        rounded-full shadow-lg  bg-green-50 hover:bg-green-100 
        text-white transition-all duration-300 z-50
      "
                    aria-label="Contact us on WhatsApp"
                >
                    <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={28}
                        height={28}
                        priority={false}
                    />
                </Link>
            )}

            {/* Chat Panel - Responsive sizing */}
            {isOpen && (
                <div className={`
                    fixed right-4 left-4 bottom-16 
                    sm:right-6 sm:left-auto 
                    w-auto max-w-full 
                    sm:max-w-md 
                    bg-white rounded-t-2xl rounded-bl-2xl shadow-xl 
                    overflow-hidden z-40 flex flex-col
                    border border-gray-200
                `}
                    style={{
                        height: 'min(80vh, 600px)',
                        maxHeight: 'calc(100vh - 5rem)',
                        minHeight: '300px'
                    }}>

                    {/* Header with WhatsApp and Close button */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 sm:p-2 rounded-full bg-lime-500 hover:bg-lime-600 transition-colors"
                                aria-label="Contact us on WhatsApp"
                                title="whatsapp"
                            >
                                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            </a>
                            <div>
                                <h1 className="text-sm sm:text-lg font-bold">Store Assistant</h1>
                                <p className="text-indigo-100 text-xs">How can I help you today?</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-indigo-700 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3 opacity-50" />
                                <p className="text-xs sm:text-sm">Ask me about products, prices, or anything else!</p>
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[90%] sm:max-w-[80%] rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base ${msg.type === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-3 py-2 shadow-sm max-w-[80%]">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-2 sm:p-3 bg-white">
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    adjustTextareaHeight();
                                }}
                                onKeyDown={handleKeyPress}
                                className="w-full p-2 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm sm:text-base"
                                rows={1}
                                placeholder="Type your question..."
                                style={{
                                    minHeight: '40px',
                                    maxHeight: '120px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                onClick={askBot}
                                disabled={loading || !question.trim()}
                                className={`absolute right-2 bottom-2 p-1 rounded-lg ${loading || !question.trim()
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    } transition-colors`}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}