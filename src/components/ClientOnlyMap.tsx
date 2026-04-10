'use client';

import dynamic from 'next/dynamic';
import LottiePlayer from './ui/LottiePlayer';
import loadingAnimation from '../../public/lottie/loading.json';

const Map = dynamic(
  () => import('./Map'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-900">
        <LottiePlayer animationData={loadingAnimation} className="w-32 h-32" />
      </div>
    ),
    ssr: false
  }
);

type ClientOnlyMapProps = {
  selectedCategories: string[];
  selectedYears: number[];
  selectedStatuses: string[];
  searchQuery: string;
};

const ClientOnlyMap = ({ selectedCategories, selectedYears, selectedStatuses, searchQuery }: ClientOnlyMapProps) => {
  return <Map
    selectedCategories={selectedCategories}
    selectedYears={selectedYears}
    selectedStatuses={selectedStatuses}
    searchQuery={searchQuery}
  />;
};

export default ClientOnlyMap;
