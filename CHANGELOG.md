# Architectural Notes & Future Considerations

This section documents architectural decisions and potential technical debt to be aware of as the project scales.

- **State Management & Prop Drilling**: The current implementation lifts filter state to `page.tsx`. As more global states (e.g., search query) are added, this could lead to excessive "prop drilling."
  - **Future Improvement**: Consider creating a dedicated `FilterContext` or using a lightweight state management library like Zustand to centralize UI state.

- **Data Source**: Program data is currently static (`src/data/programs.ts`). This is great for development but not scalable.
  - **Future Improvement**: The architecture is designed to easily swap this static data for a live API call (`fetch(...)`) when a backend is available.

- **Configuration Management**: Mappings for category-to-icon and colors are currently hardcoded in `Map.tsx`.
  - **Future Improvement**: This configuration could be moved to a separate `config.ts` file or be delivered as part of the API response to make the components more dynamic.

---

# Changelog

All notable changes to this project will be documented in this file.

## [2.6.0] - 2025-12-16

### Added
- **Reset View Button**: Added a "Maximize" button to the zoom controls that instantly resets the map view to the Batam overview (Zoom 11).
- **Reset Filters Button**: Added a dedicated "Reset" button to the filter drawer header that appears only when filters are active.

### Changed
- **Filter Menu Overhaul**: Completely redesigned the filter menu for a modern, app-like experience:
  - **Multimedia Chips**: Replaced standard checkboxes with interactive, touch-friendly selection cards.
  - **Visual Feedback**: Categories now light up with their specific brand colors when selected.
  - **Status Toggles**: Implemented full-width toggle buttons for clearer status selection.
  - **Smart Layout**: Optimized layout with "Pill" buttons for Year selection.
- **Unified Popup Design**: Standardized padding, fonts, and badge styling across both `ClusterPopup` and `CustomPopup` for consistent visual weight.
- **Enhanced Close Buttons**: Adjusted positioning of popup close buttons for perfect alignment with headers.
- **Map Defaults**: Updated initial map view and reset coordinates to specifically center on Batam (Lat: 0.964..., Long: 104.21...) at Zoom 11.

### Fixed
- **Filter Reset Logic**: Resolved a race condition where the previous reset button would only clear one filter at a time. Implemented `resetFilters` in `page.tsx` for atomic state clearing.
- **UI Redundancy**: Removed duplicate "Filters" heading from the filter menu content.

## [2.5.0] - 2025-12-15

### Added
- **Marker Dark Mode Support**: Individual markers now adapt to theme with proper backgrounds and borders
  - Light mode: White background with subtle border
  - Dark mode: Dark gray (#1f2937) background with gray border (#374151)
  - Theme-aware shadows for better depth perception

### Changed
- **Improved Cluster Radius**: Reduced `maxClusterRadius` from 40 to 25 pixels
  - Markers now stay separate longer before clustering
  - Better visual spacing at mid-zoom levels
  - Less aggressive clustering behavior
- **Enhanced Cluster Styling**: Implemented modern "glassmorphism" design for clusters
  - Light mode: Soft blue gradient (`blue-500/20` to `blue-300/30`) with blur effect
  - Dark mode: Deep blue gradient with glowing borders for high contrast
  - Hover effects: Smooth scale (1.1x) and enhanced shadow depth
  - Improved typography: Bold text with text-shadow for readability in all themes
- **Validation Fixes**: 
  - Resolved hydration mismatch errors by suppressing warnings on body
  - Fixed legacy Next.js Link warnings in popup components
- **Refinements**:
  - **Cluster Popup**: 
    - Activates at Zoom 14+ (City view)
    - **DISABLED** `spiderfyOnMaxZoom` & `zoomToBoundsOnClick` to ensuring popup list always takes precedence
    - **Robustness**: Implemented location-based data fallback to prevent empty popups
    - **Refactor**: Moved logic to dedicated `ProgramClusters` component with direct event handlers
  - **Detail Page**: 
    - Fixed Hero hover animation
    - Improved visual hierarchy (Badges below title, Sticky sidebar)
  - **Design Unification (Premium Polish)**:
    - **Global**: Added `backdrop-filter` for true glassmorphism, updated popup radius to `rounded-2xl`, and added custom scrollbars for dark mode.
    - **Cluster Popup**: Now features Category Icons, Unified Status Badges (replacing text), and improved visual hierarchy.
    - **Single Popup**: Aligned badge placement (below title) and typography (Uppercase/Tracking) with Detail Page.
    - **Refactor**: Centralized icon logic in `src/utils/categoryIcons.ts`.

### Fixed
- **CRITICAL: Dark Mode Tailwind v4 Configuration**
  - Fixed dark mode toggle not working due to Tailwind CSS v4 configuration incompatibility
  - Root cause: Tailwind v4 uses CSS-first configuration and ignores `tailwind.config.ts`
  - Solution: Added `@variant dark (&:where(.dark, .dark *));` directive to `globals.css`
  - System dark mode preference (`prefers-color-scheme`) no longer overrides manual theme selection
  - All UI components now correctly respond to theme toggle in both directions
- **ThemeContext Robustness**: Added synchronization effect to handle viewport changes and re-renders
- **DOM Class Management**: Changed from `classList.toggle()` to explicit `add()`/`remove()` for reliability
- **Marker Backgrounds**: Fixed white marker backgrounds being hard to see on dark map tiles

### Technical Details
- Migrated from Tailwind v3 JavaScript config (`darkMode: "class"`) to v4 CSS-based config (`@variant`)
- Updated `getIconForCategory()` to accept theme parameter and generate theme-aware marker styles
- Added theme to marker key (`${program.id}-${theme}`) to force re-render on theme changes
- Added comprehensive browser testing to verify theme toggle across all components
- Documented Tailwind v4 migration considerations for future reference

## [2.4.0] - 2025-12-14

### Added
- **Major Data Update:** Successfully extracted and integrated 50+ real P2M programs from 2019-2025 using an LLM-assisted data pipeline.
- **Data Workspace:** Created `data-extraction-workspace` containing detailed Python ETL scripts.
- **Automated Geocoding:** Implemented `geocode_locations.py` to automatically resolve program locations (e.g., "Pulau Mubut", "Sembulang") to coordinates.
- **ChatGPT Integration:** Implemented `extract_with_chatgpt.py` using GPT-3.5-turbo for high-accuracy structured data extraction from PDFs.

### Changed
- **Data Source:** Migrated from static sample data to a fully populated `programs.ts` generated from real journal publications.

## [2.3.0] - 2024-12-12

### Added
- **Modern Filter Drawer UI:**
  - Added P2M-specific icons and color coding for all 10 categories
  - Added program counts to all filter sections (Category, Year, Status)
  - Added "Clear All Filters" button
  - Added active filter count badge to the menu button
  - Improved visual hierarchy with uppercase headers and hover effects
- **Accessibility:** Added `Drawer.Title` for screen reader support in the filter menu

### Changed
- **Fixed program category data:** Changed from dynamic extraction to a static list of all 10 P2M categories to ensure all options are visible even without data
- **Modified filtering logic:** "Match all" approach for multi-select (user selection is OR within same group, AND between groups)
- **Updated Checkbox UI:** Changed from default square to `rounded-md` for a softer look
- **Improved Popup Styling:** Forced white text color for "View Details" button to ensure contrast

### Fixed
- **Auto-pan Animation:** Changed from `fitBounds` (choppy) to `flyToBounds` with smooth easing for clustered markers
- **Filter Drawer Direction:** Now opens reliably from the left on all devices (reverted complex responsive logic for stability)

## [2.2.0] - 2024-12-12

### Changed
- **BREAKING:** Updated category system from 5 generic categories to 10 P2M-specific categories
  - Old: Historical Sites, Natural Parks, Museums, Cultural Spots, Entertainment
  - New: Pendidikan, Kesehatan, Teknologi, Lingkungan, Ekonomi Kreatif, Pariwisata, Pemberdayaan Masyarakat, Infrastruktur, Pertanian, Kelautan
- Updated marker icons to match P2M categories (GraduationCap, Heart, Cpu, Leaf, Palette, Palmtree, Users, Building, Sprout, Waves)
- Updated category colors to match P2M visual design system
- **Replaced sample data with 5 complete P2M programs:**
  - 3 real programs from journal publications (Pelatihan Media Promosi, Virtual Tour 360, Penetapan Batas Wilayah)
  - 2 realistic mock programs (Digital Marketing UMKM, Kesehatan Ibu dan Anak)
  - All programs have rich descriptions, proper locations in Batam/Galang, 3 images each, and video URLs

### Technical Details
- Modified `src/data/programs.ts` type definition
- Updated `src/components/Map.tsx` icon mappings
- Aligned with documentation (DOCS.md, README.md, DATA_STRATEGY.md)
- Programs now use real P2M data from Politeknik Negeri Batam community service projects

## [2.1.0] - 2025-12-11

### Fixed
- Resolved "hover tunnel" issue where popups would close prematurely. The `HoverMarker` component was refactored to use a more robust event handling logic, attaching listeners to the popup only after it has been opened.

## [2.0.0] - 2025-12-11

### Added
- Completed the core features for the Program Detail Page:
  - Implemented a responsive `3 → 2 → 1` column image gallery.
  - Added a "Get Directions" button that links to Google Maps.
  - Integrated the embedded video player with an accessible title.

### Changed
- Marked the completion of all major features from the initial `README.md` and updated the `todolist.md` to reflect ~90% completion.

## [1.9.0] - 2025-12-11

### Added
- Implemented a "Get Directions" button on the program detail page, which links to Google Maps with the program's coordinates.

## [1.8.0] - 2025-12-11

### Added
- Implemented marker hover state:
  - Popups now open automatically on `mouseover`.
  - Popups close automatically on `mouseout`.
  - Marker icons scale up on hover to provide clear visual feedback.

## [1.7.0] - 2025-12-11

### Added
- Implemented responsive filter UI using the 'vaul' library for accessible and touch-friendly bottom sheets/drawers.
- Removed the redundant `Overlay.tsx` component as its functionality is now handled by `vaul`.

### Changed
- Refactored `FilterMenu.tsx` to be the content of the drawer, and `Header.tsx` to be the owner of the `Drawer` components, improving component architecture.

### Fixed
- Resolved multiple build errors:
  - Added `'use client';` directive to `page.tsx` and `useDebounce.ts` to fix React Hook errors in Server Components.
  - Corrected `vaul` import and usage pattern to resolve `Export doesn't exist` errors.
  - Fixed `Cannot find name 'MapEvents'` error by reordering component definitions in `Map.tsx`.

## [1.6.0] - 2025-12-11

### Added
- Implemented responsive filter UI using the 'vaul' library for accessible and touch-friendly bottom sheets/drawers.
- Removed the redundant `Overlay.tsx` component as its functionality is now handled by `vaul`'s `DrawerOverlay`.

### Changed
- Refactored `FilterMenu.tsx` to use `vaul`'s `Drawer` components, replacing custom positioning and transition logic.
- Modified `Header.tsx` to integrate with `vaul`'s `Drawer.Trigger` for opening the filter menu.

## [1.5.0] - 2025-12-11

### Added
- Extended filtering capabilities to include "Year" and "Status" for programs, as per `README.md` specifications.

### Changed
- Updated the `Program` type definition, mock program data (`programs.ts`), `FilterMenu`, `Header`, `page.tsx`, `ClientOnlyMap`, and `Map` components to fully support the new "Year" and "Status" filter criteria.
- Dynamic extraction of unique years and statuses from program data added.

## [1.4.0] - 2025-12-11

### Added
- Implemented marker clustering using `react-leaflet-cluster` to improve map performance and usability with a large number of markers. Nearby markers will now group into clusters when zoomed out.
- Added a new 'Entertainment' category to the custom icon mapping.

## [1.3.0] - 2025-12-11

### Added
- Implemented search functionality to filter map markers by program name.
- Added a `useDebounce` hook to improve search performance by delaying filtering until the user stops typing.
- Implemented pan and zoom (`flyTo`) functionality to automatically focus the map on a single search result.

### Changed
- Lifted search query state up to the main page component (`page.tsx`) to allow sharing between the header and map components.

### Fixed
- Resolved a `react-leaflet` context error (`useLeafletContext`) by refactoring map event handling (pan/zoom effect) into a dedicated `MapEvents` child component, ensuring hooks like `useMap` are used correctly within the `<MapContainer>` hierarchy.

## [1.2.0] - 2025-12-10

### Added
- Implemented dynamic filtering of map markers based on category selection.
- Implemented custom, data-driven marker icons based on program category, using `lucide-react`.
- Created `todolist.md` to track project progress and future tasks.
- Added more sample program data, including new categories ("Entertainment", "Natural Parks") for testing filtering and search functionality.
- Implemented pan and zoom functionality for single search results, moving the map to the matched program's location.

### Changed
- **Major Refactor**: Migrated the core map implementation from manual Leaflet DOM manipulation to the `react-leaflet` library for a more declarative and React-idiomatic architecture.

### Fixed
- Resolved `next/image` configuration error by whitelisting external image hostnames in `next.config.ts`.
- Fixed React hook error in the main page component (`page.tsx`) by marking it as a Client Component with `'use client'`.

## [1.1.1] - 2025-12-10

### Changed
- Adjusted the border-radius of the search bar, filter button, and zoom controls for a more rounded appearance (`rounded-xl`).
- Added a semi-transparent background overlay that appears when the filter menu is open.

### Fixed
- Corrected the slide-out animation direction for the left-positioned filter menu.

## [1.1.0] - 2025-12-10

### Added
- Implemented a UI overlay with a search bar and a slide-out filter menu.
- Added `react-icons` for UI iconography.
- Created a `MapContext` to provide a shared Leaflet map instance to React components, improving architecture and scalability.
- Created a custom, React-based zoom control component that consumes the `MapContext`.

### Changed
- Refactored map controls to be React-idiomatic, removing the default Leaflet zoom controls.
- Updated UI element styles (search bar, filter button, zoom controls) to use consistent rounded-square design.
- Adjusted the position of the filter menu button and the zoom controls to new locations (top-left and bottom-right, respectively).
- Centered the map on Batam, Indonesia, and restricted map bounds and zoom to that region.
- Fixed Leaflet marker icon path issues by using the `public` folder method.

## [1.0.0] - 2025-12-09

### Added
- Initialized project with Next.js, React, TypeScript, and Tailwind CSS.
- Integrated Leaflet.js to display an interactive map.
- Created a custom, reusable React component for map popups with dynamic content (image, text, button).
- Set up a component-based structure for scalability.
- Added a `CHANGELOG.md` to track project changes.

### Changed
- Replaced the default Next.js homepage with the interactive map component.
- Separated client-side only components from server-side components to ensure compatibility with Next.js SSR.

### Removed
- Removed initial static `index.html` and `style.css` files after migrating to Next.js.
