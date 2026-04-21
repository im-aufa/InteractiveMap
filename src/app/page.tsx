'use client';

import { useContext, useCallback } from 'react';
import ClientOnlyMap from './../components/ClientOnlyMap';
import Header from './../components/Header';
import { MapProvider, MapContext } from './../context/MapContext';
import ZoomControl from './../components/ZoomControl';
import LocateControl from './../components/LocateControl';
import TileLayerToggle from './../components/TileLayerToggle';
import ThemeToggle from './../components/ThemeToggle';
import HelpButton from './../components/HelpButton';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Program } from '../data/programs';

// Inner component that has access to MapContext
function HomeContent() {
  const { map } = useContext(MapContext)!;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tileMode, setTileMode] = useState<'street' | 'satellite'>('street');
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

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedStatuses([]);
  };

  const handleProgramSelect = useCallback((program: Program) => {
    if (map) {
      map.flyTo([program.location.lat, program.location.lng], 16, {
        duration: 1.5,
      });
    }
  }, [map]);

  const toggleTileMode = () => {
    setTileMode(prev => prev === 'street' ? 'satellite' : 'street');
  };

  return (
    <main className="relative h-screen w-screen">
      <ClientOnlyMap
        selectedCategories={selectedCategories}
        selectedYears={selectedYears}
        selectedStatuses={selectedStatuses}
        searchQuery={debouncedSearchQuery}
        tileMode={tileMode}
      />
      <Header
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        selectedYears={selectedYears}
        onYearChange={handleYearChange}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        onResetFilters={resetFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onProgramSelect={handleProgramSelect}
      />
      <ThemeToggle />
      <div className="fixed bottom-4 right-4 z-[1000] flex flex-col gap-2 max-h-[calc(100vh-8rem)] max-h-[calc(100dvh-8rem)]">
        <TileLayerToggle tileMode={tileMode} onToggle={toggleTileMode} />
        <LocateControl />
        <ZoomControl />
      </div>
      <HelpButton />
    </main>
  );
}

export default function Home() {
  return (
    <MapProvider>
      <HomeContent />
    </MapProvider>
  );
}
