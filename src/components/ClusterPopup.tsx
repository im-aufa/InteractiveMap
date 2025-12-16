import { Program } from '../data/programs';
import { categoryIcons, CategoryKey } from '../utils/categoryIcons';
import { GraduationCap, ChevronRight } from 'lucide-react';

type ClusterPopupProps = {
    programs: Program[];
};

const ClusterPopup = ({ programs }: ClusterPopupProps) => {
    return (
        <div className="min-w-[240px] max-w-[280px] p-3">
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2 pl-1 dark:border-gray-600">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white pr-8 leading-none">
                    {programs.length} Programs Here
                </h3>
            </div>
            <ul className="max-h-[220px] space-y-1.5 overflow-y-auto pr-1">
                {programs.map((program) => {
                    const catKey = program.category as CategoryKey;
                    const IconComponent = categoryIcons[catKey]?.icon || GraduationCap;
                    const iconColor = categoryIcons[catKey]?.color || '#6B7280';

                    const statusColor = program.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30' :
                        program.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-500/30' :
                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-100 dark:border-gray-500/30';

                    return (
                        <li key={program.id}>
                            <a
                                href={`/program/${program.id}`}
                                className="group relative flex items-start gap-3 rounded-xl bg-gray-100/90 p-2.5 transition-all hover:bg-blue-50 hover:shadow-sm dark:bg-gray-700/60 dark:hover:bg-gray-600/80"
                            >
                                {/* Category Icon */}
                                <div
                                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-700 dark:ring-gray-600"
                                >
                                    <IconComponent size={16} color={iconColor} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 pr-4 text-xs font-bold text-gray-800 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                                        {program.name}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600">
                                            {program.year}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                                            {program.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <ChevronRight size={14} className="text-blue-500" />
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ClusterPopup;
