import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface Category {
  id: string
  name: string
  href: string
  count: number
  parent?: {
    id: string
    name: string
  }
  isSubcategory: boolean
}

export function SearchFilter({
  query,
  activeCategory,
  parentCategories,
  subCategories
}: {
  query: string
  activeCategory?: Category
  parentCategories: Category[]
  subCategories: Category[]
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
        
        {/* Parent Categories */}
        {parentCategories.length > 0 && (
          <div className="space-y-2">
            {parentCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&category=${category.id}`}
                  className={`flex items-center justify-between text-sm ${activeCategory?.id === category.id ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                    {category.count}
                  </span>
                </Link>
                
                {/* Subcategories */}
                {activeCategory?.id === category.id && subCategories.length > 0 && (
                  <div className="ml-3 space-y-1">
                    {subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        href={`/search?q=${encodeURIComponent(query)}&category=${subCategory.id}`}
                        className={`flex items-center justify-between text-sm ${activeCategory?.id === subCategory.id ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <span>{subCategory.name}</span>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                          {subCategory.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter (example) */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Price</h3>
        <div className="space-y-2">
          <button className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900">
            Under £25
          </button>
          <button className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900">
            £25 to £50
          </button>
          <button className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900">
            £50 to £100
          </button>
          <button className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900">
            Over £100
          </button>
        </div>
      </div>

      {/* Deals Filter (example) */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Deals</h3>
        <div className="space-y-2">
          <Link
            href={`/search?q=${encodeURIComponent(query)}${activeCategory ? `&category=${activeCategory.id}` : ''}&deal=true`}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            On Sale
          </Link>
        </div>
      </div>
    </div>
  )
}