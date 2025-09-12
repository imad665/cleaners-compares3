'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDebounce } from "@/hooks/useDebounce"
import { Skeleton } from "../skeletonSearch"
import { BigButton } from "../home_page/mainImage2"
import { useHomeContext } from "@/providers/homePageProvider"
import SellerFormDialog from "../forms/sellerForm"
import SellerFormDialog2 from "../forms/sellerForm2"

interface SearchResult {
  id: string
  title: string
  image?: string
  href: string
  price: number
  discountPrice?: number
  isDealActive?: boolean
  category: {
    id: string
    name: string
    href: string
    parent?: {
      id: string
      name: string
      href: string
    }
  }
}

interface CategoryResult {
  id: string
  name: string
  href: string
  parent?: {
    id: string
    name: string
    href: string
  }
  isSubcategory: boolean
  count: number
}

interface SearchResponse {
  products: SearchResult[]
  categories: CategoryResult[]
  meta?: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export function ProductSearchBar({
  isShowBrowser = false,
  isShowSearch = true
}: {
  isShowBrowser?: boolean
  isShowSearch?: boolean
}) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openSellerDialog, setOpenSellerDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useHomeContext();
  const [results, setResults] = useState<SearchResponse>({
    products: [],
    categories: []
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ products: [], categories: [] })
      setActiveCategory(null)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      console.log(data,'dsssssssssssss');
      
      setResults(data)
    } catch (error) {
      console.error("Search failed:", error)
      setResults({ products: [], categories: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery)
      setIsDropdownOpen(true)
    } else {
      setResults({ products: [], categories: [] })
      setIsDropdownOpen(false)
    }
  }, [debouncedQuery, fetchResults])

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}${activeCategory ? `&category=${activeCategory}` : ''}`)
    setIsDropdownOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const clearSearch = () => {
    setQuery("")
    setResults({ products: [], categories: [] })
    setIsDropdownOpen(false)
    setActiveCategory(null)
  }

  const filteredProducts = activeCategory
    ? results.products.filter(p =>
      p.category.id === activeCategory ||
      (p.category.parent && p.category.parent.id === activeCategory)
    )
    : results.products

  const parentCategories = results.categories.filter(c => !c.isSubcategory)
  const subCategories = results.categories.filter(c => c.isSubcategory)
  function handleClickBigButton() {
    if (user) {
      if (user.role.toLocaleLowerCase() === 'seller' || user.role.toLocaleLowerCase() === 'admin') {
        setButtonLoading(true);
        router.push('/admin/addNewProduct')
      } else {
        setOpenSellerDialog(true);
      }
    } else {
      setOpenDialog(true);
    }
  }

  return (
    <div className="w-full relative max-w-3xl mx-auto">
      {isShowSearch && (
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search products, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="pl-10 pr-10 h-12 rounded-lg border-gray-300 focus-visible:ring-2 focus-visible:ring-primary"
            />

            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* <Button
            onClick={handleSearch}
            className="ml-2 h-12 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Search
          </Button> */}
        </div>
      )}


      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 max-h-[70vh] overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          ) : (
            <>
              {/* Category Navigation */}
              {results.categories.length > 0 && (
                <div className="border-b">
                  <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                    {/* {activeCategory && (
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="text-xs text-primary hover:underline"
                      >
                        Show all
                      </button>
                    )} */}
                  </div>

                  {/* Parent Categories */}
                  {parentCategories.length > 0 && (
                    <div className="px-4 py-2 border-b">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Main Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {parentCategories.map((category) => (
                          <Link
                            href={category.hrefCateg}
                            key={category.id}
                            /* onClick={() => setActiveCategory(category.id)} */
                            className={`px-3 py-1.5 text-sm rounded-full flex items-center border transition-colors ${activeCategory === category.id
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <span className="font-medium">{category.name}</span>
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                              {category.count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subcategories */}
                  {subCategories.length > 0 && (
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Subcategories</h4>
                      <div className="flex overflow-auto gap-2  pb-3 overflow-y-hidden">
                        {subCategories.map((category) => (
                          <Link
                            href={category.hrefSubCateg}
                            key={category.id}
                            /* onClick={() => setActiveCategory(category.id)} */
                            className={`px-3 min-w-fit py-1.5 text-sm rounded-full flex items-center border transition-colors ${activeCategory === category.id
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            {category.parent && (
                              <span className="text-gray-500 mr-1">{category.parent.name} /</span>
                            )}
                            <span className="font-medium">{category.name}</span>
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                              {category.count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Products List */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    {activeCategory
                      ? results.categories.find(c => c.id === activeCategory)?.name
                      : `All Products (${filteredProducts.length})`
                    }
                  </h3>
                  {/* {filteredProducts.length > 3 && (
                    <button
                      onClick={handleSearch}
                      className="text-xs text-primary hover:underline"
                    >
                      View all
                    </button>
                  )} */}
                </div>

                {filteredProducts.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={product.href}
                          className="block p-3 hover:bg-gray-50 transition-colors"
                        /* onClick={() => setIsDropdownOpen(false)} */
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-100 overflow-hidden mr-3">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {product.title}
                              </h4>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <span className="truncate">
                                  in {product.category.parent?.name ? `${product.category.parent.name} / ` : ''}{product.category.name}
                                </span>
                              </div>
                            </div>
                            <div className="ml-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
                              {product.discountPrice && product.isDealActive ? (
                                <>
                                  <span className="text-red-600">£{product.discountPrice}</span>
                                  <span className="ml-1 text-xs text-gray-400 line-through">
                                    £{product.price}
                                  </span>
                                </>
                              ) : (
                                `£${product.price}`
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {activeCategory
                      ? `No products found in this category matching "${query}"`
                      : `No products found matching "${query}"`
                    }
                  </div>
                )}
              </div>

              {/* Quick Search Footer */}
              {/* <div className="border-t bg-gray-50 p-3">
                <Link
                  href={{
                    pathname: '/search',
                    query: {
                      q: query,
                      ...(activeCategory && { category: activeCategory })
                    }
                  }}
                  className="w-full py-2 px-4 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                >
                  <span>See all results for "{query}"</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div> */}
            </>
          )}
        </div>
      )}
      {isShowBrowser && (
        <div className="text-sm text-gray-600 ">
          <div className="flex items-center space-x-2 mt-5 max-w-[100vw] overflow-x-auto overflow-y-hidden">
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL ITEMS" />
            <span className="text-gray-400">|</span>
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL MACHINES" />
            <span className="text-gray-400">|</span>
            <BigButton disabled={buttonLoading} onClick={handleClickBigButton} text="SELL PARTS" />
          </div>
          {/*  <span className="mr-2 text-gray-500">or browse:</span> */}
          <span className="space-x-2">
            {/* <Link href="/products/machines/laundry" className="text-blue-600 hover:underline font-medium">
              Laundry Machines
            </Link> */}
            {/* <span className="text-gray-400">|</span>
            <Link href="/products/machines/dry-cleaning" className="text-blue-600 hover:underline font-medium">
              Dry Cleaning
            </Link> */}
            {/* <span className="text-gray-400">|</span> */}
            {/* <Link href="/products/machines/finishing" className="text-blue-600 hover:underline font-medium">
              Finishing
            </Link> */}
          </span>
          {openSellerDialog && <SellerFormDialog callback="/admin/addNewProduct" open={openSellerDialog} setOpen={setOpenSellerDialog} />}
          {openDialog && <SellerFormDialog2 callback="/admin/addNewProduct" text="" open={openDialog} setOpen={setOpenDialog} />}
        </div>
      )}
    </div>
  )
}