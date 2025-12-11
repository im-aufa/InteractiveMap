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
