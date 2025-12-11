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
  searchQuery: string;
};

const ClientOnlyMap = ({ selectedCategories, searchQuery }: ClientOnlyMapProps) => {
  return <Map selectedCategories={selectedCategories} searchQuery={searchQuery} />;
};

export default ClientOnlyMap;
