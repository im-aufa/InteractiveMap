'use client';

import ClientOnlyMap from './../components/ClientOnlyMap';
import Header from './../components/Header';
import { MapProvider } from './../context/MapContext';
import ZoomControl from './../components/ZoomControl';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  return (
    <MapProvider>
      <main className="relative h-screen w-screen">
        <ClientOnlyMap 
          selectedCategories={selectedCategories} 
          searchQuery={debouncedSearchQuery} 
        />
        <Header 
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="absolute bottom-4 right-4 z-[1000]">
          <ZoomControl />
        </div>
      </main>
    </MapProvider>
  );
}
