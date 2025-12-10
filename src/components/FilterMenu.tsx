// src/components/FilterMenu.tsx
'use client';

import { FiX } from 'react-icons/fi';

type FilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FilterMenu = ({ isOpen, onClose }: FilterMenuProps) => {
  return (
    <div
      className={`fixed top-0 right-0 z-[1001] h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100">
          <FiX className="h-6 w-6 text-zinc-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-zinc-700">Category</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            <span className="ml-2">Historical Sites</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            <span className="ml-2">Natural Parks</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            <span className="ml-2">Museums</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
