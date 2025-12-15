// src/components/CustomPopup.tsx
import { Program } from '../data/programs'; // Import the Program type
import Link from 'next/link';

type CustomPopupProps = {
  program: Program;
};

const CustomPopup = ({ program }: CustomPopupProps) => {
  // Status badge color
  const statusColor = program.status === 'Completed'
    ? 'bg-green-100 text-green-800'
    : program.status === 'In Progress'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div className="w-56 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-colors">
      <img src={program.images[0]} alt={program.name} className="h-32 w-full object-cover" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>
            {program.status}
          </span>
          <span className="text-xs text-zinc-500 dark:text-gray-400">{program.year}</span>
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight mb-2 line-clamp-2">
          {program.name}
        </h3>
        <Link
          href={`/program/${program.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded transition-colors duration-200"
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
