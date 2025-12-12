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
    <div className="w-56">
      <img src={program.images[0]} alt={program.name} className="h-32 w-full rounded-xl object-cover" />
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>
            {program.status}
          </span>
          <span className="text-xs text-zinc-500">{program.year}</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900">{program.name}</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Click the button below to see more details about this program.
        </p>
        <Link href={`/program/${program.id}`} legacyBehavior>
          <a
            className="mt-3 inline-block w-full rounded-xl bg-blue-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View Details
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CustomPopup;
