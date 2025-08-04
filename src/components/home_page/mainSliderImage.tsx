'use client'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button" // assuming you're using shadcn/ui

const slides = [
  {
    img: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=1200&auto=format&fit=crop",
    title: "Find the Best Deals for Your Business",
    description: "Shop premium tools and equipment with fast shipping!",
  },
  {
    img: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1200&auto=format&fit=crop",
    title: "Affordable Business Solutions for Every Industry",
    description: "Save up to 40% on high-quality equipment for professionals.",
  },
  {
    img: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?q=80&w=1200&auto=format&fit=crop",
    title: "Reliable Tools for Growing Your Business",
    description: "Shop now and enjoy exclusive offers on industrial products.",
  },
  // Seller-specific slide
  {
    img: "/seller.jpg",
    title: "Become a Seller on Our Platform",
    description: "Start selling today and reach thousands of potential customers. Join now!",
  },
]

function NextArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute hidden top-1 md:block md:top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer bg-white/70 rounded-full p-2 hover:bg-white"
    >
      <ChevronRight className="w-5 h-5 text-black " />
    </div>
  )
}

function PrevArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute hidden  md:block top-1 md:top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer bg-white/70 rounded-full p-2 hover:bg-white"
    >
      <ChevronLeft className="w-5 h-5 text-black" />
    </div>
  )
}

const settings = {
  autoplay: true,
  autoplaySpeed: 5000,
  infinite: true,
  dots: false,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
}

export function HeroCarousel() {
  return (
    <div className="relative hidden w-full max-w-[100vw] mx-auto ">
      <div id="toTop"></div>
      <Slider {...settings}>
        {slides.map((slide, i) => (
          <div key={i} className="relative">
            <img src={slide.img} className="w-full h-[400px] object-cover" />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end items-start p-8 text-white  ">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <p className="text-lg mb-4">{slide.description}</p>
              <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                {i === 3 ? "Join as Seller" : "Shop Now"}
              </Button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
