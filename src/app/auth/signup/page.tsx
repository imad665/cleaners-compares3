import SignInComp from "@/components/auth/signin"
import SignUpComp from "@/components/auth/signup"
import { Header } from "@/components/header/header"
import Footer from "@/components/home_page/footer"
import { getFooterData } from "@/lib/products/homeProducts"
import Image from "next/image"
import Link from "next/link"

export default async function SignInPage() {
     
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Header />
            
            <div className="flex flex-1">
                {/* Left side - Information panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white">
                    <div className="max-w-md mx-auto flex flex-col justify-center">
                        <div className="mb-10">
                            <div className="text-4xl font-bold mb-4">Cleaners Compare</div>
                            <div className="text-xl font-light opacity-90">
                                The World's First Laundry & Dry Cleaning Comparison Website
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <p className="text-lg">
                                Search from thousands of new and used machines to everyday sundries for the laundry and dry cleaning industry.
                            </p>
                            
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-px bg-white opacity-50"></div>
                                <div className="w-4 h-px bg-white opacity-50"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-12 text-black">
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Machines</h3>
                                <p className="text-sm opacity-80">New and used equipment</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Parts</h3>
                                <p className="text-sm opacity-80">Genuine components</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Sundries</h3>
                                <p className="text-sm opacity-80">Supplies & chemicals</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Engineers</h3>
                                <p className="text-sm opacity-80">Expert technicians</p>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-15 p-6 rounded-xl text-black">
                            <h3 className="font-semibold text-lg mb-3">Explore Our Products & Services</h3>
                            <p className="mb-4 opacity-90">Discover high-quality equipment and expert services tailored for professional cleaners.</p>
                            <Link href="/" className="px-4 py-2 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors">
                                View More →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right side - Sign in form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8 lg:hidden">
                            <h1 className="text-3xl font-bold text-gray-900">Cleaners Compare</h1>
                            <p className="text-gray-600 mt-2">Sign in to access your account</p>
                        </div>
                        <SignUpComp />
                    </div>
                </div>
            </div>
            
            <Footer footerData={await getFooterData()} />
        </div>
    )
}