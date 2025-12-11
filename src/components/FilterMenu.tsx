// src/components/FilterMenu.tsx
'use client';

import { FiX } from 'react-icons/fi';
import { categories } from '../data/programs'; // Import categories

type FilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
};

const FilterMenu = ({ isOpen, onClose, selectedCategories, onCategoryChange }: FilterMenuProps) => {
  return (
    <div
      className={`fixed top-0 left-0 z-[1001] h-full w-80 transform bg-zinc-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h2 className="text-xl font-semibold text-zinc-900">Filters</h2>
        <button onClick={onClose} className="rounded-xl p-2 hover:bg-zinc-200">
          <FiX className="h-6 w-6 text-zinc-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-3 font-semibold text-zinc-600">Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                checked={selectedCategories.includes(category)}
                onChange={(e) => onCategoryChange(category, e.target.checked)}
              />
              <span className="ml-3 text-zinc-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
