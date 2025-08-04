'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';



interface HomeContextType {
  featureProducts: any
  dealsProducts: any
  partsAndAccessoirsProducts: any,
  allCategories: any,
  wantedItems:any,
  businessesForSale:any,
  youtubeVideos:any,
  footerData:any
}

const HomeProductContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProductsProvider = ({ children }: HomeProviderProps) => {

  const [value, setValue] = useState<any>({
    featuredProducts: [],
    dealsProducts: [],
    partsAndAccessoirsProducts: [],
    allCategories: [],
    businessesForSale:[],
    wantedItems:[],
    youtubeVideos:[],
    footerData:[],
  });
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await fetch('/api/homeProducts');
        if (!res.ok) {
          toast.error('failed to fetch products');
          return;
        };
        const {
          featuredProducts,
          dealsProducts,
          partsAndAccessoirsProducts,
          allCategories,
          wantedItems,
          businessesForSale,
          youtubeVideos,
          footerData
        } = await res.json();
        //console.log('////////////////////////////////');

        //console.log(
          //featuredProducts,
          //dealsProducts,
          //youtubeVideos,
          //allCategories
        //);
        setValue({
          featuredProducts: featuredProducts.editProducts,
          dealsProducts: dealsProducts.editProducts,
          partsAndAccessoirsProducts: partsAndAccessoirsProducts.editProducts,
          wantedItems:wantedItems.editedWantedItem,
          businessesForSale:businessesForSale.editedBusinessForSale,
          allCategories,
          youtubeVideos:youtubeVideos.videos,
          footerData
        })
      } catch (error) {

      } finally {

      }
    }
    fetchHomeProducts();
  }, [])


  return <HomeProductContext.Provider value={value}>{children}</HomeProductContext.Provider>;
};

export const useHomeProductContext = (): HomeContextType => {
  const context = useContext(HomeProductContext);
  if (!context) {
    throw new Error('useHomeProductContext must be used within a HomeProductsProvider');
  }
  return context;
};
