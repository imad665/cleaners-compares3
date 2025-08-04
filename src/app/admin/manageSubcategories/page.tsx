'use client'
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '@/components/adminDashboard/shared/Button';
import Badge from '@/components/adminDashboard/shared/Badge';
import { toast } from 'sonner';

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
interface Subcategory {
  id: string;
  name: string;
  slug: string;
  products: number;
  status: string;
  imageUrl: string;
  description: string
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  isExpanded: boolean;
}

const ManageSubcategories = () => {
  // Mock data
  const initialCategories: Category[] = [
    {
      id: 1,
      name: 'Machines',
      isExpanded: true,
      subcategories: [
        { id: 101, name: 'Washing Machines', slug: 'washing-machines', products: 12, status: 'active' },
        { id: 102, name: 'Dryers', slug: 'dryers', products: 8, status: 'active' },
        { id: 103, name: 'Dry Cleaning', slug: 'dry-cleaning', products: 5, status: 'active' },
        { id: 104, name: 'Pressing Equipment', slug: 'pressing-equipment', products: 3, status: 'active' },
        { id: 105, name: 'Ironing Equipment', slug: 'ironing-equipment', products: 0, status: 'hidden' },
      ],
    },
    {
      id: 2,
      name: 'Parts',
      isExpanded: false,
      subcategories: [
        { id: 201, name: 'Filters', slug: 'filters', products: 18, status: 'active' },
        { id: 202, name: 'Belts & Drives', slug: 'belts-drives', products: 22, status: 'active' },
        { id: 203, name: 'Motors', slug: 'motors', products: 14, status: 'active' },
        { id: 204, name: 'Pumps', slug: 'pumps', products: 9, status: 'active' },
        { id: 205, name: 'Electrical Components', slug: 'electrical-components', products: 0, status: 'hidden' },
      ],
    },
    {
      id: 3,
      name: 'Sundries',
      isExpanded: false,
      subcategories: [
        { id: 301, name: 'Chemicals', slug: 'chemicals', products: 16, status: 'active' },
        { id: 302, name: 'Cleaning Tools', slug: 'cleaning-tools', products: 12, status: 'active' },
        { id: 303, name: 'Packaging', slug: 'packaging', products: 8, status: 'active' },
        { id: 304, name: 'Safety Equipment', slug: 'safety-equipment', products: 6, status: 'active' },
        { id: 305, name: 'Consumables', slug: 'consumables', products: 0, status: 'hidden' },
      ],
    },
  ];

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    categoryId: 0,
    status: 'active',
    imageFile: null,
    description: '',
  });
  const [editSubcategory, setEditSubcategory] = useState({
    name: '',
    categoryId: 0,
    status: 'active',
    imageUrl: '',
    description: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<{
    subcategory: Subcategory;
    categoryId: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subCategoryTrashed, setSubCategoryTrashed] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/subCategory');
        if (!res.ok) {
          toast.error('Failed to fetch categories');
          throw new Error('Failed to fetch categories');
        }
        const data: any[] = await res.json();

        const trashed = data.map((d) => ({ ...d, subcategories: d.subcategories.filter((s) => s.status === 'deleting') }));
        const notTrashed = data.map((d) => ({ ...d, subcategories: d.subcategories.filter((s) => s.status !== 'deleting') }));


        setCategories(notTrashed);
        setSubCategoryTrashed(trashed);
        console.log(trashed, 'kkkkkkkkkkkkkk');

      } catch (error) {
        console.error('[CLIENT_FETCH_ERROR]', error);
        toast.error('[CLIENT_FETCH_ERROR]');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh])
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // generate preview URL
    }
  };
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    );
  };

  // Handle adding new subcategory
  const handleAddSubcategory = async () => {
    const { name, categoryId, status, imageFile, description } = newSubcategory;

    if (name.trim() === '' || categoryId === 0) {
      toast.error('Please provide a valid name and select a parent category.');
      return;
    }

    try {

      const formData = new FormData();
      formData.append('name', name);
      formData.append('parentCategoryId', categoryId.toString());
      formData.append('status', status);
      formData.append('description', description);
      formData.append('imageFile', imageFile);


      const res = await fetch('/api/admin/subCategory', {
        method: 'POST',
        body: formData,

      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to add subcategory.');
        return;
      }

      const { subcategory } = await res.json();

      const newSubcategoryItem: Subcategory = {
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.name.toLowerCase().replace(/\s+/g, '-'),
        products: 0,
        status: subcategory.status || status,
      };

      // Update categories state
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? {
              ...category,
              subcategories: [...category.subcategories, newSubcategoryItem],
              isExpanded: true,
            }
            : category
        )
      );

      toast.success('Subcategory added successfully!');
      setNewSubcategory({ name: '', categoryId: 0, status: 'active', imageFile: null, description: '' });
      setIsAdding(false);
      setRefresh(v => !v)
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Handle editing subcategory
  const startEditing = (subcategory: Subcategory, categoryId: number) => {
    setIsEditing(subcategory.id);
    setEditSubcategory({
      name: subcategory.name,
      categoryId: categoryId,
      status: subcategory.status,
      imageUrl: subcategory.imageUrl,
      imageFile: null,
      description: subcategory.description
    });
    setPreviewUrl(subcategory.imageUrl);
  };

  const saveEdit = async (id: string) => {
    if (editSubcategory.name.trim() === '') {
      toast.error('Subcategory name cannot be empty.');
      return;
    }
    try {

      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', editSubcategory.name);
      formData.append('status', editSubcategory.status);
      formData.append('imageFile', editSubcategory.imageFile);
      formData.append('imageUrl', editSubcategory.imageUrl)
      formData.append('description', editSubcategory.description);

      const res = await fetch('/api/admin/subCategory', {
        method: 'PATCH',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update subcategory.');
        return;
      }

      const { subcategory } = await res.json();

      setCategories(prev =>
        prev.map(category =>
          category.id === editSubcategory.categoryId
            ? {
              ...category,
              subcategories: category.subcategories.map(sub =>
                sub.id === id
                  ? {
                    ...sub,
                    name: editSubcategory.name,
                    slug: editSubcategory.name.toLowerCase().replace(/\s+/g, '-'),
                    status: editSubcategory.status
                  }
                  : sub
              )
            }
            : category
        )
      );

      toast.success('Subcategory updated successfully.');
      setIsEditing(null);
      setRefresh(v => !v)
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('An unexpected error occurred while updating the subcategory.');
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  // Handle deleting subcategory
  const startDelete = (subcategory: Subcategory, categoryId: string) => {
    setSubcategoryToDelete({ subcategory, categoryId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!subcategoryToDelete) return;
    try {
      const res = await fetch('/api/admin/subCategory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subcategoryToDelete.subcategory.id })
      });

      if (!res.ok) {
        const dataError = await res.json();
        toast.error(dataError.error || 'Failed to delete subcategory.');
        return;
      }

      // Optionally get the updated subcategory info from the server
      const { category: deletedCategory, message } = await res.json();
      console.log(categories, subcategoryToDelete, '!!!!!!!');

      /* setSubCategoryTrashed(subCategoryTrashed.map((category: any) =>
        category.id === subcategoryToDelete.categoryId
          ? {
            ...category,
            subcategories: category.subcategories.concat(
              {
                ...subcategoryToDelete.subcategory,
                deletedAt: deletedCategory.deletedAt
              }
            )
          } : category
      ))
      setCategories(
        categories.map(category =>
          category.id === subcategoryToDelete.categoryId
            ? {
              ...category,
              subcategories: category.subcategories.filter(
                s => s.id !== subcategoryToDelete.subcategory.id
              ),
            }
            : category
        )
      ); */
      setRefresh(v => !v);

      toast.success(message || 'Subcategory scheduled for deletion.');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Something went wrong while deleting subcategory.');
    } finally {
      setShowDeleteModal(false);
      setSubcategoryToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    if (!id) return
    try {
      const res = await fetch('/api/admin/subCategory/restore', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ id })
      }
      );
      if (!res.ok) {
        toast.error('restore of subcategory failed');
        return;
      }
      const subcat = subCategoryTrashed.find((categ) => categ.subcategories.find((s) => s.id === id))
      /* setSubCategoryTrashed(subCategoryTrashed.map((categ: any) => ({
        ...categ, subcategories: categ.subcategories.filter((sub) => sub.id != id)
      })));

      const subca2 = { ...subcat, subcategories: subcat.subcategories.map((s) => ({ ...s, status: 'active' })) }

      setCategories(categories.map((cat) => ({ ...cat, subcategories: cat.id === subca2.id ? cat.subcategories.concat(subca2.subcategories) : cat.subcategories })));
 */
      setRefresh(v => !v)
      toast.success('subcategory restored successfuly!');
    } catch (error) {
      toast.error('restore failed');
      console.error('restore failed', error);

    }
  }

  console.log(newSubcategory, ';;;;;;;;;;;;;;;');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subcategories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage subcategories within each parent category.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsAdding(true)}
          >
            Add Subcategory
          </Button>
        </div>
      </div>

      {/* Add New Subcategory Form */}
      {isAdding && (
        <div className="bg-white shadow-sm rounded-lg p-4 border border-blue-100 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Subcategory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category*
              </label>
              <select
                id="categorySelect"
                value={newSubcategory.categoryId}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value={0}>Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory Name*
              </label>
              <input
                type="text"
                id="subcategoryName"
                required
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter subcategory name"
              />
            </div>
            <div>
              <label htmlFor="subcategoryStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="subcategoryStatus"
                value={newSubcategory.status}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, status: e.target.value })}
                className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <>
                <label htmlFor='mainImage' className='block text-sm font-medium text-gray-700 mb-1'>Main Image*</label>
                <input
                  className="rounded-md max-w-40 overflow-hidden p-1 cursor-pointer border-gray-300 shadow-sm"
                  type="file"
                  accept="image/*"
                  name="image"
                  id='mainImage'
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > MAX_FILE_SIZE_BYTES) {
                      toast.error("Image too large", {
                        description: `Image "${file.name}" exceeds the 1MB limit.`,
                      });
                      e.target.value = "";
                      return;
                      return; // Skip this file
                    }
                    setNewSubcategory({ ...newSubcategory, imageFile: file })
                    setPreviewUrl(URL.createObjectURL(file));
                  }}
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                  </div>
                )}
              </>
            </div>
            <div>
              <label htmlFor='textarea' className='block text-sm font-medium text-gray-700 mb-1'>Description*</label>
              <textarea
                onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                id='textarea'

                rows={5}
                cols={40}
                required minLength={5}
                className="rounded-md border-1  text-sm p-1 cursor-pointer border-gray-300 shadow-sm" />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSubcategory}
              disabled={
                newSubcategory.name.trim() === '' ||
                newSubcategory.categoryId === '0' ||
                !newSubcategory.description ||
                newSubcategory.description.trim() === '' ||
                newSubcategory.imageFile === null
              }
            >
              Add Subcategory
            </Button>
          </div>
        </div>
      )}

      {/* Categories and Subcategories List */}
      {loading ? <div className="flex justify-center mt-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div> :
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {categories.map(category => (
              <div key={category.id} className="divide-y divide-gray-100">
                {/* Category Header */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    {category.isExpanded ? (
                      <ChevronDown size={20} className="text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-500 mr-2" />
                    )}
                    <h3 className="text-base font-medium text-gray-900">{category.name}</h3>
                    <span className="ml-3 text-sm text-gray-500">
                      {category.subcategories.length} subcategories
                    </span>
                  </div>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewSubcategory({ ...newSubcategory, categoryId: category.id });
                      setIsAdding(true);
                    }}
                  >
                    Add to {category.name}
                  </button>
                </div>

                {/* Subcategories Table */}
                {category.isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subcategory Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Products
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Main Image
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.subcategories.map(subcategory => (
                          <tr key={subcategory.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {isEditing === subcategory.id ? (
                                <input
                                  type="text"
                                  value={editSubcategory.name}
                                  onChange={(e) => setEditSubcategory({ ...editSubcategory, name: e.target.value })}
                                  className="block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  autoFocus
                                />
                              ) : (
                                subcategory.name
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subcategory.slug}
                            </td>
                            <td className="px-6 py-4 max-w-30 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gray-500">
                              {isEditing === subcategory.id ? (
                                <input
                                  type="text"
                                  value={editSubcategory.description}
                                  onChange={(e) => setEditSubcategory({ ...editSubcategory, description: e.target.value })}
                                  className="block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  autoFocus
                                  title={editSubcategory.description}
                                />
                              ) : (
                                <p title={subcategory.description}>{subcategory.description}</p>

                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subcategory.products}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {isEditing === subcategory.id ? (
                                <select
                                  value={editSubcategory.status}
                                  onChange={(e) => setEditSubcategory({ ...editSubcategory, status: e.target.value })}
                                  className="block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                  <option value="active">Active</option>
                                  <option value="hidden">Hidden</option>
                                </select>
                              ) : (
                                <Badge
                                  variant={subcategory.status === 'active' ? 'success' : 'secondary'}
                                >
                                  {subcategory.status === 'active' ? 'Active' : 'Hidden'}
                                </Badge>
                              )}
                            </td>
                            <td>
                              {isEditing === subcategory.id ? (
                                <>
                                  <input
                                    className="rounded-md max-w-30 overflow-hidden p-1 cursor-pointer border-gray-300 shadow-sm"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    onChange={(e) => {
                                      handleImageChange(e);
                                      const file = e.target.files[0];
                                      setEditSubcategory({ ...editSubcategory, imageFile: file })
                                    }}
                                  />
                                  {previewUrl && (
                                    <div className="mt-2">
                                      <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <a href={subcategory.imageUrl} target="_blank" className="underline text-blue-500 cursor-pointer" rel="noopener noreferrer">
                                  View
                                </a>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                              {isEditing === subcategory.id ? (
                                <div className="flex space-x-2 justify-end">
                                  <button
                                    onClick={() => saveEdit(subcategory.id)}
                                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                    title="Save"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    title="Cancel"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2 justify-end">
                                  <button
                                    onClick={() => startEditing(subcategory, category.id)}
                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Edit Subcategory"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => startDelete(subcategory, category.id)}
                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Delete Subcategory"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {category.subcategories.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                            >
                              No subcategories found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      }


      {/* Delete Confirmation Modal */}
      {showDeleteModal && subcategoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the subcategory "{subcategoryToDelete.subcategory.name}"?
            </p>
            {subcategoryToDelete.subcategory.products > 0 && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                <p className="font-medium">Warning:</p>
                <p>
                  This subcategory has {subcategoryToDelete.subcategory.products} products assigned to it.
                  Deleting it may affect these products.
                </p>
              </div>
            )}
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
      {subCategoryTrashed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deleted Categories (Pending)</h2>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 text-gray-600">Name</th>
                <th className="p-2 text-gray-600">Slug</th>
                <th className="p-2 text-gray-600">Scheduled Deletion</th>
                <th className="p-2 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategoryTrashed.map((cat) => {

                return (cat.subcategories.map(s => (
                  <tr key={s.id}>
                    <td className="p-2 text-gray-600">
                      <div>
                        {s.name} <br />
                        <span className='text-xs text-gray-500'>{cat.name}</span>
                      </div>

                    </td>
                    <td className="p-2 text-gray-600">{s.slug}</td>
                    <td className="p-2 text-red-600">
                      {new Date(s.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-gray-600 w-fit">
                      <Button
                        variant='outline'
                        onClick={() => handleRestore(s.id)}
                        className=" w-fit cursor-pointer"
                      >
                        Restore
                      </Button>
                    </td>
                  </tr>
                )))
              })}
            </tbody>
          </table>
          <div className='w-[100vw] h-30'> </div>

        </div>
      )}
      <div className='w-[100vw] h-30'> </div>
    </div>
  );
};

export default ManageSubcategories;