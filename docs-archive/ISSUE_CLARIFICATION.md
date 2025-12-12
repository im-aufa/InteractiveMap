# Issue Clarification Questions

Based on your testing, I found 5 issues. Please answer these questions so I can fix them:

## 🔍 Issue #1: Filter Drawer (Mobile)
**Your Finding:** "Filter button opens drawer mobile: bottom | Medium | not fixed | it opens from left"

**Questions:**
1. When you resize browser to mobile width (375px), does the drawer slide in from the **left side** or from the **bottom**?
2. Does it use a different animation/style on mobile vs desktop?

---

## 🔍 Issue #2: Missing Category
**Your Finding:** "Drawer shows all 10 P2M categories | Medium | not fixed | it shows only 9 categories"

**Questions:**
1. Which category is **missing**? 
2. Can you list the 9 categories you see in the filter drawer?

Expected 10 categories:
- Pendidikan
- Kesehatan
- Teknologi
- Lingkungan
- Ekonomi Kreatif
- Pariwisata
- Pemberdayaan Masyarakat
- Infrastruktur
- Pertanian
- Kelautan

---

## 🔍 Issue #3: Auto-Pan Not Working
**Your Finding:** "Map auto-pans to results | Medium | not fixed | it doesn't auto-pan when searching clustered markers"

**Questions:**
1. When you search **"Mubut"** (2 programs at same location), does the map:
   - Not move at all?
   - Zoom but not pan?
   - Pan but not zoom?
   
2. When you search **"UMKM"** (single program), does auto-pan work?

3. When you search **"Sembulang"** (single program), does auto-pan work?

---

## 🔍 Issue #4: Search Bar Width
**Your Finding:** "Search bar full width | Medium | not fixed | search bar is not full width when in mobile and tab"

**Questions:**
1. On mobile (375px), is the search bar:
   - About 50% width?
   - About 70-80% width?
   - Full width but with large padding/margins?

2. On tablet (768px), same question - what's the approximate width?

---

## 🔍 Issue #5: Console Errors/Warnings

**YouTube CORS Errors:** ✅ **SAFE TO IGNORE**
```
Cross-Origin Request Blocked: ... googleads.g.doubleclick.net ...
Cookie "__Secure-YEC" has been rejected ...
```
These are from YouTube's ad tracking system, not our code. They don't affect functionality.

**DialogTitle Warning:** ⚠️ **NEEDS FIX**
```
`DialogContent` requires a `DialogTitle` for the component to be accessible
```

**Question:**
1. Do you see any dialog/modal popup in the app (besides the filter drawer)?
2. Is this warning from the filter drawer (vaul library)?
3. How many times does this warning appear in console?

---

## 📝 Your Answers

Please answer these questions in order, and I'll fix all issues quickly!

**Time:** 4:14 PM  
**Meeting:** 6:45 PM  
**Time Left:** 2 hours 31 minutes
