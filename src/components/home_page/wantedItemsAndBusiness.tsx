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
import { AlertCircle } from "lucide-react";
import MyCarousel from "./clientComponents/myCarousel";
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
export default function WantedItemAndBusiness(
  {
    wantedItems,
    businessesForSale
  }:
    {
      wantedItems: any,
      businessesForSale: any
    }
) {
  const [selectedTab, setSelectedTab] = useState("business");
  //const { wantedItems, businessesForSale } = useHomeProductContext()
  const [openSellerDialog, setOpenSellerDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { user } = useHomeContext();
  const router = useRouter();
  const [callback,setCallback] = useState('/')

  //console.log(user,';.,,,,,,,,,,,,,');
   
  function handleClickBigButton(type:'myWantedItems'|'myBusinessesForSale') {
    setCallback(`/admin/${type}?state=add`);
    if (user) {
      if (user.role.toLocaleLowerCase() === 'seller' || user.role.toLocaleLowerCase() === 'admin') {
        setButtonLoading(true);
        router.push(`/admin/${type}?state=add`)
      } else {
        setOpenSellerDialog(true);
      }
    } else {
      setOpenDialog(true); 
    }
  }


  const getViewMoreLink = () => {
    return selectedTab === "wanted" ? "/wanted-items" : "/businesses-for-sale";
  };

  const getViewMoreText = () => {
    return selectedTab === "wanted"
      ? "View More Wanted Items →"
      : "View More Businesses for Sale →";
  };
  const getButtonSeller = () => {
    return (
      <div className="flex gap-2 mt-2">
        <BigButton onClick={()=>handleClickBigButton('myWantedItems')} text="ADD WANTED ITEM" disabled={buttonLoading} />
        <BigButton onClick={()=>handleClickBigButton('myBusinessesForSale')} text="SELL BUSINESS" disabled={buttonLoading} />
      
      </div>
    )
  }

  return (
    <div className="bg-white-50">
      <div className="container mx-auto mt-0 p-4">
        {/* Change defaultValue from "wanted" to "business" */}
        <Tabs defaultValue="business" className="w-full" onValueChange={setSelectedTab}>
          <div className="flex justify-between flex-wrap items-center mb-4">
            <TabsList className="grid grid-cols-2 gap-2">
              <TabsTrigger value="wanted"  className="flex gap-2 items-center">Wanted Items <span title="People want these items"><AlertCircle size={18} color="blue" className="rotate-180"/></span></TabsTrigger>
              <TabsTrigger value="business" className="flex gap-2 items-center">Businesses for Sale <span title="List your business for sale"><AlertCircle size={18} color="blue" className="rotate-180"/></span></TabsTrigger>
            </TabsList>

          </div>
          
          <Link
            href={getViewMoreLink()}
            className="text-blue-600 hover:underline text-sm ml-4"
          >
            {getViewMoreText()}
          </Link>
          {getButtonSeller()}
          <TabsContent value="wanted" className="mt-0">
            <MyCarousel>
              {wantedItems.map((item, index) => (
                <div key={index} className="flex-shrink-0 px-2">
                  
                  <WantedItem {...item} />
                </div>
              ))}
            </MyCarousel>

          </TabsContent>

          <TabsContent value="business" className="mt-0">

            <MyCarousel>
              {businessesForSale.map((business, index) => (
                <div key={index} className="flex-shrink-0 px-2">
                  <BusinessForSale {...business} />
                </div>
              ))}
            </MyCarousel>

          </TabsContent>
        </Tabs>
        {openSellerDialog && <SellerFormDialog callback={callback} open={openSellerDialog} setOpen={setOpenSellerDialog} />}
        {openDialog && <SellerFormDialog2 callback={callback} text="" open={openDialog} setOpen={setOpenDialog} />}
      </div>
    </div>
  );
}
