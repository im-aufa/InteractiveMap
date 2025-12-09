'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import CustomPopup from './CustomPopup';

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      const marker = L.marker([51.5, -0.09]).addTo(mapInstance.current);

      // --- Start of new popup logic ---
      const popupContainer = document.createElement('div');
      const root = createRoot(popupContainer);
      
      root.render(
        <CustomPopup 
          placeName="Central London"
          imageUrl="https://images.unsplash.com/photo-1529655683826-1c21ef24b5b3?q=80&w=2850&auto=format&fit=crop"
          detailsUrl="https://en.wikipedia.org/wiki/Central_London"
        />
      );

      marker.bindPopup(popupContainer).openPopup();
      // --- End of new popup logic ---
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-screen" />;
};

export default Map;
