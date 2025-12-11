// src/components/Header.tsx
'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import FilterMenu from './FilterMenu';
import { FiMenu } from 'react-icons/fi';
import Overlay from './Overlay'; // Import the new Overlay component

type HeaderProps = {
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  selectedYears: number[];
  onYearChange: (year: number, isChecked: boolean) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, isChecked: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const Header = ({ 
  selectedCategories, 
  onCategoryChange, 
  selectedYears,
  onYearChange,
  selectedStatuses,
  onStatusChange,
  searchQuery, 
  setSearchQuery 
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Overlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <header className="absolute top-0 left-0 z-[1000] w-full p-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform hover:scale-105"
            aria-label="Open filters menu"
          >
            <FiMenu className="h-5 w-5 text-zinc-500" />
          </button>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </header>

      <FilterMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
        selectedYears={selectedYears}
        onYearChange={onYearChange}
        selectedStatuses={selectedStatuses}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

export default Header;
