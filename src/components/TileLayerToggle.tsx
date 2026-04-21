// src/components/TileLayerToggle.tsx
'use client';

import { FiLayers } from 'react-icons/fi';

type TileLayerToggleProps = {
  tileMode: 'street' | 'satellite';
  onToggle: () => void;
};

const TileLayerToggle = ({ tileMode, onToggle }: TileLayerToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`h-10 w-10 flex items-center justify-center rounded-xl border shadow-sm transition-colors ${
        tileMode === 'satellite'
          ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
          : 'border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-zinc-100 dark:hover:bg-gray-700'
      } active:bg-zinc-200 dark:active:bg-gray-600`}
      aria-label={tileMode === 'street' ? 'Switch to satellite view' : 'Switch to street view'}
      title={tileMode === 'street' ? 'Satellite view' : 'Street view'}
    >
      <FiLayers className={`h-5 w-5 ${
        tileMode === 'satellite'
          ? 'text-blue-500 dark:text-blue-400'
          : 'text-zinc-500 dark:text-gray-300'
      }`} />
    </button>
  );
};

export default TileLayerToggle;
