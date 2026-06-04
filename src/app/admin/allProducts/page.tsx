'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { AddNewProductForm } from '@/components/forms/addNewProductForm';
import { updateProductStatusAction } from '@/actions/addNewProductAction';

// Product type definition
interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    price: string;
    status: string;
    featured: boolean;
    date: string;
    stock: number;
    dealEndDate: string;
    featuredEndDate: string;
    subCategoryId: string;
    isDealActive: boolean;
    discountPrice: number | false;
    stockCount: number;
    listingStatus: string; // AVAILABLE | Under Offer | SOLD
    // additional fields used in edit form
    description?: string;
    discountPercentage?: number;
    imagesUrl?: string[];
    condition?: string;
    weight?: string;
    videoUrl?: string;
    isIncVAT?: boolean;
    delivery_charge?: number;
    featureDays?: number;
    dealEndDateFormate?: string;
}

const AllProducts = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get('paymentSuccess');
    const days = searchParams.get('days');

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [keyStatusUpdate, setKeyStatusUpdate] = useState(Date.now().toString())

    // Edit/Delete modals
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/myProducts');
                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error);
                    return;
                }
                const { products, categories } = await res.json();
                setProducts(products);
                setCategories(categories);
            } catch (error) {
                console.error('Failed to fetch products', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [refresh]);

    // Handle status change
    const handleStatusChange = async (productId: string, newStatus: string) => {
        setUpdatingStatusId(productId);
        try {
            const result = await updateProductStatusAction(productId, newStatus);
            setKeyStatusUpdate(newStatus)
            if (result.success) {
                // Optimistic update
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.id === productId
                            ? { ...p, listingStatus: newStatus } // Update only the matching product
                            : p // Leave others as they are
                    )
                );
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
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            const res = await fetch('/api/admin/allProducts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedProduct.id }),
            });
            if (res.ok) {
                const { message } = await res.json();
                toast.success(message);
                setRefresh(prev => !prev);
            } else {
                const { error } = await res.json();
                toast.error(error);
            }
        } catch {
            toast.error('Failed to delete product');
        } finally {
            setShowDeleteModal(false);
            setSelectedProduct(null);
        }
    };

    const onSuccessEditing = () => {
        setRefresh(prev => !prev);
        setSelectedProduct(null);
        setIsEditing(false);
    };
    console.log(keyStatusUpdate, 'ccccccccccccccccccc');

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
                            onClick={() => router.push('/admin/addNewProduct')}
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
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
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
                                isEditing={true}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className='w-[100vw] h-30'> </div>
        </div>
    );
};

export default AllProducts;