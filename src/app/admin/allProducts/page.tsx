'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { AddNewProductForm } from '@/components/forms/addNewProductForm';
import { useAdminProducts, Product } from '@/hooks/useAdminProducts';
import { updateProductStatusAction } from '@/actions/addNewProductAction';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AllProducts = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get('paymentSuccess');
    const days = searchParams.get('days');

    // SWR Hook
    const { products, categories, isLoading: loading, mutate } = useAdminProducts();

    // State
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [keyStatusUpdate, setKeyStatusUpdate] = useState(Date.now().toString())

    // Edit/Delete modals
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);

    // Toast for payment success (from URL params)
    const [toastShown, setToastShown] = useState(false);
    useEffect(() => {
        if (!toastShown && paymentSuccess) {
            if (paymentSuccess === 'true') {
                toast.success(`✅ Payment successful! Featured for ${days} day(s).`);
            } else if (paymentSuccess === 'false') {
                toast.error('❌ Payment failed or was canceled.');
            }
            setToastShown(true);
            router.replace('/admin/allProducts'); // clean URL
        }
    }, [paymentSuccess, days, toastShown, router]);

    // Handle status change
    const handleStatusChange = async (productId: string, newStatus: string) => {
        setUpdatingStatusId(productId);
        try {
            const result = await updateProductStatusAction(productId, newStatus);
            setKeyStatusUpdate(newStatus)
            if (result.success) {
                mutate(); // Revalidate
                toast.success(result.message);
            } else {
                toast.error(result.message || 'Failed to update status');
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Something went wrong');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // Table columns (including Status)
    const columns = [
        {
            header: 'Product Name',
            accessor: (product: Product) => (
                <div className="space-y-1 max-w-60 overflow-hidden">
                    <p className="truncate" title={product.name}>{product.name}</p>
                    <div className="flex gap-2 flex-col">
                        {product.featured && (
                            <Badge variant="success" className="text-xs rounded-2xl">
                                Featured until {product.featuredEndDate}
                            </Badge>
                        )}
                        {product.isDealActive && (
                            <Badge variant="info" className="text-xs rounded-2xl">
                                Deal ends on {product.dealEndDate}
                            </Badge>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: 'Category',
            accessor: (product: Product) => (
                <div>
                    <div>{product.category}</div>
                    <div className="text-xs text-gray-500">{product.subcategory}</div>
                </div>
            ),
        },
        {
            header: 'Price',
            accessor: (product: Product) => (
                <div>
                    {product.discountPrice ? (
                        <div className="text-xs">
                            <span className="line-through mr-2">£{product.price}</span>
                            <span className="font-medium">£{product.discountPrice}</span>
                        </div>
                    ) : (
                        <span>£{product.price}</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Units',
            accessor: (product: Product) => {
                const variant = product.stock === 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success';
                return (
                    <div className="flex flex-col">
                        <Badge variant={variant}>{product.stock}</Badge>
                        <span className="text-xs text-muted-foreground">stock: {product.stockCount}</span>
                    </div>
                );
            },
        },
        // NEW STATUS COLUMN
        {
            header: 'Listing Status',
            accessor: (product: Product) => (
                <select
                    value={product.listingStatus}
                    onChange={(e) => handleStatusChange(product.id, e.target.value)}
                    disabled={updatingStatusId === product.id}
                    className="border rounded px-2 py-1 text-sm bg-white disabled:opacity-50 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="AVAILABLE">Available</option>
                    <option value="UNDER_OFFER">Under Offer</option>
                    <option value="SOLD">Sold</option>
                </select>
            ),
        },
        {
            header: 'Date Added',
            accessor: 'date',
        },
    ];

    // Handlers for edit/delete
    const handleEdit = (product: Product) => {
        const fullProduct = products.find(p => p.id === product.id);
        setSelectedProduct(fullProduct || null);
        setIsEditing(true);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
        setIsDeleting(false);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            const res = await fetch('/api/admin/allProducts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedProduct.id }),
            });
            if (res.ok) {
                const { message } = await res.json();
                toast.success(message);
                mutate();
                setShowDeleteModal(false);
                setSelectedProduct(null);
            } else {
                const { error } = await res.json();
                toast.error(error);
            }
        } catch {
            toast.error('Failed to delete product');
        } finally {
            setIsDeleting(false);
        }
    };

    const onSuccessEditing = () => {
        mutate();
        setSelectedProduct(null);
        setIsEditing(false);
    };
    //console.log(keyStatusUpdate, 'ccccccccccccccccccc');

    return (
        <div className="w-full relative">

            <div className="space-y-6"  >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all products listed on your marketplace.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            variant="primary"
                            icon={<Plus size={16} />}
                            loading={isAddingNew}
                            onClick={() => {
                                setIsAddingNew(true);
                                router.push('/admin/addNewProduct');
                            }}
                        >
                            Add New Product
                        </Button>
                    </div>
                </div>

                {/* Products Table */}
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    </div>
                ) : (
                    <Table

                        columns={columns}
                        data={products}
                        keyField="id"
                        searchable
                        filterable
                        pagination
                        itemsPerPage={7}
                        actions={(product: Product) => (
                            <div className="flex space-x-2 justify-end">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Edit Product"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(product); }}
                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Delete Product"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                        onRowClick={() => { }} // optional, can be left empty
                    />
                )}

                {/* Delete Confirmation Modal */}
                <AlertDialog open={showDeleteModal} onOpenChange={(open) => {
                    if (!isDeleting) {
                        setShowDeleteModal(open);
                    }
                }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete{" "}
                                <span className="font-medium text-foreground">
                                    "{selectedProduct?.name}"
                                </span>{" "}
                                and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='cursor-pointer' disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <Button
                                onClick={confirmDelete}
                                variant='danger'
                                className='cursor-pointer'
                                loading={isDeleting}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Edit Product Panel */}
            {isEditing && selectedProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 overflow-auto">
                    <div className="bg-white min-h-screen w-full max-w-4xl mx-auto my-8 rounded-lg shadow-xl">
                        <div className="sticky top-0 bg-gray-700 text-white px-6 py-3 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-xl font-bold">Edit Product</h2>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-600 rounded">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <AddNewProductForm
                                onSuccessEditing={onSuccessEditing}
                                onFailedEditing={() => setIsEditing(false)}
                                name={selectedProduct.name}
                                productId={selectedProduct.id}
                                isIncVAT={selectedProduct.isIncVAT}
                                machineDeliveryCharge={selectedProduct.delivery_charge}
                                description={selectedProduct.description}
                                discount={selectedProduct.discountPercentage}
                                discountEnd={selectedProduct.dealEndDate}
                                imagesUrl={selectedProduct.imagesUrl}
                                subCategoryId={selectedProduct.subCategoryId}
                                price={selectedProduct.price}
                                status={selectedProduct.status}
                                categories={categories}
                                productionCondition={selectedProduct.condition}
                                stockQuantity={selectedProduct.stock}
                                mainCategory={selectedProduct.category}
                                subCategory={selectedProduct.subcategory}
                                featureDays={selectedProduct.featureDays}
                                weight={selectedProduct.weight}
                                videoUrl={selectedProduct.videoUrl}
                                stock={selectedProduct.stockCount}
                                isFeatured={selectedProduct.featured}
                                dealeEnd={selectedProduct.dealEndDateFormate}
                                customerCollects={selectedProduct.customerCollects}
                                freeLocalDelivery={selectedProduct.freeLocalDelivery}
                                vatType={selectedProduct.vatType}
                                isEditing={true}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className='w-full h-32'> </div>
        </div>
    );
};

export default AllProducts;