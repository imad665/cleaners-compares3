'use client'
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import Badge from '@/components/adminDashboard/shared/Badge';
import Button from '@/components/adminDashboard/shared/Button';
import Table from '@/components/adminDashboard/shared/Table';
import { toast } from 'sonner';
import { prisma } from '@/lib/prisma';
import { Input } from '@/components/ui/input';


interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: number;
  products: number;
  status: string;
}

const ManageCategories = () => {
  // Mock categories data
  const initialCategories: Category[] = [
    { id: 1, name: 'Machines', slug: 'machines', subcategories: 5, products: 28, status: 'active' },
    { id: 2, name: 'Parts', slug: 'parts', subcategories: 8, products: 63, status: 'active' },
    { id: 3, name: 'Sundries', slug: 'sundries', subcategories: 6, products: 42, status: 'active' },
    { id: 4, name: 'Engineers', slug: 'engineers', subcategories: 4, products: 15, status: 'active' },
    { id: 5, name: 'Software', slug: 'software', subcategories: 3, products: 7, status: 'active' },
    { id: 6, name: 'Reconditioned', slug: 'reconditioned', subcategories: 3, products: 14, status: 'hidden' },
  ];

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', status: 'active' });
  const [editCategory, setEditCategory] = useState({ name: '', status: 'active' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [trashedCategories, setTrashedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/category');
        if (!res.ok) {
          toast.error('Failed to fetch categories')
          throw new Error('Failed to fetch categories')
        }
        const data = await res.json();
        console.log(data.data, 'datadaataffffff');
        const noTrashed = data.data.filter((d) => d.status != 'deleting');
        const trashed = data.data.filter(d => d.status === 'deleting');
        setTrashedCategories(trashed);
        setCategories(noTrashed);
      } catch (error) {
        console.error('');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [])
  // Table columns
  const columns = [
    {
      header: 'Category Name',
      accessor: (category: Category) => {
        if (isEditing === category.id) {
          return (
            <input
              type="text"
              value={editCategory.name}
              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              className="block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              autoFocus
            />
          );
        }
        return category.name;
      },
    },
    {
      header: 'Slug',
      accessor: 'slug',
    },
    {
      header: 'Subcategories',
      accessor: 'subcategories',
    },
    /* {
      header: 'Products',
      accessor: 'products',
    }, */
    {
      header: 'Status',
      accessor: (category: Category) => {
        if (isEditing === category.id) {
          return (
            <select
              value={editCategory.status}
              onChange={(e) => setEditCategory({ ...editCategory, status: e.target.value })}
              className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>

            </select>
          );
        }

        return (
          <Badge
            variant={category.status === 'active' ? 'success' : 'secondary'}
          >
            {category.status === 'active' ? 'Active' : 'Hidden'}
          </Badge>
        );
      },
    },
  ];

  // Handle adding new category
  const handleAddCategory = () => {
    if (newCategory.name.trim() === '') return;
    const addNewProduct = async () => {
      try {
        const res = await fetch('/api/admin/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategory.name,
            status: newCategory.status,
            description: 'some description for category',
          })
        });

        if (!res.ok) {
          toast.error('Failed to add category')
          console.error('Failed to add category');

          return;
        }
        const { data: category } = await res.json();
        console.log(category, '.........................');

        const newCategoryItem: Category = {
          id: category.id,
          name: newCategory.name,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
          subcategories: 0,
          products: 0,
          status: newCategory.status,
        }
        setCategories([...categories, newCategoryItem]);
        setNewCategory({ name: '', status: 'active' });
        setIsAdding(false);
        toast.success('new category added succefuly!')
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error('Error adding category')
      }
    }
    addNewProduct();
  };

  // Handle editing category
  const startEditing = (category: Category) => {
    setIsEditing(category.id);
    setEditCategory({ name: category.name, status: category.status });
  };

  const saveEdit = (id: string) => {
    if (editCategory.name.trim() === '') return;
    const updateCategory = async () => {
      try {
        const res = await fetch('/api/admin/category', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            name: editCategory.name,
            status: editCategory.status
          }),
        })
        if (!res.ok) {
          toast.error('Update failed')
          throw new Error('Update failed');
        }
        const { category: data } = await res.json();

        setCategories(categories.map(category =>
          category.id === id
            ? {
              ...category,
              name: data.name,
              slug: editCategory.name.toLowerCase().replace(/\s+/g, '-'),
              status: editCategory.status,
            }
            : category
        ));
        setIsEditing(null);
        toast.success('category updated successfuly!')
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Error updating category');
      }
    }
    updateCategory();
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  // Handle deleting category
  const startDelete = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const handleDelete = async () => {
      try {
        if (categoryToDelete) {
          const res = await fetch('/api/admin/category', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: categoryToDelete.id }),
          });

          if (!res.ok) {
            toast.error('Failed to delete category')
            throw new Error('Failed to delete category');
          }
          const { category } = await res.json();
          setTrashedCategories((prev) => [...prev, category])
          setCategories(categories.filter(c => c.id !== categoryToDelete.id));
          setShowDeleteModal(false);
          setCategoryToDelete(null);
          toast.success('category deleted successfuly!')
        }
      } catch (error) {
        toast.error('Error deleting category');
        console.error('Error deleting category:', error);
      }
    }
    handleDelete();
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch('/api/admin/category/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const categ = trashedCategories.find((c) => c.id === id);

        setCategories((prev) => [...prev, { ...categ, status: 'active' }]);
        setTrashedCategories(prev => prev.filter(c => c.id !== id));
        toast.success('category restored successfuly!');
      }
    } catch (error) {
      toast.error('Restore failed!')
      console.error('Restore failed:', error);
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage categories for organizing your products.
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsAdding(true)}
          >
            Add Category
          </Button>
        </div> */}
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <div className="bg-white shadow-sm rounded-lg p-4 border border-blue-100 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name*
              </label>
              <Input
                type="text"
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="categoryStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="categoryStatus"
                value={newCategory.status}
                onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
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
              onClick={handleAddCategory}
              disabled={newCategory.name.trim() === ''}
            >
              Add Category
            </Button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {loading ? <div className="flex justify-center mt-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div> :
        <Table
          columns={columns}
          data={categories}
          keyField="id"

          actions={(category: Category) => (
            isEditing === category.id ? (
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => saveEdit(category.id)}
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
                {/* <button
                  onClick={() => startEditing(category)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => startDelete(category)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={18} />
                </button> */}
              </div>
            )
          )}
        />
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"?
            </p>

            {(categoryToDelete?.subcategories || 0) > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <p className="font-medium">⚠️ Warning:</p>
                <p>
                  This category has <strong>{categoryToDelete?.subcategories}</strong> subcategories.
                  Deleting it will <strong>permanently remove</strong> all associated subcategories.
                </p>
              </div>
            )}

            {(categoryToDelete?.products || 0) > 0 && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                <p className="font-medium">🛑 Warning:</p>
                <p>
                  This category has <strong>{categoryToDelete?.products}</strong> products.
                  Deleting it will also <strong>remove all related products</strong> from the database.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}


      {trashedCategories.length > 0 && (
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
              {trashedCategories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-2 text-gray-600">{cat.name}</td>
                  <td className="p-2 text-gray-600">{cat.slug}</td>
                  <td className="p-2 text-red-600">
                    {new Date(cat.deletedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-gray-600 w-fit">
                    <Button
                      variant='outline'
                      onClick={() => handleRestore(cat.id)}
                      className=" w-fit cursor-pointer"
                    >
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
      <div className='w-[100vw] h-30'> </div>

    </div>
  );
};

export default ManageCategories;