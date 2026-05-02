'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WantedItem from "./serverComponents/wantedItem";
import BusinessForSale from "./serverComponents/businessForSale";
import Link from "next/link";
/* import { useHomeProductContext } from "@/providers/homeProductsProvider"; */

import { useState } from "react";
import { BigButton } from "./mainImage2";
import SellerFormDialog from "../forms/sellerForm";
import SellerFormDialog2 from "../forms/sellerForm2";
import { useHomeContext } from "@/providers/homePageProvider";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Building2, Search, Store } from "lucide-react";
import MyCarousel from "./clientComponents/myCarousel";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonNeedSignIn } from "../header/productSearchBar";
/* const wantedItems = [
  {
    title: "Used Dry Cleaning Machine",
    description: "Looking to purchase a second-hand dry cleaning machine in good working condition. Prefer models with low maintenance history.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUAF5CppiP8c_efPIRM1dTpB23grbjz-x0kg&s",
    datePosted: "May 6, 2025",
    location: "London, UK",
    contactInfo: "Email: enquiries@cleanukservices.co.uk | Phone: 020 7946 0112",
  },
  {
    title: "Commercial Laundry Press",
    description: "In need of a used commercial-grade laundry press for a busy laundrette. Must be suitable for high-volume daily use.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI-iQt3eMrNgMIGVvesFC9rQWd_EwDDm-wQ&s",
    datePosted: "May 5, 2025",
    location: "Manchester, UK",
    contactInfo: "Email: purchase@laundryequipmentbuyers.co.uk",
  },
  {
    title: "Stacked Washer Dryer Units",
    description: "Seeking two to three stacked washer-dryer machines for a self-service laundry startup. Brands like Electrolux or Speed Queen preferred.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN37HcH8vIRJKCCMXv4y-uMzZVnHDfZcR_1w&s",
    datePosted: "May 4, 2025",
    location: "Birmingham, UK",
    contactInfo: "Email: contact@startlaundry.co.uk | Phone: 0121 445 3340",
  },
  {
    title: "Steam Boiler for Laundry",
    description: "Looking to buy a compact steam boiler suitable for small to medium-sized dry cleaning operations. Must be CE certified.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtTt9pYVZQDKs-JiKJUP8oYbsZgWdAVc4Rsg&s",
    datePosted: "May 3, 2025",
    location: "Leeds, UK",
    contactInfo: "Email: steamgear@outlook.com",
  },
]; */


/* const businessesForSaleUK = [
  {
    title: "Dry Cleaning Shop - Central London",
    location: "London, UK",
    value: "£95,000 GBP",
    reason: "Health Issues",
    description: "Established dry cleaners in a busy high street location. Fully equipped with regular clientele.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ShKDzwGpZ4zPOrYjT7K4r_MoVqzW9P5XWg&s",
    contactInfo: "Email: londoncleaners@example.co.uk | Phone: 020 7946 1234",
  },
  {
    title: "Laundry Pickup & Delivery Business",
    location: "Manchester, UK",
    value: "£60,000 GBP",
    reason: "Owner Moving Overseas",
    description: "Profitable mobile laundry business with branded van and regular subscription clients.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmN28-xuJ_RqUHO7ICu9bBdnqRp0Q2U0X42A&s",
    contactInfo: "Email: manchesterclean@example.co.uk",
  },
  {
    title: "Eco-Friendly Launderette for Sale",
    location: "Bristol, UK",
    value: "£75,000 GBP",
    reason: "Partner Dispute",
    description: "Modern launderette with energy-efficient machines and strong walk-in customer base.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8G7HFnMuWTIh0nD_rqaYmjAmvdosnBOJ9lw&s",
    contactInfo: "Email: eco-wash@example.co.uk | Phone: 0117 456 7890",
  },
  {
    title: "Self-Service Laundrette - Leasehold",
    location: "Leeds, UK",
    value: "£50,000 GBP",
    reason: "Focusing on Other Ventures",
    description: "Long-established coin-operated laundrette in residential area. Low overheads and steady income.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJhtTei3I6WSMJ9n1dhALbLImBDKgDUI3bmw&s",
    contactInfo: "Email: leedslaundry@example.co.uk",
  },
  {
    title: "Commercial Laundry & Linen Service",
    location: "Birmingham, UK",
    value: "£130,000 GBP",
    reason: "Retirement",
    description: "Well-run commercial laundry servicing hotels and restaurants. Includes delivery van and contracts.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIbFusOV_9n0kMaEjMMZmIOqugWCoYphn2A&s",
    contactInfo: "Email: bhamlinen@example.co.uk | Phone: 0121 567 3456",
  },
]; */
export default function WantedItemAndBusiness({ wantedItems, businessesForSale }: any) {
  const [selectedTab, setSelectedTab] = useState("business");
  const { user } = useHomeContext();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [callback, setCallback] = useState('/');
  console.log(wantedItems, 'ssssssssssssssssssjdjdjdkkvvf');

  // Modal States
  const [openSellerDialog, setOpenSellerDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  function handleClickBigButton(type: 'myWantedItems' | 'myBusinessesForSale') {
    setCallback(`/admin/${type}?state=add`);
    if (user) {
      if (user.role.toLowerCase() === 'seller' || user.role.toLowerCase() === 'admin') {
        setButtonLoading(true);
        router.push(`/admin/${type}?state=add`);
      } else {
        setOpenSellerDialog(true);
      }
    } else {
      setOpenDialog(true);
    }
  }

  return (
    <div className="bg-white py-12    ">
      <div className="container mx-auto px-4">

        {/* Header with Integrated Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Community <span className="text-blue-600">Marketplace</span>
            </h2>
            <p className="text-slate-500 text-sm">Buy or sell a laundry business, or post wanted items.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleClickBigButton('myWantedItems')}
              variant="outline"
              disabled={buttonLoading}
              className="h-10 rounded-full border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-50 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 mr-2" /> POST WANTED ITEM
            </Button>
            <Button
              onClick={() => handleClickBigButton('myBusinessesForSale')}
              disabled={buttonLoading}
              className="h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 mr-2" /> SELL A BUSINESS
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="business"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-3 text-sm font-bold text-slate-500 data-[state=active]:text-slate-900"
              >
                Businesses for Sale
              </TabsTrigger>
              <TabsTrigger
                value="wanted"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-3 text-sm font-bold text-slate-500 data-[state=active]:text-slate-900"
              >
                Wanted Items
              </TabsTrigger>
            </TabsList>

            <Link
              href={selectedTab === "wanted" ? "/wanted-items" : "/businesses-for-sale"}
              className="hidden sm:flex items-center text-blue-600 font-bold text-xs hover:gap-2 transition-all"
            >
              VIEW ALL <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent key={selectedTab} value={selectedTab} className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex gap-2 max-[1050px]:flex-col">
                  <MyCarousel
                    className="w-[80%] -[1050px]:w-full"
                    sliderToShow={4} breackpoints={[
                      { breakpoint: 1280, slidesToShow: 3 },
                      { breakpoint: 1023, slidesToShow: 2 },
                      { breakpoint: 518, slidesToShow: 1 },
                    ]}>
                    {selectedTab === "wanted"
                      ? wantedItems.map((item: any, i: number) => (
                        <div key={i} className="px-2">
                          <WantedItem {...item} />
                        </div>
                      ))
                      : businessesForSale.map((business: any, i: number) => (
                        <BusinessForSale {...business} />
                      ))
                    }
                  </MyCarousel>
                  <article className="rounded-xl border bg-buyer-soft p-5 flex flex-col items-center justify-center text-center">
                    <Store className="h-10 w-10 text-primary mb-3" />
                    <p className="text-sm font-semibold">List your business or equipment and connect with serious buyers.</p>
                    <Button
                      onClick={() => handleClickBigButton('myBusinessesForSale')}
                      disabled={buttonLoading}
                      variant={'link'}
                      className="h-10 rounded-full  cursor-pointer "
                    >
                      <Building2 className="w-3.5 h-3.5 mr-2" /> Sell Your Business →
                    </Button>

                    <p className="mt-2 text-xs text-muted-foreground">
                      List your laundry business for sale or connect with serious buyers.
                    </p>
                  </article>
                </div>

              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* --- DIALOGS KEPT AS REQUESTED --- */}
        {openSellerDialog && (
          <SellerFormDialog
            callback={callback}
            open={openSellerDialog}
            setOpen={setOpenSellerDialog}
          />
        )}
        {openDialog && (
          <SellerFormDialog2
            callback={callback}
            text=""
            open={openDialog}
            setOpen={setOpenDialog}
          />
        )}
      </div>
    </div>
  );
}
