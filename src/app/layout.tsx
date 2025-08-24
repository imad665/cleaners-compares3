import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/lib/prisma";
import { HomeProvider } from "@/providers/homePageProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HomeProductsProvider } from "@/providers/homeProductsProvider";
import { generateSlug } from "@/lib/products/slugGen";
import SeedData from "@/lib/data-old-website/seed";
import SeedDataVideo from "@/lib/data-old-website/seedVideos";
import { deleteAllCloudinaryImages } from "@/lib/cloudStorage";
import { seedMachinesProducts, seedPartsProducts, seedSundriesProducts, seedUsers } from "@/lib/data-old-website/add-users";
import { hash, hashSync } from "bcryptjs";

import ChatPage from "@/components/chatbot/main";
 
import { getRecentOrdersCount } from "@/lib/products/homeProducts";
import { clearOrders, updatePasswordUsers } from "@/lib/clearTestData";
import { Button } from "@/components/ui/button";
import { sendTestMessage } from "@/lib/payement/sendTestMessage";
import { categories } from "@/components/video_ui/data/videos";
import { embedProductsToNeon } from "@/lib/langchain/embeding/embed-products";
import PWAInstallButton from "@/components/PWAInstallButton";
import { embedEngineersToNeon } from "@/lib/langchain/embeding/embed_enginner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Cleaners Compare | Laundry & Dry Cleaning Equipment Comparison",
  description:
    "Compare thousands of new and used machines, tools, and services for the laundry and dry cleaning industry. Find deals on laundry machines, dry cleaning systems, and finishing equipment.",
  keywords: [
    "Laundry equipment",
    "Dry cleaning machines",
    "Laundry machine comparison",
    "Used dry cleaning machines",
    "Commercial laundry equipment",
    "Finishing machines",
    "Wet cleaning systems",
    "Laundry industry marketplace",
    "Compare laundry machines",
    "Cleaners Compare"
  ],
  openGraph: {
    title: "Cleaners Compare | Laundry & Dry Cleaning Equipment Comparison",
    description:
      "The world’s first laundry and dry cleaning comparison platform. Discover top brands and high-quality products tailored for professional cleaners.",
    url: "https://cleanerscompare.com",
    siteName: "Cleaners Compare",
    images: [
      {
        url: "/uploads/logo.png", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Cleaners Compare - Laundry & Dry Cleaning Comparison",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaners Compare | Laundry & Dry Cleaning Equipment Comparison",
    description:
      "Compare and shop commercial laundry and dry cleaning equipment. Find used machines, new deals, and trusted brands.",
    images: ["/uploads/logo.png"], // Replace with your actual OG image
  },
  metadataBase: new URL("https://cleanerscompare.com"),
  manifest:'/manifest.json',
};

async function removeDuplicateProducts() {
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }, // oldest first, so we keep the first one
    select: {
      id: true,
      title: true,
      price: true,
    },
  });

  const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, ''); // Normalize title by removing extra spaces and casing

  const seen = new Set<string>();
  const duplicateIds: string[] = [];

  for (const product of allProducts) {
    const key = `${normalize(product.title)}-${product.price}`;

    if (seen.has(key)) {
      duplicateIds.push(product.id); // mark as duplicate
    } else {
      seen.add(key); // first time we see this key, keep it
    }
  }

  if (duplicateIds.length === 0) {
    console.log('✅ No duplicate products found.');
    return;
  }

  const deleted = await prisma.product.deleteMany({
    where: {
      id: { in: duplicateIds },
    },
  });

  console.log(`🗑️ Deleted ${deleted.count} duplicate product(s).`);
}


 

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //await prisma.product.deleteMany()
  //await deleteAllCloudinaryImages()  
  //await seedUsers()
  /* await prisma.product.updateMany({
    data:{
      createdAt:new Date('2025-07-17')
    }
  }) */

  //await seedSundriesProducts()
  //await seedMachinesProducts();
  //await seedPartsProducts();
  //await removeDuplicateProducts() 
  //await SeedDataVideo()

  /* await prisma.user.create({
    data:{
      name:'amer',
      email:'med.hasnaoui92@gmail.com',
      password:'$2a$11$QwilCAsDI7tj0FwMW9kFyer2WWTA48ET5UGgWyeYZsNE7k3vEYYye',
      role:'BUYER',
      
    }
  }) */
  /* await prisma.user.update({
    where:{
      email:'med.hasnaoui92@gmail.com'
    },
    data: {
      role: 'SELLER',

    }
  }) */
  /* removeDuplicateProducts()
    .catch((err) => console.error('❌ Error:', err))
    .finally(() => prisma.$disconnect()); */

  /* await prisma.user.update({
    where:{
      email:'admin@cleancompare.com',
    },
    data:{
      isSigninSuccess:true
    }
  }) */

  const session = await getServerSession(authOptions);
  
   
  //console.log(cats,'mmmmmmmmmmmmmmm');
  
  
  //await prisma.category.delete({where:{id:'cmd8zu8qa00fhwnj4valms5fx'}});
  /* const users = await prisma.user.update({
    where:{email:'admin@cleancompare.com'},
    data:{
      password:hashSync('123456789'),
      role:'ADMIN',
      status:'ACTIVE',
    }
  }); */
  //hashSync('123456789')
  //console.log(users,'iiiiiiiiiiiiiiiiiiiiii')
  //if(!session) redirect('/auth/login')
  //console.log(session, '\\\\\\\\\\\\\\\\cm9lihb1e0000wne0uruq18u4');
  /*  const hashedPassword = await hash('123456789', 10);
  await prisma.user.create({
    data:{
      password:hashedPassword,
      email:'admin@cleancompare.com',
      role:"ADMIN",
      name:'amir'
    }
  })  */
   //
  //await embedMessagesToSupabase() 
  //await embedEngineersToSupabase() 
  //const sellers = await prisma.sellerProfile.findMany();
  //console.log(sellers,';;;;;;;;;;;;;;;;llllllllllll');
  //await embedProductsToNeon();
  //await embedEngineersToNeon()
  //await updatePasswordUsers();
  //await clearOrders();
   
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} relative ${geistMono.variable} antialiased`}
      >
        {/* <HomeProductsProvider> */}
        <HomeProvider user={session?.user}>
          {children}
          <ChatPage className='fixed bottom-2 right-2'/>
          {/* <InitData/> */}

        </HomeProvider>

        {/* <Button onClick={async ()=>{
            await sendTestMessage('programmingi77i@gmail.com')
          }}>Send Test Message</Button> */}
        {/* </HomeProductsProvider> */}
        <Toaster />
        <PWAInstallButton />
      </body>
    </html>
  );
}
