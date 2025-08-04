'use client'
import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import VideoGrid from './components/VideoGrid';
import { categories, DEFAULT_CATEGORY } from './data/videos';
import { Category } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
 
import { toast } from 'sonner';




function App() {
  // Use localStorage to persist the selected category
  const [selectedCategoryId, setSelectedCategoryId] = useLocalStorage<string>(
    'selectedCategory',
    DEFAULT_CATEGORY
  );
  const [newCategories,setNewCategories] = useState(categories);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    setLoading(true)
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        if(!res.ok){
          const {error} = await res.json();
          toast.error(error || 'failed to fetch videos')
          return 
        }
        const videosCategories = await res.json(); 
        //console.log(videosCategories,';;;;;;;;;;;;;;;;');
        setLoading(false)
        setNewCategories(videosCategories);
      } catch (error) {
        toast.error('somthing went wrong!')
      }
    }
    fetchVideos()
  }, [])

  // Find the selected category object
  const selectedCategory = newCategories.find(
    (category) => category.id === selectedCategoryId
  ) || newCategories.find((category) => category.id === DEFAULT_CATEGORY) as Category;

  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Scroll to top when changing categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout
      categories={newCategories}
      selectedCategory={selectedCategoryId}
      onSelectCategory={handleSelectCategory}
    >
      <VideoGrid
        videos={selectedCategory?.videos || []}
        categoryName={selectedCategory?.name || ''}
        loading={loading}
      />
    </Layout>
  );
}

export default App;