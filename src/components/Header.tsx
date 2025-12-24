// src/components/Header.tsx
'use client';

import SearchBar from './SearchBar';
import FilterMenu from './FilterMenu';
import { FiMenu, FiX } from 'react-icons/fi';
import { Drawer } from 'vaul';
import { useMediaQuery } from '../hooks/useMediaQuery';

type HeaderProps = {
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  selectedYears: number[];
  onYearChange: (year: number, isChecked: boolean) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, isChecked: boolean) => void;
  onResetFilters: () => void;
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
  onResetFilters,
  searchQuery,
  setSearchQuery
}: HeaderProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const totalActiveFilters = selectedCategories.length + selectedYears.length + selectedStatuses.length;

  return (
    <Drawer.Root direction={isDesktop ? 'left' : 'bottom'}>
      <header className="fixed top-0 left-0 z-[1000] w-full p-4">
        {/* ... (header content remains same) ... */}
        <div className="flex items-center gap-2">
          <Drawer.Trigger asChild>
            <button
              id="filter-toggle"
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
          <div id="search-container">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </header>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[1000]" />
        <Drawer.Content
          className={`
            fixed z-[1001] flex flex-col bg-zinc-50 dark:bg-gray-900 shadow-2xl transition-colors outline-none
            ${isDesktop
              ? 'bottom-0 left-0 mt-24 h-full w-80 rounded-r-2xl'
              : 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[20px] isolate'
            }
          `}
        >
          {/* Mobile Drag Handle */}
          {!isDesktop && (
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-gray-700/50 mb-1" />
          )}

          <div className={`flex items-center justify-between border-b border-zinc-200 dark:border-gray-700 p-4 transition-colors ${isDesktop ? 'bg-white dark:bg-gray-800 rounded-tr-2xl' : 'bg-zinc-50 dark:bg-gray-900 rounded-t-2xl'}`}>
            <div className="flex items-center gap-3">
              <Drawer.Title className="text-xl font-semibold text-zinc-900 dark:text-white">
                Filters
              </Drawer.Title>
              {totalActiveFilters > 0 && (
                <button
                  onClick={onResetFilters}
                  className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-2 py-1 rounded-md transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <Drawer.Close asChild>
              <button className="rounded-xl p-2 hover:bg-zinc-200 dark:hover:bg-gray-700 transition-colors">
                <FiX className="h-6 w-6 text-zinc-500 dark:text-gray-300" />
              </button>
            </Drawer.Close>
          </div>
          <div className="overflow-auto flex-1">
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
