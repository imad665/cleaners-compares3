'use client';

import { useEffect, useState } from 'react';
import { ItemFeaturedProduct, ItemLimitedTimeDeals, ItemProductProps, ItemProps, ProductViewerForSubCategory } from '../home_page/serverComponents/uis';
import { Loader2 } from 'lucide-react';




type PaginatedProductsProps = {
  initProducts: ItemProductProps[];
  page?: number;
  pageSize?: number;
  condition?: 'new' | 'used' | undefined
  subCategory: { name: string, id: string, description: string };
  totalPages: number;
  showDescription?: boolean
  title?: string
};
function getPaginationRange(current: number, total: number, delta = 2): (number | string)[] {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // Always show first

  if (left > 2) {
    range.push('...');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push('...');
  }

  if (total > 1) {
    range.push(total); // Always show last
  }

  return range;
}
export function PaginatedProducts({ initProducts, title = '', page = 1, pageSize = 10, subCategory, condition = undefined, totalPages, showDescription = true }: PaginatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(page);
  const [products, setProducts] = useState(initProducts);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (currentPage === 1 && start) return
      setLoading(true);
      try {

        const url = `/api/subCategoryProducts?id=${subCategory.id}&page=${currentPage}&pageSize=${pageSize}&condition=${condition}`;
        await new Promise((res) => setTimeout(res, 3000));
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');

        const { products } = await res.json();
        //console.log(products, subCategory.id, currentPage, pageSize, condition, ';;;;;;;;********;;;;;');

        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setStart(false)
      }
    };

    fetchProducts();
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='flex flex-col gap-12 px-4 md:px-8 mb-12'>
      {/* Header */}
      {showDescription && <div className='max-w-xl mx-auto text-center space-y-3'>
        <h1 className='text-3xl font-semibold tracking-tight'>
          {condition && `${condition.charAt(0).toUpperCase() + condition.slice(1)} `}
          {subCategory?.name}
        </h1>
        <p className='text-gray-600'>{subCategory?.description}</p>
      </div>}

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      ) : (
        <div className='space-y-5'>
          {title != '' && <h2 className='font-bold text-2xl pl-3'>{title}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3">

            {subCategory.id != 'deals' && products.map((product) =>
              <ItemFeaturedProduct isOldProduct={product.isOldProduct} className='m-auto w-[90vw] md:w-[50vw] md:!max-w-[320px] md:!min-w-[200px]' key={product.productId} {...product} />

            )}
            {subCategory.id === 'deals' && products.map((product) =>
              <ItemLimitedTimeDeals  className='!min-w-[90vw] !m-auto md:!max-w-[400px] md:!min-w-[0px] md:!w-[330px] lg:!w-[27vw] lg:!max-w-[300px] ' key={product.productId} {...product} />

            )}


          </div>
        </div>

      )}

      {/* Pagination Controls */}
      {/* Smart Pagination Controls */}
      <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
        <button
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {getPaginationRange(currentPage, totalPages).map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-sm text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              disabled={isActive}
              onClick={() => goToPage(Number(page))}
              className={`px-3 py-1 border text-sm rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
