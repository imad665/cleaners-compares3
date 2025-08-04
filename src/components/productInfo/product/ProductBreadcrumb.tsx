import { ChevronRight, Home } from 'lucide-react';

interface ProductBreadcrumbProps {
  category: string;
  subcategory?: string;
  name: string;
  base?:''|'/products'
  className?:string;
}

export default function ProductBreadcrumb({
  category,
  subcategory,
  name,
  className='',
  base='/products',
}: ProductBreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
        <li className="inline-flex items-center">
          <a
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {subcategory &&<a
              href={`${base}/${category.toLowerCase()}`}
              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {category}
            </a>}
            {!subcategory &&<span
             
              className="ml-1 text-muted-foreground hover:text-foreground  "
            >
              {category}
            </span>}
          </div>
        </li>
        {subcategory && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {name && <a
                href={`${base}/${category.toLowerCase()}/${subcategory.toLowerCase()}`}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {subcategory}
              </a>}
              {!name &&
                <span
                  className="ml-1 text-foreground font-medium"
                >
                  {subcategory}
                </span>
              }
            </div>
          </li>
        )}
        {name && <li aria-current="page">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="ml-1 text-foreground font-medium">
              {name}
            </span>
          </div>
        </li>}
      </ol>
    </nav>
  );
}