// src/components/FilterMenu.tsx
'use client';

import { categories, years, statuses, programs } from '../data/programs';
import { GraduationCap, Heart, Cpu, Leaf, Palette, Palmtree, Users, Building, Sprout, Waves } from 'lucide-react';

type FilterMenuProps = {
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  selectedYears: number[];
  onYearChange: (year: number, isChecked: boolean) => void;
  selectedStatuses: string[];
  onStatusChange: (status: string, isChecked: boolean) => void;
};

// Category icons and colors mapping
const categoryConfig = {
  'Pendidikan': { icon: GraduationCap, color: '#3B82F6' },
  'Kesehatan': { icon: Heart, color: '#EF4444' },
  'Teknologi': { icon: Cpu, color: '#8B5CF6' },
  'Lingkungan': { icon: Leaf, color: '#10B981' },
  'Ekonomi Kreatif': { icon: Palette, color: '#F59E0B' },
  'Pariwisata': { icon: Palmtree, color: '#14B8A6' },
  'Pemberdayaan Masyarakat': { icon: Users, color: '#EC4899' },
  'Infrastruktur': { icon: Building, color: '#6366F1' },
  'Pertanian': { icon: Sprout, color: '#84CC16' },
  'Kelautan': { icon: Waves, color: '#06B6D4' },
};

const FilterMenu = ({
  selectedCategories,
  onCategoryChange,
  selectedYears,
  onYearChange,
  selectedStatuses,
  onStatusChange,
}: FilterMenuProps) => {

  // Calculate program counts per category
  const getCategoryCount = (category: string) => {
    return programs.filter(p => p.category === category).length;
  };

  // Clear all filters
  const clearAllFilters = () => {
    selectedCategories.forEach(cat => onCategoryChange(cat, false));
    selectedYears.forEach(year => onYearChange(year, false));
    selectedStatuses.forEach(status => onStatusChange(status, false));
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedYears.length > 0 || selectedStatuses.length > 0;

  return (
    <>
      <div className="flex flex-col gap-6 p-4 bg-zinc-50 dark:bg-gray-900 transition-colors">
        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Clear All Filters
          </button>
        )}

        {/* Category Section */}
        <div className="pb-4 border-b border-zinc-200 dark:border-gray-700">
          <h3 className="mb-4 text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wide">Category</h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config?.icon || GraduationCap;
              const count = getCategoryCount(category);
              const isDisabled = count === 0;

              return (
                <label
                  key={category}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => onCategoryChange(category, e.target.checked)}
                    disabled={isDisabled}
                  />
                  <Icon
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: config?.color || '#6B7280' }}
                  />
                  <span className="flex-1 text-sm text-zinc-700 dark:text-gray-300 font-medium">{category}</span>
                  <span className="text-xs text-zinc-500 dark:text-gray-400 font-semibold">({count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Year Section */}
        <div className="pb-4 border-b border-zinc-200 dark:border-gray-700">
          <h3 className="mb-4 text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wide">Year</h3>
          <div className="flex flex-col gap-2">
            {years.map((year) => {
              const yearCount = programs.filter(p => p.year === year).length;

              return (
                <label key={year} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-600"
                    checked={selectedYears.includes(year)}
                    onChange={(e) => onYearChange(year, e.target.checked)}
                  />
                  <span className="flex-1 text-sm text-zinc-700 dark:text-gray-300 font-medium">{year}</span>
                  <span className="text-xs text-zinc-500 dark:text-gray-400 font-semibold">({yearCount})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Status Section */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wide">Status</h3>
          <div className="flex flex-col gap-2">
            {statuses.map((status) => {
              const statusCount = programs.filter(p => p.status === status).length;
              const statusColor = status === 'Completed'
                ? 'text-green-600'
                : status === 'In Progress'
                  ? 'text-blue-600'
                  : 'text-gray-600';
              const statusIcon = status === 'Completed'
                ? '✓'
                : status === 'In Progress'
                  ? '◐'
                  : '○';

              return (
                <label key={status} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-600"
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => onStatusChange(status, e.target.checked)}
                  />
                  <span className={`text-base ${statusColor}`}>{statusIcon}</span>
                  <span className="flex-1 text-sm text-zinc-700 dark:text-gray-300 font-medium">{status}</span>
                  <span className="text-xs text-zinc-500 dark:text-gray-400 font-semibold">({statusCount})</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;
