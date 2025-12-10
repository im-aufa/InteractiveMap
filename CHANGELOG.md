# Changelog

All notable changes to this project will be documented in this file.

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
