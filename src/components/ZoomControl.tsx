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
    <div className="flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors hover:bg-zinc-100 dark:hover:bg-gray-700 active:bg-zinc-200 dark:active:bg-gray-600"
        aria-label="Zoom in"
      >
        <FiPlus className="h-5 w-5 text-zinc-500 dark:text-gray-300" />
      </button>
      <button
        onClick={handleZoomOut}
        className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors hover:bg-zinc-100 dark:hover:bg-gray-700 active:bg-zinc-200 dark:active:bg-gray-600"
        aria-label="Zoom out"
      >
        <FiMinus className="h-5 w-5 text-zinc-500 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default ZoomControl;
