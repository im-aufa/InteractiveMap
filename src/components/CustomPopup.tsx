// src/components/CustomPopup.tsx
import { Program } from '../data/programs'; // Import the Program type
import Link from 'next/link';

type CustomPopupProps = {
  program: Program;
};

const CustomPopup = ({ program }: CustomPopupProps) => {
  // Status badge styling (Unified with Detail Page & Cluster)
  const statusColors = {
    'Completed': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-500/30',
    'Planned': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-100 dark:border-gray-500/30',
  };

  const statusKey = program.status as keyof typeof statusColors;
  const statusClass = statusColors[statusKey] || statusColors['Planned'];

  return (
    <div className="w-56 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-colors">
      <img src={program.images[0]} alt={program.name} className="h-32 w-full object-cover" />
      <div className="p-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug mb-2 line-clamp-2">
          {program.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusClass}`}>
            {program.status}
          </span>
          <span className="text-xs text-zinc-500 dark:text-gray-400">{program.year}</span>
        </div>
        <Link
          href={`/program/${program.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-xl transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation(); // Prevent map click when clicking button
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CustomPopup;
