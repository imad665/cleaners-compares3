'use client'
import { BookOpen, HardHat, LucideIcon, Package, Package2, Shirt, ShowerHead, Truck } from "lucide-react"
import Link from "next/link"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { ItemShopByCategory } from "./serverComponents/uis"

const dataCateg = [
    { Icon: ShowerHead, text: 'New Machines' },
    { Icon: ShowerHead, text: 'Used Machines' },
    { Icon: Package, text: 'Parts' },
    { Icon: Package2, text: 'Sundries' },
    { Icon: HardHat, text: 'Engineers' },
    { Icon: BookOpen, text: 'Blog' },
    
]

export default function ShopByCategory() {
    return (
        <section className="py-8 bg-gray-100 w-full">
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {dataCateg.map((cat) => (
                        <ItemShopByCategory key={cat.text} text={cat.text} Icon={cat.Icon} />
                    ))}
                </div>
            </div>
        </section>
    )
}