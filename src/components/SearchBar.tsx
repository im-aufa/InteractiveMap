// src/components/SearchBar.tsx
'use client';

import { FiSearch } from 'react-icons/fi';

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a place..."
        className="w-64 rounded-xl border border-zinc-300 bg-white py-2 pl-10 pr-4 text-zinc-800 shadow-sm transition-all duration-300 focus:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
    </div>
  );
};

export default SearchBar;
