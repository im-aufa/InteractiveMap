// src/components/Header.tsx
'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import FilterMenu from './FilterMenu';
import { FiMenu, FiX } from 'react-icons/fi';
import { Drawer } from 'vaul';

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

  return (
    <Drawer.Root direction="left">
      <header className="absolute top-0 left-0 z-[1000] w-full p-4">
        <div className="flex items-center gap-2">
          <Drawer.Trigger asChild>
            <button 
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform hover:scale-105"
              aria-label="Open filters menu"
            >
              <FiMenu className="h-5 w-5 text-zinc-500" />
            </button>
          </Drawer.Trigger>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </header>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[1000]" />
        <Drawer.Content className="fixed bottom-0 left-0 mt-24 flex h-full w-80 flex-col rounded-t-[10px] bg-zinc-50 z-[1001] shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4">
            <h2 className="text-xl font-semibold text-zinc-900">Filters</h2>
            <Drawer.Close asChild>
              <button className="rounded-xl p-2 hover:bg-zinc-200">
                <FiX className="h-6 w-6 text-zinc-500" />
              </button>
            </Drawer.Close>
          </div>
          <div className="overflow-auto">
            <FilterMenu 
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
              selectedYears={selectedYears}
              onYearChange={onYearChange}
              selectedStatuses={selectedStatuses}
              onStatusChange={onStatusChange}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Header;
