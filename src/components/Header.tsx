// src/components/Header.tsx
'use client';

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

  const totalActiveFilters = selectedCategories.length + selectedYears.length + selectedStatuses.length;

  return (
    <Drawer.Root direction="left">
      <header className="absolute top-0 left-0 z-[1000] w-full p-4">
        <div className="flex items-center gap-2">
          <Drawer.Trigger asChild>
            <button
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:scale-105 relative"
              aria-label="Open filters menu"
            >
              <FiMenu className="h-5 w-5 text-zinc-500 dark:text-gray-300" />
              {totalActiveFilters > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                  {totalActiveFilters}
                </span>
              )}
            </button>
          </Drawer.Trigger>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </header>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[1000]" />
        <Drawer.Content className="fixed bottom-0 left-0 mt-24 flex h-full w-80 flex-col rounded-r-2xl bg-zinc-50 dark:bg-gray-900 z-[1001] shadow-2xl transition-colors">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-tr-2xl transition-colors">
            <Drawer.Title className="text-xl font-semibold text-zinc-900 dark:text-white">
              Filters {totalActiveFilters > 0 && <span className="text-blue-600">({totalActiveFilters})</span>}
            </Drawer.Title>
            <Drawer.Close asChild>
              <button className="rounded-xl p-2 hover:bg-zinc-200 dark:hover:bg-gray-700 transition-colors">
                <FiX className="h-6 w-6 text-zinc-500 dark:text-gray-300" />
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
