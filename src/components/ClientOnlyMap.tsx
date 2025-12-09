'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('./Map'),
  { 
    loading: () => <p>A map is loading</p>,
    ssr: false 
  }
);

const ClientOnlyMap = () => {
  return <Map />;
};

export default ClientOnlyMap;
