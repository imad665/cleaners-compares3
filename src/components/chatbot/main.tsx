'use client';

import { useRef, useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, X, MessageCircle, Bot, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartCheckOut } from "./llm-response/shopping-cart-checkout";
import renderLLMResponse from "./llm-response/renderer";
import { useHomeContext } from "@/providers/homePageProvider";
import { Input } from "../ui/input";

export default function ChatWidget() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useHomeContext();
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const welcomeBubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // WhatsApp configuration
    const whatsappNumber = "441702597067";
    const whatsappMessage = "Hello, I have a question about your products";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Get user image or fallback to default
    const userImg = user?.image  

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Show welcome message after 5 seconds if chat is open and no messages
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            welcomeTimerRef.current = setTimeout(() => {
                setShowWelcomeMessage(true);
            }, 5000);
        } else {
            if (welcomeTimerRef.current) {
                clearTimeout(welcomeTimerRef.current);
            }
            setShowWelcomeMessage(false);
        }

        return () => {
            if (welcomeTimerRef.current) {
                clearTimeout(welcomeTimerRef.current);
            }
        };
    }, [isOpen, messages.length]);

    // Show welcome bubble after 5 seconds if chat is closed
    useEffect(() => {
        if (!isOpen) {
            welcomeBubbleTimerRef.current = setTimeout(() => {
                setShowWelcomeBubble(true);
            }, 5000);
        } else {
            if (welcomeBubbleTimerRef.current) {
                clearTimeout(welcomeBubbleTimerRef.current);
            }
            setShowWelcomeBubble(false);
        }

        return () => {
            if (welcomeBubbleTimerRef.current) {
                clearTimeout(welcomeBubbleTimerRef.current);
            }
        };
    }, [isOpen]);

    const askBot = async () => {
        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion("");
        setMessages(prev => [...prev, { type: "user", content: userQuestion }]);
        setLoading(true);
        setShowWelcomeMessage(false);

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

            setMessages(prev => [...prev, { type: "bot", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botMessage += chunk;
                console.log(botMessage);

                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex]?.type === "bot") {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            content: botMessage,
                        };
                    }
                    return updated;
                });
            }

        } catch (error) {
            console.error("Stream error:", error);
            setMessages(prev => [...prev, {
                type: "bot",
                content: "<Response><Text>Sorry, I encountered an error. Please try again.</Text></Response>"
            }]);
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

    const clearChat = () => {
        setMessages([]);
        setShowWelcomeMessage(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuestion(suggestion);
        setShowWelcomeMessage(false);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    return (
        <>
            {/* Welcome Bubble - appears above the chat button */}
            {showWelcomeBubble && !isOpen && (
                <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 animate-fade-in">
                    <div className="relative bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-gray-200">
                        <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-gray-200"></div>
                        <p className="text-sm text-gray-800">
                            Hello! Do you need help or are you searching for something?
                        </p>
                        <button
                            onClick={() => setShowWelcomeBubble(false)}
                            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                            aria-label="Close welcome message"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Chat Button with Wave Effect */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                {!isOpen && (
                    <div className="absolute inset-0 -m-3">
                        <div className="absolute inset-0 rounded-full bg-indigo-400/40 animate-ping-slow"></div>
                        <div className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping-slower"></div>
                    </div>
                )}

                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowWelcomeBubble(false);
                    }}
                    className={`
                        flex items-center justify-center 
                        w-12 h-12 sm:w-14 sm:h-14 
                        rounded-full shadow-lg transition-all duration-300 relative
                        ${isOpen
                            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                            : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        } 
                        text-white transform hover:scale-105
                    `}
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                    {isOpen ? (
                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}

                    {!isOpen && messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {messages.length}
                        </span>
                    )}
                </button>
            </div>

            {/* WhatsApp Button */}
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
                        rounded-full shadow-lg bg-green-500 hover:bg-green-600 
                        text-white transition-all duration-300 z-50
                        transform hover:scale-105
                    "
                    aria-label="Contact us on WhatsApp"
                >
                    <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={28}
                        height={28}
                        className="filter brightness-0 invert"
                    />
                </Link>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className={`
                    fixed right-4 left-4 bottom-16 
                    sm:right-6 sm:left-auto 
                    w-auto max-w-full 
                    sm:max-w-md 
                    bg-white rounded-2xl shadow-xl 
                    overflow-hidden z-40 flex flex-col
                    border border-gray-200
                `}
                    style={{
                        height: 'min(80vh, 700px)',
                        maxHeight: 'calc(100vh - 5rem)',
                        minHeight: '500px'
                    }}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-indigo-700">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">CleanersCompare Assistant</h1>
                                <p className="text-indigo-100 text-sm">How can I help you today?</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ShoppingCartCheckOut />
                            <button
                                onClick={clearChat}
                                className="p-2 rounded-full hover:bg-indigo-700 transition-colors text-sm"
                                aria-label="Clear chat"
                                title="Clear chat"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 bg-gray-50"
                    >
                        {messages.length === 0 && false ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                                <Bot className="h-12 w-12 mb-3 opacity-50" />
                                <h3 className="font-medium text-lg mb-1">Welcome to CleanersCompare</h3>
                                <p className="text-sm max-w-xs mb-4">I can help you find equipment or connect you with expert engineers!</p>

                                <div className="mt-4 space-y-3 w-full max-w-xs">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Products & Equipment</div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setQuestion("Show me products under £50")}
                                    >
                                        <p className="text-sm font-medium">Show me products under £50</p>
                                    </div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSuggestionClick("Show me laundry machines under £1000")}
                                    >
                                        <p className="text-sm font-medium">Laundry machines on budget</p>
                                    </div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSuggestionClick("What dry cleaning equipment do you have?")}
                                    >
                                        <p className="text-sm font-medium">Dry cleaning equipment</p>
                                    </div>

                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-4">Engineer Services</div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSuggestionClick("I need someone to fix my finishing machine")}
                                    >
                                        <p className="text-sm font-medium">Finishing machine repair</p>
                                    </div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSuggestionClick("Looking for laundry equipment maintenance")}
                                    >
                                        <p className="text-sm font-medium">Laundry equipment maintenance</p>
                                    </div>
                                    <div
                                        className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSuggestionClick("Need emergency repair for dry cleaning machine")}
                                    >
                                        <p className="text-sm font-medium">Emergency dry cleaning repair</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.type === 'user' ? (
                                            <div className="flex flex-row-reverse items-end max-w-full gap-2">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                                                    {userImg ? (
                                                        <img 
                                                            src={userImg} 
                                                            alt="User" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-4 w-4 text-indigo-600" />
                                                    )}
                                                </div>
                                                <div className="max-w-[80%]">
                                                    <div className="bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-3">
                                                        <p className="text-sm">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full">
                                                {renderLLMResponse(msg.content, true)}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {showWelcomeMessage && (
                                    <div className="flex justify-start">
                                        <div className="flex items-end gap-2 max-w-[90%]">
                                            <div className="flex-shrink-0 rounded-full p-2 bg-purple-100 text-purple-600">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                                <p className="text-sm text-gray-700">
                                                    Hi there! 👋 I'm here to help you find the perfect cleaning equipment or connect you with expert engineers.
                                                    What can I assist you with today?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-end gap-2 max-w-[90%]">
                                            <div className="flex-shrink-0 rounded-full p-2 bg-purple-100 text-purple-600">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                                <div className="flex space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="relative flex items-end gap-2">
                            <Input
                                ref={inputRef}
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    adjustTextareaHeight();
                                    setShowWelcomeMessage(false);
                                }}
                                onKeyDown={handleKeyPress}
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                                rows={1}
                                placeholder="Ask about products or engineers..."
                                style={{
                                    minHeight: '48px',
                                    maxHeight: '120px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                onClick={askBot}
                                disabled={loading || !question.trim()}
                                className={`flex-shrink-0 p-3 rounded-full ${loading || !question.trim()
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    } transition-colors`}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div className="mt-2 flex justify-center">
                            <p className="text-xs text-gray-500">
                                Powered by AI • May produce inaccurate information
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom animation styles */}
            <style jsx>{`
                @keyframes ping-slow {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                @keyframes ping-slower {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animate-ping-slower {
                    animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}