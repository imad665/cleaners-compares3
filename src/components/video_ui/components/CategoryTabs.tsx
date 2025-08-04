import React from 'react';
import { Category } from '../types';
import { cn } from '../utils/cn';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="md:hidden overflow-x-auto whitespace-nowrap pb-2 pt-16 px-4 border-b border-slate-200 sticky top-0 bg-white z-10">
      <div className="inline-flex gap-2 pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-150",
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;