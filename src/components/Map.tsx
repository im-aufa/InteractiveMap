'use client';

import { useEffect, useRef, useContext } from 'react';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import CustomPopup from './CustomPopup';
import { MapContext } from '../context/MapContext';

// --- Point Leaflet to the public folder for icons ---
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});
// --- END of FIX ---

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { setMap } = useContext(MapContext)!;

  // Bounding box for Indonesia: [[south_lat, west_lng], [north_lat, east_lng]]
  const indonesiaBounds: L.LatLngBoundsLiteral = [[-11.2085669, 94.7717124], [6.2744496, 141.0194444]];

  useEffect(() => {
    let mapInstance: L.Map | null = null;
    if (mapRef.current) {
      mapInstance = L.map(mapRef.current, {
        center: [1.14937, 104.02491], // Batam coordinates
        zoom: 13,
        minZoom: 5, // Prevent zooming out too far
        maxBounds: indonesiaBounds, // Restrict view to Indonesia
        maxBoundsViscosity: 1.0, // Prevents dragging outside bounds
        zoomControl: false, // Disable the default zoom control
        attributionControl: false, // Disable the default attribution control
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
      
      setMap(mapInstance); // Save the map instance to the context

      const marker = L.marker([1.14937, 104.02491]).addTo(mapInstance);

      const popupContainer = document.createElement('div');
      const root = createRoot(popupContainer);
      
      root.render(
        <CustomPopup 
          placeName="Batam, Indonesia"
          imageUrl="https://images.unsplash.com/photo-1598466699479-7a710156a5e1?q=80&w=2940&auto=format&fit=crop"
          detailsUrl="https://en.wikipedia.org/wiki/Batam"
        />
      );

      marker.bindPopup(popupContainer);
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMap(null); // Clear the map instance from the context
      }
    };
  }, [setMap]);

  return <div ref={mapRef} className="h-full w-full" />;
};

export default Map;
