'use client'
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { toast } from 'sonner';
import { useWantedItems, WantedItem } from '@/hooks/useWantedItems';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddWantedItemDialog from '@/components/forms/wantedItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AllProducts = () => {
    const { wantedItems: productsData, isLoading: loading, mutate } = useWantedItems();
    const [selectedProduct, setSelectedProduct] = useState<WantedItem | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openWanted, setOpenWanted] = useState(false);
    const [addWanted, setAddWanted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const state = searchParams.get('state');
        if (state === 'add') {
            router.replace(pathname)
            setAddWanted(true);
        }
    }, [])


    // Table columns configuration
    const columns = [
        {
            header: 'Title',
            accessor: (product: WantedItem) => (
                <p title={product.title} className='max-w-40 overflow-ellipsis overflow-hidden'>{product.title}</p>
            ),
        },
        {
            header: 'Location',
            accessor: 'location'
        },
        {
            header: 'Description',
            accessor: (product: WantedItem) => (
                <p title={product.description} className='max-w-60 overflow-ellipsis overflow-hidden'>{product.description}</p>
            ),
        },
        {
            header: 'Created At',
            accessor: 'datePosted'
        },

        {
            header: 'Contact Info',
            accessor: (product: WantedItem) => (
                <div>{product.email} <br /> {product.phone}</div>
            ),
        },
        {
            header: 'ImageUrl',
            accessor: (product: WantedItem) => (
                <a href={product.imageUrl} title={product.imageUrl} className='max-w-60 overflow-ellipsis overflow-hidden'>View</a>
            ),
        },
    ];

    // Handle action buttons
    const handleView = (product: WantedItem) => {
        //console.log('View product:', product);
        // Navigate to product detail view
    };

    const handleEdit = (product: WantedItem) => {
        const p = productsData.find((p) => p.id === product.id);
        //console.log('Edit product:', p);
        setSelectedProduct(p);
        setIsEditing(true);
        // Navigate to edit product form
    };



    const handleDelete = (product: WantedItem) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
        setIsDeleting(false);
    };
    //console.log(selectedProduct,'????????????');

    const confirmDelete = async () => {
        if (selectedProduct) {
            console.log('Deleting product:', selectedProduct);
            setIsDeleting(true);
            // Perform delete action
            try {
                const res = await fetch('/api/admin/myWantedItems', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: selectedProduct.id })
                })
                if (res.ok) {
                    const { message } = await res.json();
                    toast.success(message);
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                    mutate();
                } else {
                    const { error } = await res.json();
                    toast.error(error);
                }
            } catch (error) {
                toast.error('failed to delete product');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleFeature = (product: WantedItem) => {
        console.log('Toggle feature for product:', product);
        // Update featured status
    };

    return (
        <div className='w-full relative'>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Wanted Items</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage Your all wanted Items listed on your marketplace.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            variant="primary"
                            icon={<Plus size={16} />}
                            onClick={() => {
                                setAddWanted(true);
                            }}
                        >
                            Add New Wanted Item
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

                        actions={(product: WantedItem) => (
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

                            </div>
                        )}
                        onRowClick={handleView}
                    />
                }



                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <AlertDialog open={showDeleteModal} onOpenChange={(open) => {
                        if (!isDeleting) {
                            setShowDeleteModal(open);
                        }
                    }}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedProduct?.title}"</span>? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <Button
                                    onClick={confirmDelete}
                                    variant='danger'
                                    loading={isDeleting}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            {addWanted && <AddWantedItemDialog
                open={addWanted}
                setOpen={setAddWanted}
                onSubmitSuccess={() => {
                    mutate()
                    setAddWanted(false);
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

                    <AddWantedItemDialog
                        key={selectedProduct?.id}
                        open={openWanted}
                        setOpen={(v) => {
                            setOpenWanted(v);
                            setSelectedProduct(null);
                            setIsEditing(v);
                        }}
                        onSubmitSuccess={() => {
                            setOpenWanted(false);
                            mutate()
                        }}
                        id={selectedProduct?.id}
                        description0={selectedProduct?.description}
                        email0={selectedProduct?.email}
                        phone0={selectedProduct?.phone}
                        imageUrl={selectedProduct?.imageUrl}
                        location0={selectedProduct?.location}
                        title0={selectedProduct?.title}
                        fullName0={selectedProduct?.fullName}
                    />

                </div>
            </div>}
            <div className='w-full h-32'> </div>
        </div>

    );
};

export default AllProducts;