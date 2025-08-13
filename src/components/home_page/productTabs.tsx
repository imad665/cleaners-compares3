"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MyCarousel from "./clientComponents/myCarousel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryTabs({ allCategories }: { allCategories: any[] }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState(allCategories[0]?.name || "");

  useEffect(() => {
    if (allCategories.length > 0) {
      setActiveTab(allCategories[0].name);
    }
  }, [allCategories]);

  const handleTabChange = (value: string) => {
    setIsAnimating(true);
    setActiveTab(value);
    setTimeout(() => setIsAnimating(false), 300); // Match this with animation duration
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-5  ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Explore Our Products & Services
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w-md mx-auto sm:text-lg md:max-w-2xl">
            Discover high-quality equipment and expert services tailored for professional cleaners.
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {allCategories.length === 0 && (
            <div className="flex justify-center mt-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Tabs List with enhanced animation */}
          <div className="overflow-x-auto pb-2 mb-2">
            <TabsList className="flex w-max space-x-2 sm:space-x-3 bg-transparent px-1">
              {allCategories.map((c) => (
                <TabsTrigger
                  key={c.name}
                  value={c.name}
                  className="relative cursor-pointer font-medium text-sm text-gray-700
                    after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-600
                    after:transition-all after:duration-300 after:ease-in-out after:transform after:-translate-x-1/2
                    hover:after:w-full data-[state=active]:after:w-full
                    transition-colors duration-200 data-[state=active]:text-blue-600"
                >
                  {isAnimating && activeTab === c.name ? (
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {c.name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                    </motion.span>
                  ) : (
                    c.name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents with animation */}
          <div className="relative min-h-[400px]">
            {allCategories.map((c) => (
              <TabsContent key={c.name} value={c.name} className="absolute top-0 left-0 w-full">
                <AnimatePresence mode="wait">
                  {activeTab === c.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      key={c.name}
                    >
                      <MyCarousel>
                        {c.subCategories.map((sub, i) => (
                          <div className="space-x-2 mx-2" key={i}>
                            <CategoryCard item={sub} />
                          </div>
                        ))}
                      </MyCarousel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Enhanced CategoryCard with additional animations
export function CategoryCard({ item, className }: {
  item: {
    title: string;
    desc: string;
    img: string;
    href: string;
  },
  className?: string
}) {
  return (
    <Link href={item.href} className="cursor-pointer">
      <motion.div
        className={`group relative flex-shrink-0 w-[90vw] md:w-fit mx-1 md:min-w-[280px] rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 ${className}`}
        whileHover={{ y: -5 }}
      >
        <div className="relative aspect-video overflow-hidden flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={item.img}
              alt={item.title}
              className=" w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              width={150}
              height={150}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.desc}</p>
          <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
            <span>View more</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-1"
            >
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}