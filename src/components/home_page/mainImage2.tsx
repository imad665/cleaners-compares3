'use client'
import Image from "next/image";
import { ButtonNeedSignIn, ProductSearchBar } from "../header/productSearchBar";
import styles from "./mainImage2.module.css"
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { ArrowRight, Check, Plus, Youtube } from "lucide-react";
import Link from "next/link";

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
  return (
    <section className="bg-hero-bg">
      <div className="container mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
            The World's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              First
            </span>{' '}
            Laundry &

            Dry Cleaning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
              Comparison
            </span>{' '}
            Website
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            Find machines, parts, sundries, engineers, services and businesses for sale — all in one dedicated industry platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-supplier-soft px-4 py-2 text-sm text-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-supplier text-supplier-foreground text-[11px]">★</span>
            We can list your products for you — no technical setup required.
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Connecting laundry businesses with trusted suppliers — all in one place.
          </p>

          <div className="mt-6  flex flex-col gap-3 md:flex-row">
            {/* Buyer primary CTA — links to product search */}
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground border hover:bg-secondary/80">
              <a href="/about-platform">Learn more about our platform</a>
            </Button>

            <ButtonNeedSignIn text="Sell Your Products" buttonClassName="w-full md:w-fit" />

          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Youtube className="h-6 w-6 text-youtube" />
            <span>
              Trusted by laundry and dry-cleaning professionals,<br className="hidden sm:block" />
              supported by our Cleaners Compare YouTube channel with{" "}
              <a href="https://www.youtube.com/@amirshahz77" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline-offset-2 hover:underline">
                1K+ subscribers.
              </a>
            </span>
          </div>
        </div>

        {/* Right column — product collage */}
        <div className="relative aspect-square max-w-xl mx-auto w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src='/assets/hero-washer.jpg' alt="Industrial commercial washer extractor" className="w-3/4 h-auto rounded-2xl shadow-xl" width={1024} height={1024} />
          </div>
          <div className="absolute top-4 left-0 bg-card border rounded-xl shadow-lg p-3 w-44">
            <p className="text-xs font-semibold leading-tight">Girbau HS-6017 Washer Extractor</p>
            <img src='/assets/hero-small-washer.jpg' alt="" className="my-2 rounded-md" width={512} height={512} loading="lazy" />
            <p className="text-xs font-bold text-primary">£22,000.00</p>
          </div>
          <div className="absolute bottom-16 left-2 bg-card border rounded-xl shadow-lg p-3 w-44">
            <p className="text-xs font-semibold leading-tight">Boiler Spare Parts Complete Range</p>
            <img src='/assets/hero-boiler-part.jpg' alt="" className="mt-2 rounded-md" width={512} height={512} loading="lazy" />
          </div>
          <div className="absolute top-1/4 right-0 bg-card border rounded-xl shadow-lg p-3 w-44">
            <p className="text-xs font-semibold leading-tight">Spotting Table with Vacuum</p>
            <img src='/assets/hero-spotting-table.jpg' alt="" className="my-2 rounded-md" width={512} height={512} loading="lazy" />
            <p className="text-xs font-bold text-primary">£1,450.00</p>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border rounded-full shadow-md px-4 py-2 text-xs font-medium inline-flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary" />
            Done-for-you supplier onboarding
          </div>
        </div>
      </div>
    </section>
  );
}
