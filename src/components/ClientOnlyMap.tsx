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
};

const ClientOnlyMap = ({ selectedCategories }: ClientOnlyMapProps) => {
  return <Map selectedCategories={selectedCategories} />;
};

export default ClientOnlyMap;
