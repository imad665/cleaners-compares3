'use client'
import Image from "next/image";
import { ButtonNeedSignIn, ProductSearchBar } from "../header/productSearchBar";
import styles from "./mainImage2.module.css"
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { ArrowRight, Check, Plus, Youtube } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function BigButton({ text, onClick, disabled }: { text: string, onClick: () => void, disabled?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="text-center"
    >
      <Button
        disabled={disabled}
        className=" w-[170px] font-bold bg-primary text-primary-foreground/80  p-5  hover:bg-primary/80 cursor-pointer relative overflow-hidden group"
        onClick={onClick}
      >
        <Plus />
        {/* Animated background on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

        {/* Text with shine effect */}
        <span className="relative z-10">
          {text}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
        </span>

        {/* Ripple effect (will be added via JavaScript) */}
        <span className="absolute inset-0 rounded-md overflow-hidden">
          <span className="ripple-effect absolute bg-white opacity-0 rounded-full -translate-x-1/2 -translate-y-1/2"></span>
        </span>
      </Button>
    </motion.div>
  );
}

export function MainImage() {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();
  const slides = [
    { src: '/assets/hero-washer.jpg', title: 'Industrial Washer Extractor', price: '£22,000.00' },
    { src: '/assets/hero-boiler-part.jpg', title: 'Boiler Spare Parts', price: null },
    { src: '/assets/hero-spotting-table.jpg', title: 'Spotting Table with Vacuum', price: '£1,450.00' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % slides.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-hero-bg overflow-hidden">
      <div className="container mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-extrabold text-center md:text-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
            The Laundry & Dry Cleaning Industry Marketplace
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            Find machines, parts, sundries, engineers, services and businesses for sale — all in one dedicated industry platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-supplier-soft px-4 py-2 text-sm text-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-supplier text-supplier-foreground text-[11px]">★</span>
            We can list your products for you — no technical setup required.
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <button onClick={() => router.push("/about-platform")} className="px-6 py-3 cursor-pointer rounded-lg font-medium bg-secondary text-secondary-foreground border hover:bg-secondary/80">
              Learn more about our platform
            </button>
            {/* <ButtonNeedSignIn text="Sell Your Products" buttonClassName="w-full md:w-fit" /> */}
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Youtube className="h-6 w-6 text-youtube" />
            <span>
              Trusted by professionals, supported by our YouTube channel with{" "}
              <a href="https://www.youtube.com/@amirshahz77" className="text-primary font-semibold underline">1K+ subscribers.</a>
            </span>
          </div>
        </div>

        {/* --- IMAGE SECTION --- */}
        <div className="relative w-full">

          {/* MOBILE SLIDER (Hidden on Desktop) */}
          <div className="lg:hidden relative aspect-square w-full max-w-md mx-auto bg-card border rounded-3xl shadow-2xl overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out p-6 flex flex-col items-center justify-center text-center ${index === activeImage ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="max-h-[60%] w-auto object-contain rounded-xl mb-4"
                />
                <h3 className="font-bold text-lg">{slide.title}</h3>
                {slide.price && <p className="text-primary font-bold">{slide.price}</p>}
              </div>
            ))}

            {/* Mobile Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border rounded-full px-4 py-2 text-[10px] font-medium inline-flex items-center gap-2 whitespace-nowrap">
              <Check className="h-3 w-3 text-primary" />
              Done-for-you supplier onboarding
            </div>
          </div>

          {/* DESKTOP COLLAGE (Hidden on Mobile) */}
          <div className="hidden lg:block relative aspect-square max-w-xl mx-auto w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src='/assets/hero-washer.jpg' alt="Main Washer" className="w-3/4 h-auto rounded-2xl shadow-xl" />
            </div>

            <div className="absolute top-4 left-0 bg-card border rounded-xl shadow-lg p-3 w-44">
              <p className="text-xs font-semibold leading-tight">Girbau HS-6017 Washer</p>
              <img src='/assets/hero-small-washer.jpg' alt="" className="my-2 rounded-md" />
              <p className="text-xs font-bold text-primary">£22,000.00</p>
            </div>

            <div className="absolute bottom-16 left-2 bg-card border rounded-xl shadow-lg p-3 w-44">
              <p className="text-xs font-semibold leading-tight">Boiler Spare Parts</p>
              <img src='/assets/hero-boiler-part.jpg' alt="" className="mt-2 rounded-md" />
            </div>

            <div className="absolute top-1/4 right-0 bg-card border rounded-xl shadow-lg p-3 w-44">
              <p className="text-xs font-semibold leading-tight">Spotting Table</p>
              <img src='/assets/hero-spotting-table.jpg' alt="" className="my-2 rounded-md" />
              <p className="text-xs font-bold text-primary">£1,450.00</p>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border rounded-full shadow-md px-4 py-2 text-xs font-medium inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-primary" />
              Done-for-you supplier onboarding
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
