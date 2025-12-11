'use client';

import { useContext, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import CustomPopup from './CustomPopup';
import { MapContext } from '../context/MapContext';
import { programs } from '../data/programs'; // Import programs data
import ReactDOMServer from 'react-dom/server';
import { Landmark, Mountain, University, GanttChartSquare as CulturalSpot } from 'lucide-react'; // Import Lucide icons

// --- Create a mapping for category icons and colors ---
const categoryIcons = {
  'Historical Sites': { icon: Landmark, color: '#8B5CF6' }, // Purple
  'Natural Parks': { icon: Mountain, color: '#22C55E' }, // Green
  'Museums': { icon: University, color: '#F97316' }, // Orange
  'Cultural Spots': { icon: CulturalSpot, color: '#3B82F6' }, // Blue
};

// --- Function to create a divIcon for a category ---
const getIconForCategory = (category: keyof typeof categoryIcons) => {
  const IconComponent = categoryIcons[category]?.icon || Landmark; // Default to Landmark
  const iconColor = categoryIcons[category]?.color || '#6B7280'; // Default to gray

  const iconHtml = ReactDOMServer.renderToString(
    <IconComponent color={iconColor} size={24} />
  );

  return new L.DivIcon({
    html: `<div style="background-color: white; border-radius: 50%; padding: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">${iconHtml}</div>`,
    className: 'custom-div-icon', // Keep this class empty, we style inline
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};


// Helper component to connect react-leaflet's map instance to our context
const MapContextProvider = () => {
  const { setMap } = useContext(MapContext)!;
  const map = useMap();

  useEffect(() => {
    setMap(map);
    return () => {
      setMap(null);
    };
  }, [map, setMap]);

  return null;
};

type MapProps = {
  selectedCategories: string[];
  searchQuery: string;
};

// Helper component to handle map events like pan/zoom
const MapEvents = ({ filteredPrograms, searchQuery }: { filteredPrograms: typeof programs, searchQuery: string }) => {
  const map = useMap();

  useEffect(() => {
    if (filteredPrograms.length === 1 && searchQuery.trim() !== '') {
      const program = filteredPrograms[0];
      map.flyTo([program.location.lat, program.location.lng], 15);
    }
  }, [filteredPrograms, searchQuery, map]);

  return null; // This component does not render anything
};

const Map = ({ selectedCategories, searchQuery }: MapProps) => {
  const batamPosition: L.LatLngExpression = [1.14937, 104.02491];
  const indonesiaBounds: L.LatLngBoundsLiteral = [[-11.2085669, 94.7717124], [6.2744496, 141.0194444]];

  // Combine filters: categories and search query
  const filteredPrograms = programs
    .filter(program => {
      // Category filter
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(program.category);
    })
    .filter(program => {
      // Search query filter (case-insensitive)
      if (searchQuery.trim() === '') return true;
      return program.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <MapContainer
      center={batamPosition}
      zoom={13}
      minZoom={5}
      maxBounds={indonesiaBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {filteredPrograms.map((program) => (
        <Marker 
          key={program.id} 
          position={[program.location.lat, program.location.lng]} 
          icon={getIconForCategory(program.category)}
        >
          <Popup>
            <CustomPopup program={program} />
          </Popup>
        </Marker>
      ))}

      {/* This component bridges react-leaflet's context with our custom context */}
      <MapContextProvider />
      {/* This component handles map side effects like panning and zooming */}
      <MapEvents filteredPrograms={filteredPrograms} searchQuery={searchQuery} />
    </MapContainer>
  );
};

export default Map;

