// src/components/FilterMenu.tsx
'use client';

import { categories, years, statuses } from '../data/programs';

type FilterMenuProps = {
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  selectedYears: number[];
  onYearChange: (year: number, isChecked: boolean) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, isChecked: boolean) => void;
};

const FilterMenu = ({ 
  selectedCategories, 
  onCategoryChange,
  selectedYears,
  onYearChange,
  selectedStatuses,
  onStatusChange,
}: FilterMenuProps) => {
  return (
    <>
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
    </>
  );
};

export default FilterMenu;
