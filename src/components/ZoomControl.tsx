// src/components/ZoomControl.tsx
'use client';

import { useContext } from 'react';
import { MapContext } from '../context/MapContext';
import { FiPlus, FiMinus } from 'react-icons/fi';

const ZoomControl = () => {
  const { map } = useContext(MapContext)!;

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleZoomIn}
        className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-zinc-100 active:bg-zinc-200"
        aria-label="Zoom in"
      >
        <FiPlus className="h-5 w-5" />
      </button>
      <button
        onClick={handleZoomOut}
        className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-zinc-100 active:bg-zinc-200"
        aria-label="Zoom out"
      >
        <FiMinus className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ZoomControl;
