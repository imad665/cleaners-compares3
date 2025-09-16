
import { Pagination } from "@/app/search/pagination"
import { SearchFilter } from "@/app/search/search-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "./product-card"
import { Header } from "@/components/header/header"
import { ItemFeaturedProduct } from "@/components/home_page/serverComponents/uis"

interface Product {
    id: string
    title: string
    image?: string
    href: string
    price: number
    discountPrice?: number
    isDealActive?: boolean
    category: {
        name: string
        parent?: {
            name: string
        }
    }
}

interface SearchParams {
    q?: string
    category?: string
    page?: string
}

async function getSearchResults(params: SearchParams) {
    const searchParams = new URLSearchParams()
    if (params.q) searchParams.append('query', params.q)
    if (params.category) searchParams.append('category', params.category)
    if (params.page) searchParams.append('page', params.page)
    searchParams.append("isInsearch", 'true');

    const res = await fetch(`${process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_BASE_URL_LOCAL : process.env.NEXT_PUBLIC_BASE_URL}/api/search?${searchParams.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch search results')


    return res.json()
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const { q: query = '', category: categoryId = '', page = '1' } = params

    const { products, categories, meta } = await getSearchResults(params)
    console.log(products, 'oooooooooooo');

    const activeCategory = categories.find(c => c.id === categoryId)
    const parentCategories = categories.filter(c => !c.isSubcategory)
    const subCategories = categories.filter(c => c.isSubcategory &&
        (!activeCategory || c.parent?.id === activeCategory.id || c.id === activeCategory.parent?.id))

    return (
        <div>
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}


                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    {/* <div className="w-full md:w-64 flex-shrink-0">
          <SearchFilter 
            query={query}
            activeCategory={activeCategory}
            parentCategories={parentCategories}
            subCategories={subCategories}
          />

          
          {(query || categoryId) && (
            <Link 
              href="/search" 
              className="mt-4 text-sm text-primary hover:underline flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </Link>
          )}
        </div> */}

                    {/* Results */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeCategory
                                    ? `${activeCategory.name} products`
                                    : 'Search Results'
                                }
                            </h1>

                            <p className="text-gray-500 mt-1">
                                {meta?.total || products.length} {products.length === 1 ? 'result' : 'results'}
                                {query && ` for "${query}"`}
                            </p>
                        </div>

                        {/* Products Grid */}
                        {products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product: Product) => (

                                        <ItemFeaturedProduct
                                            {...product}
                                            key={product.productId}
                                        />

                                    ))}
                                </div>

                                {/* Pagination */}
                                {/*  {meta && meta.total > meta.limit && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={parseInt(page)}
                                            totalPages={Math.ceil(meta.total / meta.limit)}
                                            baseUrl={`/search?q=${encodeURIComponent(query)}${categoryId ? `&category=${categoryId}` : ''}`}
                                        />
                                    </div>
                                )} */}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-2 text-gray-500">
                                    {query
                                        ? `We couldn't find any products matching "${query}"`
                                        : 'Try searching for something different'
                                    }
                                </p>
                                <Link href="/search" className="mt-4 inline-block text-primary hover:underline">
                                    Clear search filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}