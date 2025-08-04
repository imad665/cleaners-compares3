'use client'
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Star, X } from 'lucide-react';
import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { HeaderAdmin, NavDesktop, NavMobile } from '@/components/adminDashboard/menu/menu';
import { AddNewProductForm } from '@/components/forms/addNewProductForm';
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddWantedItemDialog from '@/components/forms/wantedItem';


// Define the product type
interface WantedItem {
    id: string;
    title: string;
    location: string;
    description: string;
    datePosted: string;
    email: string;
    phone: string;
    imageUrl: string;
    fullName: string

}

const AllProducts = () => {
    // Mock products data
    const initProductsData: WantedItem[] = [
        {
            id: '1',
            title: 'Used Dry Cleaning Machine',
            location: 'New York, NY',
            description: 'Looking for a used dry cleaning machine in good condition. Must be able to handle at least 50 lbs of garments.',
            datePosted: '2024-07-28',
            email: 'contactInfo@email.com',
            phone: '124587899',
            imageUrl: '/test/ai_home.jpeg',
            fullName: 'Mohamed hasnaoui'
        },
        {
            id: '2',
            title: 'Commercial Laundry Detergent',
            location: 'Los Angeles, CA',
            description: 'Need a bulk supply of high-efficiency laundry detergent for commercial use. Eco-friendly preferred.',
            datePosted: '2024-07-25',
            email: 'contactInfo@email.com',
            phone: '124587899',
            imageUrl: '/test/ai_home.jpeg',
            fullName: 'Mohamed hasnaoui'
        },
        {
            id: '3',
            title: 'Used Pressing Machine',
            location: 'Chicago, IL',
            description: 'Seeking a used pressing machine for shirts and pants. Must be in working order.',
            datePosted: '2024-07-20',
            email: 'contactInfo@email.com',
            phone: '124587899',
            imageUrl: '/test/ai_home.jpeg',
            fullName: 'Mohamed hasnaoui'
        },
        {
            id: '4',
            title: 'Laundry Conveyor System',
            location: 'Houston, TX',
            description: 'Looking for a conveyor system for my laundry facility. Need a system that can handle high volume.',
            datePosted: '2024-07-18',
            email: 'contactInfo@email.com',
            phone: '124587899',
            imageUrl: '/test/ai_home.jpeg',
            fullName: 'Mohamed hasnaoui'
        },
        {
            id: '5',
            title: 'Used Industrial Washer',
            location: 'Phoenix, AZ',
            description: 'Looking for a used industrial washer with a capacity of 75lbs or more.',
            datePosted: '2024-07-15',
            email: 'contactInfo@email.com',
            phone: '124587899',
            imageUrl: '/test/ai_home.jpeg',
            fullName: 'Mohamed hasnaoui'
        },
    ];

    const [selectedProduct, setSelectedProduct] = useState<WantedItem | null>(null);
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(()=>{
        const state = searchParams.get('state');
        //alert(state)
        if(state === 'add') {
            router.replace(pathname)
            setAddWanted(true);
        }
    },[])


    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/admin/myWantedItems');
                if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error);
                    return;
                }


                const { wantedItems } = await res.json();
                //console.log(wantedItems, 'ooooooooooo');

                setProductsData(wantedItems);

            } catch (error) {
                console.error('failes to fetch Wanted Items ', error);
                toast.error('failed to fetched Wanted Items');
            } finally {
                setLoading(false);
            }

        }
        fetchProducts();
    }, [refresh])


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
        console.log('View product:', product);
        // Navigate to product detail view
    };

    const handleEdit = (product: WantedItem) => {
        const p = productsData.find((p) => p.id === product.id);
        console.log('Edit product:', p);
        setSelectedProduct(p);
        setIsEditing(true);
        // Navigate to edit product form
    };



    const handleDelete = (product: WantedItem) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };
    //console.log(selectedProduct,'????????????');

    const confirmDelete = async () => {
        if (selectedProduct) {
            console.log('Deleting product:', selectedProduct);
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
            {addWanted && <AddWantedItemDialog
                open={addWanted}
                setOpen={setAddWanted}
                onSubmitSuccess={() => {
                    setRefresh(v => !v)
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
                            setRefresh(v => !v)
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
            <div className='w-[100vw] h-30'> </div>
        </div>

    );
};

export default AllProducts;