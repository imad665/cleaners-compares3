import React from 'react';

import CategorySidebar from './CategorySidebar';
import CategoryTabs from './CategoryTabs';
import { Category } from '../types';
import { Header } from '@/components/header/header';

interface LayoutProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
       
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
       
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />



      <main className="pt-2 pb-10 px-4 md:px-8 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;