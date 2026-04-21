// src/components/LocateControl.tsx
'use client';

import { useState, useContext } from 'react';
import { MapContext } from '../context/MapContext';
import { FiNavigation } from 'react-icons/fi';
import L from 'leaflet';

const LocateControl = () => {
  const { map } = useContext(MapContext)!;
  const [isLocating, setIsLocating] = useState(false);
  const [locationMarker, setLocationMarker] = useState<L.CircleMarker | null>(null);
  const [accuracyCircle, setAccuracyCircle] = useState<L.Circle | null>(null);

  const handleLocate = () => {
    if (!map || isLocating) return;

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const latlng = L.latLng(latitude, longitude);

        // Remove previous markers
        if (locationMarker) locationMarker.remove();
        if (accuracyCircle) accuracyCircle.remove();

        // Add accuracy circle
        const circle = L.circle(latlng, {
          radius: accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);

        // Add location dot
        const marker = L.circleMarker(latlng, {
          radius: 8,
          color: '#fff',
          fillColor: '#3b82f6',
          fillOpacity: 1,
          weight: 3,
        }).addTo(map);

        setAccuracyCircle(circle);
        setLocationMarker(marker);

        // Fly to location
        map.flyTo(latlng, 15, { duration: 1.5 });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location permission denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out. Please try again.');
            break;
          default:
            alert('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <button
      onClick={handleLocate}
      className={`h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors hover:bg-zinc-100 dark:hover:bg-gray-700 active:bg-zinc-200 dark:active:bg-gray-600 ${isLocating ? 'animate-pulse' : ''}`}
      aria-label="My location"
      title="My location"
      disabled={isLocating}
    >
      <FiNavigation className={`h-5 w-5 ${isLocating ? 'text-blue-500' : 'text-zinc-500 dark:text-gray-300'}`} />
    </button>
  );
};

export default LocateControl;
