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
import ClusterPopup from './ClusterPopup'; // Import the ClusterPopup component
import { categoryIcons, CategoryKey } from '../utils/categoryIcons';
import { GraduationCap } from 'lucide-react'; // Default fallback icon
import { useTheme } from '../context/ThemeContext'; // Import theme hook

// --- Function to create a divIcon for a category ---
const getIconForCategory = (category: string, theme: 'light' | 'dark') => {
  const catKey = category as CategoryKey;
  const IconComponent = categoryIcons[catKey]?.icon || GraduationCap; // Default to GraduationCap
  const iconColor = categoryIcons[catKey]?.color || '#6B7280'; // Default to gray

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

// Helper component to handle cluster rendering and events
const ProgramClusters = ({ filteredPrograms, theme }: { filteredPrograms: typeof programs, theme: string }) => {
  const map = useMap();

  const handleClusterClick = (event: any) => {
    // Zoom is already disabled via zoomToBoundsOnClick={false}, so just run logic
    const cluster = event.layer;
    const currentZoom = map.getZoom();

    // Threshold: at zoom 14+ (city view), show popup list
    if (currentZoom >= 14) {
      const markers = cluster.getAllChildMarkers();

      // Attempt to get IDs attached to markers
      const programIds = markers.map((m: any) => m.programId).filter(Boolean);
      let clusterPrograms = programs.filter(p => programIds.includes(p.id));

      // Fallback: If no IDs found (e.g., ref issues), match by location (approx. 5 meters)
      if (clusterPrograms.length === 0) {
        const markerLocs = markers.map((m: any) => m.getLatLng());
        clusterPrograms = programs.filter(p =>
          markerLocs.some((loc: any) =>
            L.latLng(p.location.lat, p.location.lng).distanceTo(loc) < 5
          )
        );
      }

      if (clusterPrograms.length > 0) {
        const popupHtml = ReactDOMServer.renderToString(<ClusterPopup programs={clusterPrograms} />);

        L.popup({
          minWidth: 220,
          maxWidth: 280,
          offset: [0, -10],
          className: 'cluster-custom-popup'
        })
          .setLatLng(event.latlng)
          .setContent(popupHtml)
          .openOn(map);

        return;
      }
    }

    // Default: Smooth flyToBounds
    const bounds = cluster.getBounds();
    map.flyToBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16,
      duration: 1.5,
      easeLinearity: 0.25,
    });
  };

  return (
    <MarkerClusterGroup
      maxClusterRadius={25}
      spiderfyOnMaxZoom={false}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={false}
      animate={true}
      animateAddingMarkers={true}
      chunkedLoading={true}
      removeOutsideVisibleBounds={true}
      eventHandlers={{
        clusterclick: handleClusterClick
      }}
    >
      {filteredPrograms.map((program) => (
        <HoverMarker
          key={`${program.id}-${theme}`}
          program={program}
          icon={getIconForCategory(program.category, theme as 'light' | 'dark')}
        />
      ))}
    </MarkerClusterGroup>
  );
};

const Map = ({ selectedCategories, selectedYears, selectedStatuses, searchQuery }: MapProps) => {
  const { theme } = useTheme();
  const batamPosition: L.LatLngExpression = [0.9640591285588442, 104.2100177997217];
  const indonesiaBounds: L.LatLngBoundsLiteral = [[-11.2085669, 94.7717124], [6.2744496, 141.0194444]];

  // Combine filters
  const filteredPrograms = programs
    .filter(program => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(program.category);
    })
    .filter(program => {
      if (selectedYears.length === 0) return true;
      return selectedYears.includes(program.year);
    })
    .filter(program => {
      if (selectedStatuses.length === 0) return true;
      return selectedStatuses.includes(program.status);
    })
    .filter(program => {
      if (searchQuery.trim() === '') return true;
      return program.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <MapContainer
      center={batamPosition}
      zoom={11}
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

      {/* Render Clusters with direct event handling */}
      <ProgramClusters filteredPrograms={filteredPrograms} theme={theme} />

      <MapContextProvider />
      <MapEvents filteredPrograms={filteredPrograms} searchQuery={searchQuery} />
    </MapContainer>
  );
};

export default Map;
