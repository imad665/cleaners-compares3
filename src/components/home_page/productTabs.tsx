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

const c = 5;
/* const subcategories = {
  newMachines: [
    {
      title: "Dry Cleaning",
      desc: "Brand new dry cleaning machines with warranty.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-drycleaning.jpg",
    },
    {
      title: "Laundry",
      desc: "New commercial laundry equipment.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-laundry.jpg",
    },
    {
      title: "Wet Cleaning",
      desc: "Latest eco-friendly wet cleaning systems.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-wetcleaning.jpg",
    },
    {
      title: "Finishing",
      desc: "New professional finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
    {
      title: "Finishing",
      desc: "New professional finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
    {
      title: "Finishing",
      desc: "New professional finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
    {
      title: "Finishing",
      desc: "New professional finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
    {
      title: "Finishing",
      desc: "New professional finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
  ],
  usedMachines: [
    {
      title: "Dry Cleaning",
      desc: "Certified pre-owned dry cleaning machines.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-drycleaning.jpg",
    },
    {
      title: "Laundry",
      desc: "Refurbished laundry equipment with warranty.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-laundry.jpg",
    },
    {
      title: "Wet Cleaning",
      desc: "Quality used wet cleaning systems.",
      img: "https://www.cleanerscompare.com/pics/1/machinery-wetcleaning.jpg",
    },
    {
      title: "Finishing",
      desc: "Used finishing equipment in great condition.",
      img: "https://www.cleanerscompare.com/pics/1/pressing-products.jpg",
    },
  ],
  newParts: [
    {
      title: "Dry Cleaning",
      desc: "Genuine new parts for dry cleaning systems.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
    {
      title: "Laundry",
      desc: "Original manufacturer parts for laundry machines.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
    {
      title: "Finishing",
      desc: "New replacement parts for finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
  ],
  usedParts: [
    {
      title: "Dry Cleaning",
      desc: "Quality used parts for dry cleaning machines.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
    {
      title: "Laundry",
      desc: "Tested used parts for laundry equipment.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
    {
      title: "Finishing",
      desc: "Reliable used parts for presses and ironers.",
      img: "https://www.cleanerscompare.com/pics/1/parts.jpg",
    },
  ],
  sundries: [
    {
      title: "Wire Hangers",
      desc: "Durable wire hangers available in bulk.",
      img: "https://www.cleanerscompare.com/pics/1/cc-wire-hangers.jpg",
    },
    {
      title: "Plastic Hangers",
      desc: "Sturdy and lightweight plastic hanger options.",
      img: "https://www.cleanerscompare.com/pics/1/cc-coloured-hangers.jpg",
    },
    {
      title: "Wooden Hangers",
      desc: "Luxury wooden hangers for premium garments.",
      img: "https://www.cleanerscompare.com/pics/1/woodenhangars.jpg",
    },
    {
      title: "Detergents & Chemicals",
      desc: "Effective cleaning chemicals for all fabric types.",
      img: "https://www.cleanerscompare.com/pics/1/detergent-supplies.jpg",
    },
  ],
  engineers: [
    {
      title: "Dry Cleaning",
      desc: "Find engineers who specialize in dry cleaning systems.",
      img: "https://www.cleanerscompare.com/pics/1/service.jpg",
    },
    {
      title: "Laundry",
      desc: "Laundry system installation and maintenance experts.",
      img: "https://www.cleanerscompare.com/pics/1/service.jpg",
    },
    {
      title: "Finishing",
      desc: "Skilled technicians for finishing equipment.",
      img: "https://www.cleanerscompare.com/pics/1/service.jpg",
    },
  ],
}; */
export default function CategoryTabs({ allCategories }: { allCategories: any[] }) {
  //const { allCategories } = useHomeProductContext();
  //console.log(allCategories, 'uuuuuuuuuuuuuu');

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-5 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <Tabs defaultValue="newMachines" className="w-full ">
          {/* Scrollable TabsList */}
          {allCategories.length === 0 && <div className="flex justify-center mt-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>}
          <div className="overflow-x-auto pb-2 mb-2">
            {/* <TabsList className="flex w-max space-x-2 sm:space-x-4 bg-transparent px-1">
              {["newMachines", "usedMachines", "newParts", "usedParts", "sundries", "engineers"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 shadow-sm text-sm sm:px-4 sm:py-2"
                >
                  {tab.replace(/([A-Z])/g, ' $1').trim()}
                </TabsTrigger>
              ))}
            </TabsList> */}
            <TabsList className="flex w-max space-x-2 sm:space-x-3 bg-transparent px-1">
              {allCategories.map((c) => (
                <TabsTrigger
                  key={c.name}
                  value={c.name}
                  className="relative cursor-pointer font-medium text-sm text-gray-700
    after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-600
    after:transition-all after:duration-300 after:ease-in-out after:transform after:-translate-x-1/2
    hover:after:w-full data-[state=active]:after:w-full"
                >
                  {c.name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                </TabsTrigger>

              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          {/* {Object.entries(subcategories).map(([key, items]) => (
            <TabsContent key={key} value={key}>
              <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
                {items.map((item, i) => (
                  <CategoryCard key={i} item={item} />
                ))}
              </div>
            </TabsContent>
          ))} */}
          {allCategories.map((c) => (
            <TabsContent key={c.name} value={c.name}>
              <MyCarousel>

                {c.subCategories.map((sub, i) => (
                  <div className="space-x-2 mx-2">
                    <CategoryCard key={i} item={sub} />
                  </div>
                ))}

              </MyCarousel>

            </TabsContent>
          ))}

        </Tabs>
      </div>
    </div>
  );
}

// CategoryCard stays the same
export function CategoryCard({ item, className }:
  {
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
      <div className={`group relative flex-shrink-0 w-[90vw] md:w-fit mx-1 md:min-w-[280px]  rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 ${className}`}>
        <div className="relative aspect-video overflow-hidden">

          <Image
            src={item.img}
            alt={item.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={150}
            height={150}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.desc}</p>
          <div href={item.href} className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
            <span>View more</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}