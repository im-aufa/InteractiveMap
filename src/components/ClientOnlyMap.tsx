'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('./Map'),
  { 
    loading: () => <p>A map is loading</p>,
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
