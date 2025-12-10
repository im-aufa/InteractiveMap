// src/context/MapContext.tsx
'use client';

import { createContext, useState, ReactNode } from 'react';
import type { Map as LeafletMap } from 'leaflet';

// Define the shape of the context data
interface MapContextType {
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
}

// Create the context with a default value
export const MapContext = createContext<MapContextType | null>(null);

// Create a provider component
export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<LeafletMap | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};
