"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash } from "lucide-react";  // Added icons for edit and delete
import AddWantedItemDialog from '@/components/forms/wantedItem';
import { Header } from '@/components/header/header';
import { HeaderServer } from '@/components/header/serverHeader';
import WantedItem from '../home_page/serverComponents/wantedItem';
import { toast } from 'sonner';

// Mock data for wanted items (replace with your actual data fetching)
const mockWantedItems = [
  {
    id: '1',
    title: 'Used Dry Cleaning Machine',
    location: 'New York, NY',
    description: 'Looking for a used dry cleaning machine in good condition. Must be able to handle at least 50 lbs of garments.',
    datePosted: '2024-07-28',
    category: 'Machines',
    contactInfo: 'contactInfo',
    imageUrl: '/test/ai_home.jpeg'
  },
  {
    id: '2',
    title: 'Commercial Laundry Detergent',
    location: 'Los Angeles, CA',
    description: 'Need a bulk supply of high-efficiency laundry detergent for commercial use. Eco-friendly preferred.',
    datePosted: '2024-07-25',
    category: 'Sundries',
    contactInfo: 'contactInfo',
    imageUrl: '/test/ai_home.jpeg'
  },
  {
    id: '3',
    title: 'Used Pressing Machine',
    location: 'Chicago, IL',
    description: 'Seeking a used pressing machine for shirts and pants. Must be in working order.',
    datePosted: '2024-07-20',
    category: 'Machines',
    contactInfo: 'contactInfo',
    imageUrl: '/test/ai_home.jpeg'
  },
  {
    id: '4',
    title: 'Laundry Conveyor System',
    location: 'Houston, TX',
    description: 'Looking for a conveyor system for my laundry facility. Need a system that can handle high volume.',
    datePosted: '2024-07-18',
    category: 'Machines',
    contactInfo: 'contactInfo',
    imageUrl: '/test/ai_home.jpeg'
  },
  {
    id: '5',
    title: 'Used Industrial Washer',
    location: 'Phoenix, AZ',
    description: 'Looking for a used industrial washer with a capacity of 75lbs or more.',
    datePosted: '2024-07-15',
    contactInfo: 'contactInfo',
    imageUrl: '/test/ai_home.jpeg'
  },
];

const WantedItemsPage = () => {
  const [wantedItems, setWantedItems] = useState<any[]>([]); // Replace 'any' with your actual type
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [refresh, setRefresh] = useState(false);
  // Simulate fetching data (replace with your actual API call)
  useEffect(() => {
    setLoading(false)
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/myWantedItem');
        if (!res.ok) {
          toast.error('failed to fetch your wanted Items.')
          return;
        }
        const { wantedItems } = await res.json();
        setWantedItems(wantedItems);
      } catch (error) {
      } finally {
        setLoading(false);
      }


    };

    fetchData();
  }, [refresh]);

  // Handle delete item
  const handleDelete = (id: string) => {
    setWantedItems(wantedItems.filter(item => item.id !== id));
  };

  // Handle edit item (you could open a dialog to edit the item here)
  const handleEdit = (item: any) => {
    console.log('Editing item:', item);
    // Here, you would likely open a dialog to edit the item or navigate to a different page
  };

  // Handle open the "Add Wanted Item" dialog
  const handleAddItemClick = () => {
    setIsDialogOpen(true);
  };

  // Handle close the dialog after adding a new item (this would need to be passed to your AddWantedItemDialog)
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className='w-full'>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 w-full">

        {!isDialogOpen && <div className="flex sticky z-200 bg-white top-[-15px] p-3 border-b w-full flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Wanted Items</h1>

          {/* Button to add new wanted item */}
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 cursor-pointer"
            onClick={handleAddItemClick}

          >
            <PlusCircle className="w-4 h-4" />
            Add New Item
          </Button>
        </div>}
        <AddWantedItemDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          onSubmitSuccess={() => setRefresh(v => !v)} />
        {loading ? (
          <p className="text-gray-500">Loading wanted items...</p>
        ) : wantedItems.length === 0 ? (
          <p className="text-gray-500">No wanted items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 [@media(min-width:1213px)]:grid-cols-3 gap-6">
            {wantedItems.map((item, index) => (
              <WantedItem
                title={item.title}
                contactInfo={item.contactInfo}
                datePosted={item.datePosted}
                description={item.description}
                imageUrl={item.imageUrl}
                location={item.location}
                key={`item_${index}`}
              />
            ))}
          </div>
        )}

        {/* The dialog to add a new wanted item */}
        {isDialogOpen && (
          <AddWantedItemDialog onClose={handleCloseDialog} />
        )}
      </div>
    </div>

  );
};

export default WantedItemsPage;
