// src/components/SearchBar.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { programs, Program } from '../data/programs';
import { categoryIcons, CategoryKey } from '../utils/categoryIcons';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProgramSelect?: (program: Program) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery, onProgramSelect }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on query
  const suggestions = searchQuery.trim().length > 0
    ? programs.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const showDropdown = isOpen && suggestions.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when suggestions change
  useEffect(() => {
    setHighlightIndex(-1);
  }, [searchQuery]);

  const handleSelect = useCallback((program: Program) => {
    setSearchQuery(program.name);
    setIsOpen(false);
    onProgramSelect?.(program);
  }, [setSearchQuery, onProgramSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Get category color for badge
  const getCategoryColor = (category: string) => {
    const catKey = category as CategoryKey;
    return categoryIcons[catKey]?.color || '#6B7280';
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a place..."
        className="w-64 rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-10 pr-8 text-zinc-900 dark:text-white shadow-sm transition-all duration-300 placeholder:text-zinc-500 dark:placeholder:text-gray-400 focus:w-72 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls="search-suggestions"
      />
      <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 dark:text-gray-400" />

      {/* Clear button */}
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-gray-500 hover:text-zinc-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-[1100] py-1"
        >
          {suggestions.map((program, index) => (
            <li
              key={program.id}
              role="option"
              aria-selected={highlightIndex === index}
              onClick={() => handleSelect(program)}
              onMouseEnter={() => setHighlightIndex(index)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                highlightIndex === index
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-zinc-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  {program.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-gray-400 truncate">
                  {program.location.address}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  color: getCategoryColor(program.category),
                  backgroundColor: `${getCategoryColor(program.category)}15`,
                }}
              >
                {program.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
