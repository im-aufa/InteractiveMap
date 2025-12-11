'use client';

import ClientOnlyMap from './../components/ClientOnlyMap';
import Header from './../components/Header';
import { MapProvider } from './../context/MapContext';
import ZoomControl from './../components/ZoomControl';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleYearChange = (year: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedYears([...selectedYears, year]);
    } else {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    }
  };

  const handleStatusChange = (status: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedStatuses([...selectedStatuses, status]);
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    }
  };

  return (
    <MapProvider>
      <main className="relative h-screen w-screen">
        <ClientOnlyMap 
          selectedCategories={selectedCategories} 
          selectedYears={selectedYears}
          selectedStatuses={selectedStatuses}
          searchQuery={debouncedSearchQuery} 
        />
        <Header 
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedYears={selectedYears}
          onYearChange={handleYearChange}
          selectedStatuses={selectedStatuses}
          onStatusChange={handleStatusChange}
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
