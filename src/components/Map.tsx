'use client';

import { useContext, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import CustomPopup from './CustomPopup';
import { MapContext } from '../context/MapContext';
import { programs } from '../data/programs'; // Import programs data
import ReactDOMServer from 'react-dom/server';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { HoverMarker } from './HoverMarker'; // Import the new HoverMarker component
import { GraduationCap, Heart, Cpu, Leaf, Palette, Palmtree, Users, Building, Sprout, Waves } from 'lucide-react'; // P2M Icons
import { useTheme } from '../context/ThemeContext'; // Import theme hook

// --- Create a mapping for P2M category icons and colors ---
const categoryIcons = {
  'Pendidikan': { icon: GraduationCap, color: '#3B82F6' },           // Blue
  'Kesehatan': { icon: Heart, color: '#EF4444' },                    // Red
  'Teknologi': { icon: Cpu, color: '#8B5CF6' },                      // Purple
  'Lingkungan': { icon: Leaf, color: '#10B981' },                    // Green
  'Ekonomi Kreatif': { icon: Palette, color: '#F59E0B' },            // Orange
  'Pariwisata': { icon: Palmtree, color: '#14B8A6' },                // Teal
  'Pemberdayaan Masyarakat': { icon: Users, color: '#EC4899' },      // Pink
  'Infrastruktur': { icon: Building, color: '#6366F1' },             // Indigo
  'Pertanian': { icon: Sprout, color: '#84CC16' },                   // Lime
  'Kelautan': { icon: Waves, color: '#06B6D4' },                     // Cyan
};

// --- Function to create a divIcon for a category ---
const getIconForCategory = (category: keyof typeof categoryIcons, theme: 'light' | 'dark') => {
  const IconComponent = categoryIcons[category]?.icon || GraduationCap; // Default to GraduationCap
  const iconColor = categoryIcons[category]?.color || '#6B7280'; // Default to gray

  // Theme-aware background and border
  const bgColor = theme === 'dark' ? '#1f2937' : 'white'; // gray-800 for dark
  const borderColor = theme === 'dark' ? '#374151' : 'rgba(0,0,0,0.05)'; // gray-700 for dark
  const shadowColor = theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';

  const iconHtml = ReactDOMServer.renderToString(
    <IconComponent color={iconColor} size={24} />
  );

  return new L.DivIcon({
    html: `<div style="background-color: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 50%; padding: 6px; box-shadow: 0 4px 6px ${shadowColor};">${iconHtml}</div>`,
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
  selectedYears: number[];
  selectedStatuses: string[];
  searchQuery: string;
};

// Helper component to handle map events like pan/zoom
const MapEvents = ({ filteredPrograms, searchQuery }: { filteredPrograms: typeof programs, searchQuery: string }) => {
  const map = useMap();

  // Auto-pan and zoom when there's a single search result OR multiple results
  useEffect(() => {
    if (map && filteredPrograms.length > 0 && filteredPrograms.length <= 5) {
      if (filteredPrograms.length === 1) {
        // Single result - zoom to it
        const program = filteredPrograms[0];
        map.flyTo([program.location.lat, program.location.lng], 15, {
          duration: 1.5,
        });
      } else {
        // Multiple results - fit bounds to show all with smooth animation
        const bounds = filteredPrograms.map(p => [p.location.lat, p.location.lng] as [number, number]);
        map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
          duration: 1.5,
          easeLinearity: 0.25, // Smooth easing
        });
      }
    }
  }, [filteredPrograms, map]);

  return null; // This component does not render anything
};

// Helper component to customize cluster click animation
const ClusterEvents = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Override cluster click to use smooth flyToBounds instead of aggressive zoomToBounds
    map.on('clusterclick', (event: any) => {
      event.preventDefault();
      const cluster = event.layer;
      const bounds = cluster.getBounds();

      // Use smooth flyToBounds with same parameters as search
      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
        duration: 1.5,
        easeLinearity: 0.25, // Smooth easing matching search animation
      });
    });

    return () => {
      map.off('clusterclick');
    };
  }, [map]);

  return null;
};



const Map = ({ selectedCategories, selectedYears, selectedStatuses, searchQuery }: MapProps) => {
  const { theme } = useTheme(); // Get current theme
  const batamPosition: L.LatLngExpression = [1.14937, 104.02491];
  const indonesiaBounds: L.LatLngBoundsLiteral = [[-11.2085669, 94.7717124], [6.2744496, 141.0194444]];

  // Combine filters: categories, years, statuses, and search query
  const filteredPrograms = programs
    .filter(program => {
      // Category filter
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(program.category);
    })
    .filter(program => {
      // Year filter
      if (selectedYears.length === 0) return true;
      return selectedYears.includes(program.year);
    })
    .filter(program => {
      // Status filter
      if (selectedStatuses.length === 0) return true;
      return selectedStatuses.includes(program.status);
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
      className="h-full w-full bg-zinc-100 dark:bg-gray-900 transition-colors"
    >
      <TileLayer
        url={theme === 'dark'
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      <MarkerClusterGroup
        maxClusterRadius={25}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        animate={true}
        animateAddingMarkers={true}
        // Smooth animation options matching search behavior
        chunkedLoading={true}
        removeOutsideVisibleBounds={true}
      >
        {filteredPrograms.map((program) => (
          <HoverMarker
            key={`${program.id}-${theme}`}
            program={program}
            icon={getIconForCategory(program.category, theme)}
          />
        ))}
      </MarkerClusterGroup>

      {/* This component bridges react-leaflet's context with our custom context */}
      <MapContextProvider />
      {/* This component handles map side effects like panning and zooming */}
      <MapEvents filteredPrograms={filteredPrograms} searchQuery={searchQuery} />
      {/* This component customizes cluster click animation */}
      <ClusterEvents />
    </MapContainer>
  );
};

export default Map;
