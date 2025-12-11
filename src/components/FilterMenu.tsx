// src/components/FilterMenu.tsx
'use client';

import { FiX } from 'react-icons/fi';
import { categories, years, statuses } from '../data/programs'; // Import categories, years, and statuses

type FilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  selectedYears: number[];
  onYearChange: (year: number, isChecked: boolean) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, isChecked: boolean) => void;
};

const FilterMenu = ({ 
  isOpen, 
  onClose, 
  selectedCategories, 
  onCategoryChange,
  selectedYears,
  onYearChange,
  selectedStatuses,
  onStatusChange,
}: FilterMenuProps) => {
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
      <div className="flex flex-col gap-6 p-4"> {/* Use flex-col and gap for sections */}
        <div className="pb-4 border-b border-zinc-200"> {/* Section for Category */}
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

        <div className="pb-4 border-b border-zinc-200"> {/* Section for Year */}
          <h3 className="mb-3 font-semibold text-zinc-600">Year</h3>
          <div className="flex flex-col gap-3">
            {years.map((year) => (
              <label key={year} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                  checked={selectedYears.includes(year)}
                  onChange={(e) => onYearChange(year, e.target.checked)}
                />
                <span className="ml-3 text-zinc-700">{year}</span>
              </label>
            ))}
          </div>
        </div>

        <div> {/* Section for Status (no bottom border for the last section) */}
          <h3 className="mb-3 font-semibold text-zinc-600">Status</h3>
          <div className="flex flex-col gap-3">
            {statuses.map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                  checked={selectedStatuses.includes(status)}
                  onChange={(e) => onStatusChange(status, e.target.checked)}
                />
                <span className="ml-3 text-zinc-700">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
