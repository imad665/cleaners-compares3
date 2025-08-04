'use client'

import { useState } from 'react';
import { Save, X, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
 

const AddProduct = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    stock: '',
    status: 'active',
    featured: false,
    images: [] as File[],
  });
  
  // Mock data for categories and subcategories
  const categories = [
    { id: 1, name: 'Machines' },
    { id: 2, name: 'Parts' },
    { id: 3, name: 'Sundries' },
    { id: 4, name: 'Engineers' },
    { id: 5, name: 'Software' },
  ];
  
  const subcategories = {
    'Machines': [
      { id: 1, name: 'Washing Machines' },
      { id: 2, name: 'Dryers' },
      { id: 3, name: 'Dry Cleaning' },
      { id: 4, name: 'Pressing Equipment' },
      { id: 5, name: 'Ironing Equipment' },
    ],
    'Parts': [
      { id: 6, name: 'Filters' },
      { id: 7, name: 'Belts & Drives' },
      { id: 8, name: 'Motors' },
      { id: 9, name: 'Pumps' },
      { id: 10, name: 'Electrical Components' },
    ],
    'Sundries': [
      { id: 11, name: 'Chemicals' },
      { id: 12, name: 'Cleaning Tools' },
      { id: 13, name: 'Packaging' },
      { id: 14, name: 'Safety Equipment' },
      { id: 15, name: 'Consumables' },
    ],
    'Engineers': [
      { id: 16, name: 'Installation' },
      { id: 17, name: 'Repairs' },
      { id: 18, name: 'Maintenance' },
      { id: 19, name: 'Training' },
    ],
    'Software': [
      { id: 20, name: 'Management Systems' },
      { id: 21, name: 'Monitoring Tools' },
      { id: 22, name: 'Booking Systems' },
    ],
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFormData({
        ...formData,
        images: [...formData.images, ...fileList],
      });
    }
  };
  
  // Remove selected image
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would normally dispatch this data to your API or state management system
    
    // Show success message or redirect
    alert('Product added successfully!');
    // Reset form
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      description: '',
      price: '',
      stock: '',
      status: 'active',
      featured: false,
      images: [],
    });
  };
  
  // Get available subcategories based on selected category
  const availableSubcategories = formData.category ? subcategories[formData.category as keyof typeof subcategories] || [] : [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to add a new product to your marketplace.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          </div>
          
          {/* Product Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter product name"
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subcategory */}
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory*
            </label>
            <select
              id="subcategory"
              name="subcategory"
              required
              value={formData.subcategory}
              onChange={handleInputChange}
              disabled={!formData.category}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Subcategory</option>
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter product description"
            />
          </div>
          
          {/* Pricing & Inventory */}
          <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h2>
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price*
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
          
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              required
              value={formData.stock}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter quantity"
            />
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="featured">Featured</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          
          {/* Featured */}
          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Mark as featured product
            </label>
          </div>
          
          {/* Images */}
          <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
            {/* Image upload area */}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            {/* Preview uploaded images */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} className="text-red-600" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end space-x-3 border-t border-gray-200 pt-6 mt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                // Reset form or navigate back
                if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                  window.history.back();
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="default"
             
            >
              <Save size={16} />
              Save Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;