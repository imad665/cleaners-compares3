"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Phone, Plus } from "lucide-react";
import { BusinessFormDialog } from "../forms/busnisessForm";

// Example businesses (you could fetch these from a backend too)


const businessesForSale = [
    {
        id: '123456789',
        title: "Dry Cleaning Business - Downtown",
        location: "Miami, USA",
        value: "$90,000 USD",
        reason: "Relocating Abroad",
        description: "Growing laundry pickup and delivery business with high potential for expansion.",
        imageUrl: "/test/ai_home.jpeg",
        contactInfo: "Email: laundrysales@example.com",
        fullName: 'Mohamed Hasnaoui',
        email: 'mohamed@email.com',
        phone: '+212123456789',
        datePosted: '2025-4-2',
        turnoverRange: '250k - 500k',
        reasonForSelling: "Financial reasons",
    },
    {
        id: '1234567899',
        title: "Laundry Service Company",
        location: "Miami, USA",
        value: "$90,000 USD",
        reason: "Relocating Abroad",
        description: "Growing laundry pickup and delivery business with high potential for expansion.",
        imageUrl: "/test/ai_home.jpeg",
        contactInfo: "Email: laundrysales@example.com",
        fullName: 'Mohamed Hasnaoui',
        email: 'mohamed@email.com',
        phone: '+212123456789',
        datePosted: '2025-4-2',
        turnoverRange: "1m - 2m",
        reasonForSelling: "Relocation",
    },
];


import { useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';


import Table from '@/components/adminDashboard/shared/Table';

import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddWantedItemDialog from '@/components/forms/wantedItem';
import { Button } from "../ui/button";


// Define the product type

interface BusinessType {
    id: string
    description: string
    email: string
    phone: string
    imageUrl: string
    location: string
    title: string
    turnoverRange: string
    fullName: string
    businessType: string
    reasonForSelling: string
    datePosted: string
}

const MyBusinesses = () => {
    const [selectedProduct, setSelectedProduct] = useState<BusinessType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    //const [isDeleting, setIsDeleting] = useState(false);
    //const [isView, setIsView] = useState(false);
    const [productsData, setProductsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [openWanted, setOpenWanted] = useState(false);
    const [addWanted, setAddWanted] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter()

    useEffect(()=>{
        const state = searchParams.get('state');
        if(state === 'add'){
            router.replace(pathName);
            setAddWanted(true)
        }
    },[])

    //const router = useRouter();
    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/admin/myBusinesses');
                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error);
                    return;
                }
                //setCategories(businessesForSale);
                const { myBusinesses } = await res.json();
                console.log(myBusinesses[0]);

                setProductsData(myBusinesses);
            } catch (error) {
                console.error('failes to fetch all product ', error);
                toast.error('failed to fetched all products');
            } finally {
               setLoading(false)
            }

        }
        fetchProducts();
    }, [refresh])

    // Table columns configuration
    const columns = [
        {
            header: 'Title',
            accessor: (product: BusinessType) => (
                <p title={product.title} className='max-w-40 overflow-ellipsis overflow-hidden'>{product.title}</p>
            ),
        },
        {
            header: 'Location',
            accessor: 'location'
        },
        {
            header: 'Description',
            accessor: (product: BusinessType) => (
                <p title={product.description} className='max-w-60 overflow-ellipsis overflow-hidden'>{product.description}</p>
            ),
        },
        {
            header: 'turnover Range',
            accessor: 'turnoverRange'
        },
        {
            header: 'Reason',
            accessor: 'reasonForSelling'
        },
        {
            header: 'Created At',
            accessor: 'datePosted'
        },

        {
            header: 'Contact Info',
            accessor: (product: BusinessType) => (
                <div>{product.email}<br />{product.phone}</div>
            ),
        },
        {
            header: 'Image',
            accessor: (product: BusinessType) => (
                <a href={product.imageUrl} title={product.imageUrl} className='max-w-60 overflow-ellipsis overflow-hidden'>View</a>
            ),
        },
    ];

    // Handle action buttons
    const handleView = (product: BusinessType) => {
        console.log('View product:', product);
        // Navigate to product detail view
    };

    const handleEdit = (product: BusinessType) => {
        const p = productsData.find((p) => p.id === product.id);
        console.log('Edit product:', p);
        setSelectedProduct(p);
        setIsEditing(true);
        // Navigate to edit product form
    };



    const handleDelete = (product: BusinessType) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedProduct) {
            console.log('Deleting product:', selectedProduct);
            // Perform delete action
            try {
                const res = await fetch('/api/admin/myBusinesses', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: selectedProduct.id })
                })
                if (res.ok) {
                    const { message } = await res.json();
                    toast.success(message);
                } else {
                    const { error } = await res.json();
                    toast.error(error);
                }
            } catch (error) {
                toast.error('failed to delete product');
            }

            setShowDeleteModal(false);
            setSelectedProduct(null);
            setRefresh(v => !v);
        }
    };

    const handleFeature = (product: BusinessType) => {
        console.log('Toggle feature for product:', product);
        // Update featured status
    };

    return (
        <div className='w-full relative'>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Listed Businesses</h1>

                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            className="bg-blue-600 hover:bg-blue-500"
                            onClick={() => {
                                setAddWanted(true);
                            }}
                        >
                            <Plus size={16} />
                            Add Business Listing
                        </Button>
                    </div>
                </div>

               {loading ?<div className="flex justify-center mt-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div> :
               
               <Table
               columns={columns}
               data={productsData}
               keyField="id"
               searchable={true}
               filterable={true}
               pagination={true}
               itemsPerPage={7}
               actions={(product: BusinessType) => (
                   <div className="flex space-x-2 justify-end">

                       <button
                           onClick={(e) => {
                               e.stopPropagation();
                               handleEdit(product);
                               setOpenWanted(true)
                           }}
                           className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                           title="Edit Product"
                       >
                           <Edit2 size={18} />
                       </button>
                       <button
                           onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(product);
                           }}
                           className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                           title="Delete Product"
                       >
                           <Trash2 size={18} />
                       </button>
                       {/* <button
                           onClick={(e) => {
                               e.stopPropagation();
                               handleFeature(product);
                           }}
                           className={`p-1 transition-colors ${product.featured ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
                           title={product.featured ? "Remove from Featured" : "Add to Featured"}
                       >
                           <Star size={18} className={product.featured ? "fill-yellow-500" : ""} />
                       </button> */}
                   </div>
               )}
               onRowClick={handleView}
           />}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {addWanted && <BusinessFormDialog
                open={addWanted}
                setOpen={setAddWanted}

                onSubmitSuccess={() => {
                    setRefresh(v => !v)
                    setAddWanted(false)
                }}
            />}

            {isEditing && <div className='w-full top-0 bg-black/10'>
                {/* <div className='px-6 sticky z-1000 top-0 w-full items-center flex justify-between bg-gray-700 text-white  p-2'>
                    <h2 className='font-bold  text-xl'>Edit Product</h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className='p-2 cursor-pointer hover:bg-gray-500'>
                        <X size={24} />
                    </button>
                </div> */}
                <div className='h-full overflow-auto mb-30 mt-0'>

                    <BusinessFormDialog
                        key={selectedProduct?.id}
                        id={selectedProduct?.id}
                        open={openWanted}
                        setOpen={(v)=>{
                            setOpenWanted(v);
                            setIsEditing(v);
                            setSelectedProduct(null);
                        }}
                        onSubmitSuccess={() => {
                            setOpenWanted(false);
                            setIsEditing(false);
                            setRefresh(v => !v)
                        }}
                        description={selectedProduct?.description}
                        email={selectedProduct?.email}
                        phone={selectedProduct?.phone}
                        imageUrl={selectedProduct?.imageUrl}
                        location={selectedProduct?.location}
                        title={selectedProduct?.title}
                        turnoverRange0={selectedProduct?.turnoverRange}
                        fullName={selectedProduct?.fullName}
                        businessType={selectedProduct?.businessType}
                        reasonForSelling={selectedProduct?.reasonForSelling}
                    />

                </div>
            </div>}
            <div className='w-[100vw] h-30'> </div>
        </div>

    );
};

export default MyBusinesses;