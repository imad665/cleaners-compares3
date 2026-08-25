"use client";

import { useMyBusinesses, BusinessType } from "@/hooks/useMyBusinesses";
import { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Table from '@/components/adminDashboard/shared/Table';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from "../ui/button";
import { BusinessFormDialog } from "../forms/busnisessForm";

const MyBusinesses = () => {
    const { myBusinesses: productsData, isLoading: loading, mutate } = useMyBusinesses();

    const [selectedProduct, setSelectedProduct] = useState<BusinessType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openWanted, setOpenWanted] = useState(false);
    const [addWanted, setAddWanted] = useState(false);
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter()

    useEffect(() => {
        const state = searchParams.get('state');
        if (state === 'add') {
            router.replace(pathName);
            setAddWanted(true)
        }
    }, [])

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
        // console.log('View product:', product);
        // Navigate to product detail view
    };

    const handleEdit = (product: BusinessType) => {
        const p = productsData.find((p) => p.id === product.id);
        // console.log('Edit product:', p);
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
            setIsDeleting(true);
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
                    mutate();
                } else {
                    const { error } = await res.json();
                    toast.error(error);
                }
            } catch (error) {
                toast.error('failed to delete product');
            } finally {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setSelectedProduct(null);
            }
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

                {loading ? <div className="flex justify-center mt-10">
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
                                Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={confirmDelete}
                                    loading={isDeleting}
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
                    mutate()
                    setAddWanted(false)
                }}
            />}

            {isEditing && <div className='w-full top-0 bg-black/10'>
                <div className='h-full overflow-auto mb-30 mt-0'>

                    <BusinessFormDialog
                        key={selectedProduct?.id}
                        id={selectedProduct?.id}
                        open={openWanted}
                        setOpen={(v) => {
                            setOpenWanted(v);
                            setIsEditing(v);
                            setSelectedProduct(null);
                        }}
                        onSubmitSuccess={() => {
                            setOpenWanted(false);
                            setIsEditing(false);
                            mutate()
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
            <div className='w-full h-30'> </div>
        </div>

    );
};

export default MyBusinesses;