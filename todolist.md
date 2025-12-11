### **Project To-Do List & Progress**

**Overall Project Progression: ~65%**

---

### **Phase 1: Core Map & UI Foundation**

-   [x] **Setup Project Infrastructure:** Initialize with Next.js, React, TypeScript, and Tailwind CSS.
-   [x] **Integrate Interactive Map:** Set up Leaflet and `react-leaflet` as the core mapping library.
-   [x] **Establish Core UI Components:** Create the floating header, search bar, and placeholder filter menu.
-   [x] **Implement Custom React Controls:** Build our own zoom controls and manage map state with React Context.
-   [x] **Define Map Boundaries:** Center the map on the target region (Batam) and restrict user navigation to a defined area (Indonesia).
-   [x] **Create Basic Detail Page:** Implement dynamic routing for a full-screen program detail page (`/program/[id]`).

### **Phase 2: Data & Interactivity**

-   [x] **Implement Custom Marker Icons:** Display unique, category-based icons for each map marker.
-   [x] **Implement Category Filtering:** Enable dynamic filtering of map markers via the filter menu UI.
-   [x] **Implement Search Functionality:** Add logic to the search bar to filter and pan/zoom to programs.
-   [ ] **Add More Filter Options:** Extend filtering to include "Tahun" (Year) and "Status" as defined in the `README`.
-   [ ] **Implement Marker Hover State:** Provide clear visual feedback when a user hovers over a marker.

### **Phase 3: Responsive UX & Content**

-   [ ] **Responsive Filter UI (Mobile):** Adapt the filter menu to a "bottom sheet" or "drawer" on mobile devices for a better UX.
-   [ ] **Enhance Program Detail Page:**
    -   [ ] Implement the responsive `3 → 2 → 1` column image gallery.
    -   [ ] Add the "Aksi" button to navigate/route to the program's location using an external map service.
    -   [ ] Fully integrate the embedded video player.
-   [ ] **Data Source Refactor:** Transition from static data (`programs.ts`) to fetching data from a live API endpoint.

### **Phase 4: Polish & Finalization**

-   [ ] **Accessibility Audit (WCAG 2.1 AA):** Perform a full audit to ensure keyboard navigation, proper color contrast, ARIA roles, and alt text are correctly implemented.
-   [ ] **Performance Review:** Optimize image loading, analyze bundle sizes, and ensure the map load time is under 2 seconds on a 4G connection.
-   [ ] **Finalize Visual Design:** Polish all UI elements to ensure they align perfectly with the visual design system (colors, typography, shadows, etc.).
