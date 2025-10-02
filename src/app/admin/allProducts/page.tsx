'use client'
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Star, X } from 'lucide-react';
import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { AddNewProductForm } from '@/components/forms/addNewProductForm';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';


// Define the product type
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
    isDealActive:boolean;
    discountPrice:boolean;
    stockCount:number;
   
}

const AllProducts = () => {
    // Mock products data
    /* const initProductsData: Product[] = [
        {
            id: 1,
            name: 'Industrial Washing Machine 50kg',
            category: 'Machines',
            subcategory: 'Washing Machines',
            price: '$3,499',
            status: 'Active',
            featured: true,
            date: '2023-05-15',
            stock: 5
        },
        {
            id: 2,
            name: 'Dry Cleaning Solvent (20L)',
            category: 'Sundries',
            subcategory: 'Chemicals',
            price: '$89',
            status: 'Active',
            featured: false,
            date: '2023-05-12',
            stock: 28
        },
        {
            id: 3,
            name: 'Filter Assembly Kit',
            category: 'Parts',
            subcategory: 'Filters',
            price: '$129',
            status: 'Pending',
            featured: false,
            date: '2023-05-10',
            stock: 12
        },
        {
            id: 4,
            name: 'Commercial Dryer',
            category: 'Machines',
            subcategory: 'Dryers',
            price: '$2,199',
            status: 'Active',
            featured: true,
            date: '2023-05-08',
            stock: 3
        },
        {
            id: 5,
            name: 'Stain Remover (Bulk 5L)',
            category: 'Sundries',
            subcategory: 'Chemicals',
            price: '$45',
            status: 'Out of Stock',
            featured: false,
            date: '2023-05-05',
            stock: 0
        },
        {
            id: 6,
            name: 'Drive Belt - Universal',
            category: 'Parts',
            subcategory: 'Belts & Drives',
            price: '$22',
            status: 'Active',
            featured: false,
            date: '2023-05-03',
            stock: 45
        },
        {
            id: 7,
            name: 'Press Machine - Heavy Duty',
            category: 'Machines',
            subcategory: 'Pressing Equipment',
            price: '$1,899',
            status: 'Active',
            featured: false,
            date: '2023-04-28',
            stock: 2
        },
        {
            id: 8,
            name: 'Laundry Management Software (License)',
            category: 'Software',
            subcategory: 'Management Systems',
            price: '$499',
            status: 'Active',
            featured: true,
            date: '2023-04-25',
            stock: 10
        },
        {
            id: 9,
            name: 'Steam Iron - Professional',
            category: 'Machines',
            subcategory: 'Ironing Equipment',
            price: '$149',
            status: 'Active',
            featured: false,
            date: '2023-04-20',
            stock: 8
        },
        {
            id: 10,
            name: 'Spot Cleaning Gun',
            category: 'Sundries',
            subcategory: 'Cleaning Tools',
            price: '$75',
            status: 'Low Stock',
            featured: false,
            date: '2023-04-18',
            stock: 3
        },
    ]; */
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get('paymentSuccess');
    const days = searchParams.get('days');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    //const [isDeleting, setIsDeleting] = useState(false);
    //const [isView, setIsView] = useState(false);
    const [productsData, setProductsData] = useState<any[]>([]);
    const [categories, setCategories] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [toastShown, setToastShown] = useState(false); // prevents duplicate toast
    useEffect(() => {
        if (!toastShown && paymentSuccess) {
            if (paymentSuccess === 'true') {
                toast.success(`✅ Payment successful! Featured for ${days} day(s).`);
            } else if (paymentSuccess === 'false') {
                toast.error('❌ Payment failed or was canceled.');
            }

            setToastShown(true); // prevent toast on rerender

            // OPTIONAL: remove params from URL after showing toast
            const newUrl = window.location.pathname;
            router.replace(newUrl);
        }
    }, [paymentSuccess, days, toastShown, router]);
    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/admin/myProducts');
                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error);
                    return;
                }
                const { products, categories } = await res.json();
                setCategories(categories);
                setProductsData(products);
                //console.log(products, '8888888888888');
            } catch (error) {
                console.error('failes to fetch all product ', error);
                toast.error('failed to fetched all products');
            } finally {
                setLoading(false);
            }

        }
        fetchProducts();
    }, [refresh])


    // Table columns configuration
    const columns = [
        {
            header: 'Product Name',
            accessor: (product: Product) => (
                <div title={product.name} className='space-y-1 max-w-60 overflow-hidden overflow-ellipsis'>
                    <p>{product.name}</p>
                    <div className='flex gap-2 flex-col'>
                        {product.featured &&
                            <Badge variant='success' className='text-xs rounded-2xl '>
                                Featured until <span className='px-2'> {product.featuredEndDate}</span>
                            </Badge>}
                        {product.isDealActive &&
                            <Badge variant='info' className='text-xs rounded-2xl '>
                                Deal ends on {product.dealEndDate}
                            </Badge>}

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
                    {product.discountPrice ? <p className="text-xs text-muted-foreground mt-2 flex flex-col gap-2">
                        <span className="line-through mr-2">£{product.price}</span>
                        <span>✅ New price £{product.discountPrice}</span>
                    </p>:
                    <p>£{product.price}</p>
                    }
                </div>
            ),
        },
        {
            header: 'Units',
            accessor: (product: Product) => {
                const getStockVariant = () => {
                    if (product.stock === 0) return 'danger';
                    if (product.stock <= 5) return 'warning';
                    return 'success';
                };
                return <div className='flex flex-col'>
                    <Badge variant={getStockVariant()}>{product.stock}</Badge>
                    <p className='text-xs text-muted-foreground'>stock:{product.stockCount}</p>
                </div>;
            },
        },

        {
            header: 'Date Added',
            accessor: 'date',
        },
    ];

    // Handle action buttons
    const handleView = (product: Product) => {
        console.log('View product:', product);
        // Navigate to product detail view
    };

    const handleEdit = (product: Product) => {
        const p = productsData.find((p) => p.id === product.id);
        console.log('Edit product:', p);
        setSelectedProduct(p);
        setIsEditing(true);
        // Navigate to edit product form
    };

    const onSuccessEditing = () => {
        setRefresh(v => !v)
        setCategories([]);
        setProductsData([]);
        setSelectedProduct(null);
        setIsEditing(false);
    }
    const onFailedEditing = () => {
        //setSelectedProduct(null);
        //setIsEditing(false);
    }

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedProduct) {
            console.log('Deleting product:', selectedProduct);
            // Perform delete action
            try {
                const res = await fetch('/api/admin/allProducts', {
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

    const handleFeature = (product: Product) => {
        console.log('Toggle feature for product:', product);
        // Update featured status
    };

    return (
        <div className='w-full relative'>
            <div className="space-y-6">
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
                        actions={(product: Product) => (
                            <div className="flex space-x-2 justify-end">
                                {/* <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleView(product);
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="View Product"
                        >
                            <Eye size={18} />
                        </button> */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(product);
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

            {isEditing && <div className='w-full z-10000 absolute top-0 bg-black/10'>
                <div className='px-6 sticky z-1000 top-0 w-full items-center flex justify-between bg-gray-700 text-white  p-2'>
                    <h2 className='font-bold  text-xl'>Edit Product</h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className='p-2 cursor-pointer hover:bg-gray-500'>
                        <X size={24} />
                    </button>
                </div>
                <div className='h-full overflow-auto mb-30 mt-0'>

                    <AddNewProductForm
                        onSuccessEditing={onSuccessEditing}
                        onFailedEditing={onFailedEditing}
                        name={selectedProduct?.name}
                        productId={selectedProduct?.id}
                        isIncVAT ={selectedProduct?.isIncVAT}
                        machineDeliveryCharge = {selectedProduct?.delivery_charge}
                        // @ts-ignore
                        description={selectedProduct?.description}
                        discount={selectedProduct?.discountPercentage}
                        discountEnd={selectedProduct?.dealEndDate}
                        imagesUrl={selectedProduct?.imagesUrl}
                        subCategoryId={selectedProduct?.subCategoryId}
                        price={selectedProduct?.price}
                        status={selectedProduct?.status}
                        categories={categories}
                        productionCondition={selectedProduct?.condition}
                        stockQuantity={selectedProduct?.stock}
                        mainCategory={selectedProduct?.category}
                        subCategory={selectedProduct?.subcategory}
                        featureDays={selectedProduct?.featureDays}
                        weight={selectedProduct?.weight}
                        videoUrl={selectedProduct?.videoUrl}
                        stock={selectedProduct?.stockCount}
                        isFeatured={selectedProduct?.featured}
                        dealeEnd={selectedProduct?.dealEndDateFormate}
                        isEditing={true} />
                </div>
            </div>}
            <div className='w-[100vw] h-30'> </div>
        </div>

    );
};

export default AllProducts;