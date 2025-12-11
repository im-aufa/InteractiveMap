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
  const popupRef = useRef<L.Popup>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseOver = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    markerRef.current?.openPopup();
  };

  const handleMouseOut = () => {
    timerRef.current = setTimeout(() => {
      markerRef.current?.closePopup();
    }, 200); // 200ms delay
  };

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.on('mouseover', handleMouseOver);
      marker.on('mouseout', handleMouseOut);
    }

    const popup = popupRef.current;
    if (popup) {
      popup.on('mouseover', handleMouseOver); // When mouse enters the popup, cancel the close timer
      popup.on('mouseout', handleMouseOut); // When mouse leaves the popup, start the close timer
    }

    // Cleanup event listeners
    return () => {
      if (marker) {
        marker.off('mouseover', handleMouseOver);
        marker.off('mouseout', handleMouseOut);
      }
      if (popup) {
        popup.off('mouseover', handleMouseOver);
        popup.off('mouseout', handleMouseOut);
      }
    };
  }, [markerRef, popupRef]);

  return (
    <Marker 
      ref={markerRef}
      key={program.id} 
      position={[program.location.lat, program.location.lng]} 
      icon={icon}
    >
      <Popup ref={popupRef}>
        <CustomPopup program={program} />
      </Popup>
    </Marker>
  );
};
