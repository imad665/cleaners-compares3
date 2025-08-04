import React from 'react';
import { Category } from '../types';
import { cn } from '../utils/cn';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <aside className="hidden md:block w-64 h-screen bg-white border-r border-slate-200 overflow-y-auto fixed left-0 top-33  pt-16">
      <div className="py-4">
        <h2 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Categories
        </h2>
        <nav className="mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-slate-100 flex items-center",
                selectedCategory === category.id
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-50 border-l-4 border-blue-600"
                  : "text-slate-700 border-l-4 border-transparent"
              )}
            >
              {category.name}
              <span className="ml-auto text-xs text-slate-500">{category.videos.length}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CategorySidebar;