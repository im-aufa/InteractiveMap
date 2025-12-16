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
      <div className="flex flex-col gap-8 p-4 bg-zinc-50 dark:bg-gray-900 transition-colors h-full overflow-y-auto">

        {/* Category Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider">Categories</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
              {selectedCategories.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config?.icon || GraduationCap;
              const count = getCategoryCount(category);
              const isDisabled = count === 0;
              const isSelected = selectedCategories.includes(category);

              // Dynamic style for active state
              const activeStyle = isSelected ? {
                backgroundColor: `${config.color}15`, // 15 = ~8% opacity
                borderColor: config.color,
              } : {};

              return (
                <button
                  key={category}
                  onClick={() => !isDisabled && onCategoryChange(category, !isSelected)}
                  disabled={isDisabled}
                  style={activeStyle}
                  className={`
                    group relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200
                    ${isDisabled ? 'opacity-40 cursor-not-allowed border-transparent bg-gray-50 dark:bg-gray-800/50' : ''}
                    ${isSelected
                      ? 'border-transparent shadow-sm'
                      : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm'
                    }
                  `}
                >
                  <div
                    className={`nav-icon-box p-2 rounded-lg transition-colors ${isSelected ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'}`}
                    style={{ color: isSelected ? config.color : '#6B7280' }}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                      {category}
                    </div>
                    {isSelected && (
                      <div className="text-[10px] font-medium opacity-80" style={{ color: config.color }}>
                        Active
                      </div>
                    )}
                  </div>

                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${isSelected ? 'bg-white/50 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Year Section (Pills) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider">Year</h3>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => {
              const textYear = year.toString(); // FilterMenu actually receives years as Numbers based on props
              const yearCount = programs.filter(p => p.year === year).length;
              const isSelected = selectedYears.includes(year);

              return (
                <button
                  key={year}
                  onClick={() => onYearChange(year, !isSelected)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm
                    ${isSelected
                      ? 'bg-blue-600 text-white shadow-blue-200 dark:shadow-none'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-inset ring-gray-200 dark:ring-gray-700'
                    }
                  `}
                >
                  {year} <span className={`ml-1 text-[10px] ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>({yearCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Section (Grid) */}
        <div className="space-y-3 pb-8">
          <h3 className="text-xs font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider">Status</h3>
          <div className="grid grid-cols-1 gap-2">
            {statuses.map((status) => {
              const statusCount = programs.filter(p => p.status === status).length;
              const isSelected = selectedStatuses.includes(status);

              let activeClass = '';
              if (status === 'Completed') activeClass = 'bg-green-600 text-white ring-green-600';
              else if (status === 'In Progress') activeClass = 'bg-blue-600 text-white ring-blue-600';
              else activeClass = 'bg-gray-600 text-white ring-gray-600';

              return (
                <button
                  key={status}
                  onClick={() => onStatusChange(status, !isSelected)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm
                    ${isSelected
                      ? activeClass
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-inset ring-gray-200 dark:ring-gray-700'
                    }
                  `}
                >
                  <span>{status}</span>
                  <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;
