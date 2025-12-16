// src/components/HoverMarker.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Program } from '../data/programs';
import CustomPopup from './CustomPopup';

type HoverMarkerProps = {
  program: Program;
  icon: L.DivIcon;
};

export const HoverMarker = ({ program, icon }: HoverMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    // Attach ID for clustering identification
    (marker as any).programId = program.id;

    const openPopup = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      marker.openPopup();
    };

    const closePopup = () => {
      timerRef.current = setTimeout(() => {
        marker.closePopup();
      }, 100); // A short delay
    };

    marker.on('mouseover', openPopup);
    marker.on('mouseout', closePopup);

    // This is the key: we wait for the popup to open, then attach listeners to IT.
    marker.on('popupopen', () => {
      const popupElement = marker.getPopup()?.getElement();
      if (popupElement) {
        popupElement.addEventListener('mouseenter', openPopup); // Keep it open
        popupElement.addEventListener('mouseleave', closePopup); // Close when leaving popup
      }
    });

    // Cleanup all event listeners
    return () => {
      marker.off('mouseover', openPopup);
      marker.off('mouseout', closePopup);
      marker.off('popupopen'); // Clean up the popup open listener as well
      // Note: we don't need to manually remove listeners from the popup element
      // because the element gets destroyed when the popup closes.
    };
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={[program.location.lat, program.location.lng]}
      icon={icon}
    >
      <Popup>
        <CustomPopup program={program} />
      </Popup>
    </Marker>
  );
};
