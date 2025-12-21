// app/about-platform/page.tsx
import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { CheckCircle, TrendingUp, Shield, Users, Zap, Target, BarChart, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getRecentOrdersCount } from '@/lib/products/homeProducts'
import { getNotifications } from '@/lib/payement/get-notification-for-icon'
import { Header } from '@/components/header/header'

export const metadata: Metadata = {
    title: 'About Our Platform | Cleaners Compare',
    description: 'Learn how Cleaners Compare revolutionizes the laundry and dry cleaning industry marketplace for both buyers and sellers.',
}

export default async function AboutPlatformPage() {
    const recentOrderCount = await getRecentOrdersCount();
    const messages = await getNotifications();

    return (
        <div>

            <Header recentOrderCount={recentOrderCount} notificationData={messages} />
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Header and Return to Home */}

                {/* Return to Home Link */}


                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
                    <div className="container mx-auto px-4 py-20 relative">
                        <div className="container mx-auto px-4 pt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-white-600 hover:text-blue-100 font-medium transition-colors duration-300 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                Return to Homepage
                            </Link>
                        </div>
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Revolutionizing the
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                    Laundry & Dry Cleaning Industry
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                                Connecting buyers and sellers in the world's first comprehensive comparison marketplace
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {/* Links without Button components */}
                                <Link
                                    href="#for-buyers"
                                    className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    For Buyers
                                </Link>
                                <Link
                                    href="#for-sellers"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                                >
                                    <Target className="w-5 h-5" />
                                    For Sellers
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Stats */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '500+', label: 'Active Sellers', icon: Users },
                            { value: '10,000+', label: 'Products Listed', icon: BarChart },
                            { value: '95%', label: 'Satisfaction Rate', icon: Shield },
                            { value: '24/7', label: 'Platform Access', icon: Globe },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        {/* For Buyers Section */}
                        <section id="for-buyers" className="mb-20 scroll-mt-20">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                <div className="lg:w-1/2">
                                    <div className="inline-flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                            For Buyers
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        Search from hundreds of sellers to compare and save
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Find exactly what you need with our comprehensive comparison tools. Save time and money by accessing multiple suppliers in one place.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            "Compare prices across multiple suppliers instantly",
                                            "Access detailed product specifications and reviews",
                                            "Find both new and used equipment",
                                            "Get the best deals with price tracking",
                                            "Connect directly with trusted sellers",
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Link without Button */}
                                    {/*  <Link 
                                    href="/search" 
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                                >
                                    <Zap className="w-5 h-5" />
                                    Start Searching
                                </Link> */}
                                </div>

                                <div className="lg:w-1/2">
                                    <Card className="border-none shadow-xl overflow-hidden">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8">
                                            <div className="space-y-6">
                                                <h3 className="text-2xl font-bold text-gray-900">Buyer Benefits</h3>
                                                <div className="grid gap-4">
                                                    {[
                                                        { title: "Time Saving", desc: "Compare hundreds of listings in minutes" },
                                                        { title: "Cost Effective", desc: "Get the best prices with our comparison tools" },
                                                        { title: "Verified Sellers", desc: "All sellers are vetted for quality assurance" },
                                                        { title: "Wide Selection", desc: "From machines to sundries, we have it all" },
                                                    ].map((benefit, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                            <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                                                            <p className="text-sm text-gray-600">{benefit.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </section>

                        {/* For Sellers Section */}
                        <section id="for-sellers" className="mb-20 scroll-mt-20">
                            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                                <div className="lg:w-1/2">
                                    <div className="inline-flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                                            For Sellers
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        Market & expand your services in our growing community
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Reach thousands of potential customers and grow your business with our dedicated seller platform.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            "Access to thousands of industry professionals",
                                            "Easy listing management dashboard",
                                            "Real-time analytics and insights",
                                            "Marketing tools to boost visibility",
                                            "Secure payment processing",
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Link without Button */}
                                    {/*  <Link 
                                    href="/seller-registration" 
                                    className="inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    Join as Seller
                                </Link> */}
                                </div>

                                <div className="lg:w-1/2">
                                    <Card className="border-none shadow-xl overflow-hidden">
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8">
                                            <div className="space-y-6">
                                                <h3 className="text-2xl font-bold text-gray-900">Seller Advantages</h3>
                                                <div className="grid gap-4">
                                                    {[
                                                        { title: "Increased Visibility", desc: "Get discovered by thousands of potential buyers" },
                                                        { title: "Business Growth", desc: "Expand your customer base exponentially" },
                                                        { title: "Easy Management", desc: "Simple dashboard for all your listings" },
                                                        { title: "Competitive Edge", desc: "Stand out with verified seller status" },
                                                    ].map((advantage, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                            <h4 className="font-semibold text-gray-900 mb-1">{advantage.title}</h4>
                                                            <p className="text-sm text-gray-600">{advantage.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </section>

                        {/* CTA Section */}

                    </div>
                </div>
            </main>
        </div>

    )
}