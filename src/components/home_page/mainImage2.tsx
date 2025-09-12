'use client'
import Image from "next/image";
import { ProductSearchBar } from "../header/productSearchBar";
import styles from "./mainImage2.module.css"
import { Button } from "../ui/button";
import { motion } from 'framer-motion';
import { Plus } from "lucide-react";

export function BigButton({ text, onClick, disabled }: { text: string, onClick: () => void, disabled?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Button
        disabled={disabled}
        className="font-extrabold bg-blue-600 hover:bg-blue-700 cursor-pointer relative overflow-hidden group"
        onClick={onClick}
      >
        <Plus/>
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
    <div className="relative w-full px-4 py-10 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col-reverse lg:flex-row items-center container mx-auto justify-around gap-8 relative z-20">
        {/* Text Section */}
        <div
          className={`flex flex-col gap-5 max-w-full lg:max-w-[600px] text-center lg:text-left ${styles.animate_fade_in}`}
        >
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
            The World's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              First
            </span>{' '}
            Laundry &
            <br className="hidden md:block" />
            Dry Cleaning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
              Comparison
            </span>{' '}
            Website
          </h1>
          <p className="text-base sm:text-lg text-gray-700">
            Search from thousands of new and used machines to everyday sundries for the laundry and dry cleaning industry.
          </p>
          <ProductSearchBar isShowBrowser isShowSearch={false} />
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <Image
            width={680}
            height={680}
            src="/homeImage.png"
            alt="Cleaners Compare Image"
            className="w-full max-w-[500px] h-auto object-contain relative z-30"
          />
        </div>
      </div>

      {/* Enhanced Animated Waves - Fixed Bars Issue */}
      <div className="absolute z-22 inset-0 w-full h-full overflow-hidden  pointer-events-none">
        {/* Base Blue Layer */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-100 to-transparent opacity-30"></div>

        {/* Wave Container with Overflow Hidden */}
        <div className="absolute bottom-0 left-0 w-full h-[220px] overflow-hidden">
          {/* Main Wave - More Visible */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-full opacity-70"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: `${styles.waveAnimation} 18s linear infinite`,
            }}
          >
            <path
              fill="url(#waveGradient1)"
              fillOpacity="0.6"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            <defs>
              <linearGradient id="waveGradient1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Wave Container with Overflow Hidden */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] overflow-hidden">
          {/* Secondary Wave - Contrast */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-full opacity-50"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: `${styles.waveAnimation} 12s linear infinite reverse`,
            }}
          >
            <path
              fill="url(#waveGradient2)"
              fillOpacity="0.5"
              d="M0,256L48,261.3C96,267,192,277,288,277.3C384,277,480,267,576,245.3C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            <defs>
              <linearGradient id="waveGradient2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Wave Container with Overflow Hidden */}
        <div className="absolute bottom-0 left-0 w-full h-[180px] overflow-hidden">
          {/* Light Accent Wave */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-full opacity-40"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: `${styles.waveAnimation} 15s linear infinite`,
            }}
          >
            <path
              fill="url(#waveGradient3)"
              fillOpacity="0.4"
              d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,186.7C672,192,768,224,864,218.7C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            <defs>
              <linearGradient id="waveGradient3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}