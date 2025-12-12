# P0-4: Testing & Polish Checklist

## 🎯 Objective
Ensure app works flawlessly for advisor demo.

**Deadline:** 5:00 PM  
**Current:** 2:13 PM  
**Time:** 2 hours 47 minutes

---

## ✅ Comprehensive Testing Checklist

### 1. Map Functionality (15 min)

**Basic Display:**
- [x] Map loads without errors
- [x] All 5 markers visible on initial load
- [x] Markers show correct P2M icons (Palmtree, Cpu, Building, Users, Heart)
- [x] Markers show correct colors (Teal, Purple, Indigo, Pink, Red)
- [x] Zoom controls work (+ and - buttons)
- [x] Map can be panned by dragging

**Clustering:**
- [x] Markers cluster when zoomed out
- [x] Cluster numbers are correct
- [x] Clicking cluster zooms in
- [x] Animation is smooth (0.25s ease-out)
- [x] No overshoot or jerkiness

**Marker Interaction:**
- [x] Hover over marker shows popup
- [x] Popup stays open when mouse over popup
- [x] Popup closes when mouse leaves
- [x] Popup shows program name
- [x] Popup shows status badge (green/blue)
- [x] Popup shows year
- [x] "View Details" button visible and styled

---

### 2. Filter System (20 min)

**Filter UI:**
- [-] Filter button opens drawer (desktop: left, mobile: bottom)
- [-] Drawer shows all 10 P2M categories
- [x] Category names in Indonesian
- [x] Year filter shows 2022, 2023
- [x] Status filter shows Completed, In Progress

**Category Filtering:**
- [x] Select "Pariwisata" → 1 marker (Pelatihan Media Promosi)
- [x] Select "Teknologi" → 1 marker (Virtual Tour 360)
- [x] Select "Infrastruktur" → 1 marker (Penetapan Batas Wilayah)
- [x] Select "Pemberdayaan Masyarakat" → 1 marker (Digital Marketing UMKM)
- [x] Select "Kesehatan" → 1 marker (Kesehatan Ibu dan Anak)
- [x] Select multiple categories → correct markers shown
- [x] Deselect all → all 5 markers shown

**Year Filtering:**
- [x] Select "2022" → 3 markers (Pelatihan, Virtual Tour, Batas Wilayah)
- [x] Select "2023" → 2 markers (UMKM, Kesehatan)
- [x] Select both → all 5 markers

**Status Filtering:**
- [x] Select "Completed" → 4 markers
- [x] Select "In Progress" → 1 marker (Kesehatan)
- [x] Select both → all 5 markers

**Combined Filtering:**
- [x] Category + Year filters work together
- [x] Category + Status filters work together
- [x] All 3 filters work together
- [x] Clear all filters → all markers return

---

### 3. Search Functionality (10 min)

**Search Bar:**
- [x] Search bar visible in header
- [x] Placeholder text shows
- [x] Can type in search bar

**Search Results:**
- [x] Search "Mubut" → finds 2 programs (Pelatihan, Virtual Tour)
- [-] Map auto-pans to results
- [x] Search "Sembulang" → finds 1 program
- [x] Search "UMKM" → finds 1 program
- [x] Search "Kesehatan" → finds 1 program
- [x] Search "xyz" (no results) → no markers shown
- [x] Clear search → all markers return
- [x] Search is case-insensitive

---

### 4. Detail Pages (30 min)

**Test Each Program:**

**Program 1: Pelatihan Media Promosi**
- [x] Click marker → popup opens
- [x] Click "View Details" → detail page loads
- [x] Status badge shows "Completed" (green)
- [x] Year shows "2022"
- [x] Category shows "Pariwisata"
- [x] Title displays correctly
- [x] Description in Indonesian, readable
- [x] 3 images display
- [x] Video player shows (YouTube embed)
- [x] "Get Directions" button works (opens Google Maps)
- [x] Back button returns to map

**Program 2: Virtual Tour 360**
- [x] Same checks as Program 1
- [x] Category shows "Teknologi"
- [x] Icon is Cpu (purple)

**Program 3: Penetapan Batas Wilayah**
- [x] Same checks as Program 1
- [x] Category shows "Infrastruktur"
- [x] Icon is Building (indigo)

**Program 4: Digital Marketing UMKM**
- [x] Same checks as Program 1
- [x] Category shows "Pemberdayaan Masyarakat"
- [x] Icon is Users (pink)

**Program 5: Kesehatan Ibu dan Anak**
- [x] Same checks as Program 1
- [x] Status badge shows "In Progress" (blue)
- [x] Year shows "2023"
- [x] Category shows "Kesehatan"
- [x] Icon is Heart (red)

---

### 5. Responsive Design (15 min)

**Desktop (1920x1080):**
- [x] Layout looks good
- [x] Filter drawer opens from left
- [x] All elements properly spaced
- [x] Images in gallery show 3 columns

**Tablet (768px):**
- [x] Layout adapts
- [x] Filter drawer still functional
- [x] Images show 2 columns

**Mobile (375px):**
- [x] Layout mobile-optimized
- [-] Filter drawer opens from bottom
- [-] Search bar full width
- [x] Images show 1 column
- [x] Touch targets large enough (44x44px)
- [x] Text readable
- [x] No horizontal scroll

---

### 6. Performance & Quality (20 min)

**Load Performance:**
- [x] Initial page load < 3 seconds
- [x] Map renders quickly
- [x] Images load progressively
- [x] No layout shift

**Console Check:**
- [x] Open DevTools (F12)
- [x] Check Console tab
- [-] No red errors
- [-] No critical warnings
- [x] Network tab shows all resources load

**Visual Quality:**
- [x] All colors match P2M palette
- [x] Icons crisp and clear
- [x] Text readable (good contrast)
- [x] Images high quality
- [x] No broken images
- [x] No missing icons

**Interactions:**
- [x] All buttons clickable
- [x] Hover states work
- [-] Transitions smooth
- [x] No lag or stuttering
- [x] Cursor changes appropriately

---

### 7. Cross-Browser Testing (15 min)

**Chrome:**
- [x] All features work
- [x] Layout correct

**Firefox:**
- [x] All features work
- [x] Layout correct

**Edge:**
- [x] All features work
- [x] Layout correct

*(Safari if available on Mac)*

---

### 8. Edge Cases (10 min)

**Unusual Interactions:**
- [x] Rapid zoom in/out → no crashes
- [x] Click multiple markers quickly → popups work
- [x] Open/close filter drawer rapidly → no issues
- [x] Type very long search query → handles gracefully
- [x] Resize browser window → layout adapts

**Data Edge Cases:**
- [x] Programs with long names display correctly
- [x] Programs with long descriptions don't break layout
- [x] Missing video (if any) doesn't break page

---

## 🔧 Polish Tasks

### Visual Improvements:
- [x] Check all spacing is consistent
- [x] Verify all fonts are correct
- [x] Ensure all rounded corners consistent (8-12px)
- [x] Check all shadows are subtle and consistent

### UX Improvements:
- [x] Add loading states if needed
- [x] Ensure all interactive elements have hover states
- [x] Check all transitions are < 200ms
- [x] Verify all buttons have clear labels

### Content Review:
- [x] All Indonesian text is grammatically correct
- [x] All English text is grammatically correct
- [x] No placeholder text ("Lorem ipsum", etc.)
- [x] All links work

---

## 📝 Issues Log

**If you find issues, document them here:**

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Filter button opens drawer mobile: bottom | Medium | not fixed | it opens from left |
| Drawer shows all 10 P2M categories | Medium | not fixed | it shows only 9 categories |
| Map auto-pans to results | Medium | not fixed | it doesn't auto-pan when searching clustered markers |
| Search bar full width | Medium | not fixed | search bar is not full width when in mobile and tab |
| console warning and red error | Medium | not fixed | 
Cookie “__Secure-YEC” has been rejected because it is in a cross-site context and its “SameSite” is “Lax” or “Strict”. 

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://googleads.g.doubleclick.net/pagead/viewthroughconversion/962985656/?backend=innertube&cname=56&cver=20251211&foc_id=uAXFkgsw1L7xaCfnd5JJOw&label=followon_view&ptype=no_rmkt&random=415888113&cv_attributed=0. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 302.

Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://googleads.g.doubleclick.net/pagead/viewthroughconversion/962985656/?backend=innertube&cname=56&cver=20251211&foc_id=uAXFkgsw1L7xaCfnd5JJOw&label=followon_view&ptype=no_rmkt&random=415888113&cv_attributed=0. (Reason: CORS request did not succeed). Status code: (null).

`DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users.

If you want to hide the `DialogTitle`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/dialog |
---

## ✅ Final Checklist

Before marking P0-4 complete:
- [x] All functionality tests passed
- [x] All detail pages work
- [x] Responsive design verified
- [x] Performance acceptable
- [-] No console errors
- [x] Cross-browser tested
- [x] Edge cases handled
- [-] Visual polish complete
- [-] All issues resolved or documented

---

**Status:** Ready to start testing  
**Next:** Begin systematic testing
