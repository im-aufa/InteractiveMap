# Quick Start: Generate 50+ Programs in 30 Minutes

**Goal**: Expand your dataset from 5 to 50+ programs before Monday  
**Time Required**: 30 minutes - 2 hours (depending on approach)

---

## 🚀 Fastest Method (30 minutes)

### Step 1: Install Python Dependencies (2 minutes)

```bash
cd "d:\KULIAH\TA\MBKM\FINal\Almost Final\WEB\interactive map 2\interactive-map-app"
pip install requests beautifulsoup4
```

### Step 2: Generate 50 Programs (1 minute)

```bash
python scripts/generate-programs.py --count 50
```

This creates:
- ✅ `generated_programs.json` - Review this file
- ✅ `generated_programs.ts` - Ready to paste into your app

### Step 3: Update Your App (5 minutes)

1. Open `generated_programs.ts`
2. Copy the entire `programs` array
3. Open `src/data/programs.ts`
4. **Keep your existing 5 real programs at the top**
5. Paste the generated programs below them
6. Save the file

### Step 4: Test (5 minutes)

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- ✅ All 50+ programs appear on map
- ✅ Filters work for all 10 categories
- ✅ Search finds programs
- ✅ Clustering works smoothly
- ✅ Detail pages load correctly

### Step 5: Build & Deploy (15 minutes)

```bash
npm run build
npm start
```

If build succeeds, you're done! 🎉

---

## 🎯 Better Method (1-2 hours)

### Hybrid Approach: Real + Generated Data

**Step 1: Collect Real Programs from Journals (30-60 minutes)**

1. Visit https://p2m.polibatam.ac.id/?page_id=6994 (2022)
2. Scroll to "PUBLIKASI LUARAN" section
3. Open 5-10 journal links
4. Extract from each journal:
   - Program title
   - Location (usually in methodology)
   - Description (from abstract)
   - Team members (authors)
   - Photos (if available in PDF)

**Step 2: Geocode Locations (10 minutes)**

For each location you found:

```bash
python scripts/geocode-locations.py
```

Or use Google Maps:
1. Search location on maps.google.com
2. Right-click → Copy coordinates
3. Format: `lat: 1.0456, lng: 104.0150`

**Step 3: Add Real Programs to Your App (20 minutes)**

Edit `src/data/programs.ts` and add your real programs:

```typescript
{
  id: 'p2m-2022-006',
  name: 'Your Real Program Name',
  category: 'Teknologi', // Choose appropriate category
  description: 'Extracted from journal abstract...',
  location: {
    lat: 1.0456,
    lng: 104.0150,
    address: 'Location from journal',
  },
  images: [
    'https://images.unsplash.com/photo-xxxxx?w=800', // Use relevant images
  ],
  videoUrl: 'https://www.youtube.com/embed/xxxxx', // If available
  detailsUrl: 'https://jurnal.polibatam.ac.id/...',
  year: 2022,
  status: 'Completed',
},
```

**Step 4: Generate Remaining Programs (1 minute)**

```bash
# If you added 10 real programs, generate 40 more
python scripts/generate-programs.py --count 40
```

**Step 5: Merge & Test (10 minutes)**

Combine your real programs with generated ones in `programs.ts`

---

## 📊 Recommended Distribution

For **50 programs total**:

| Source | Count | Purpose |
|--------|-------|---------|
| **Real (from journals)** | 10-15 | Academic credibility |
| **Generated** | 35-40 | Demonstrate system scalability |

For **30 programs minimum**:

| Source | Count | Purpose |
|--------|-------|---------|
| **Real (from journals)** | 5-10 | Academic credibility |
| **Generated** | 20-25 | Fill all categories |

---

## 🗺️ Available Locations (Pre-geocoded)

Your scripts include these locations with accurate coordinates:

**Batam (11 locations):**
- Nagoya, Batam Centre, Sekupang, Batu Aji, Bengkong
- Lubuk Baja, Sagulung, Nongsa, Tanjung Uncang
- Sei Beduk, Baloi

**Islands (5 locations):**
- Pulau Mubut, Pulau Galang, Pulau Rempang
- Sembulang, Galang Baru

**Bintan (2 locations):**
- Tanjung Pinang, Bintan Resorts

**Karimun (1 location):**
- Tanjung Balai Karimun

---

## ✅ Quality Checklist

Before finalizing:

- [ ] All 10 categories represented
- [ ] Geographic diversity (not all in one location)
- [ ] Year distribution (2020-2024)
- [ ] Status mix (mostly Completed, some In Progress)
- [ ] All programs have 3+ images
- [ ] Descriptions are coherent and realistic
- [ ] No duplicate IDs
- [ ] All coordinates verified
- [ ] Filtering works correctly
- [ ] Search finds programs
- [ ] Map performance is good

---

## 🆘 Troubleshooting

**"Python not found"**
- Install Python from python.org
- Or use online Python runner

**"Module not found"**
```bash
pip install requests beautifulsoup4
```

**"Generated data looks fake"**
- That's okay! It's a prototype
- Add 10-15 real programs for credibility
- Clearly state in thesis this is representative data

**"Map is slow with 50+ markers"**
- Clustering should handle this
- If still slow, reduce to 30-40 programs
- Check browser console for errors

---

## 📝 For Your Thesis

**How to justify generated data:**

> "This research implements a proof-of-concept interactive map system for P2M program visualization. The dataset comprises:
> 
> 1. **Real P2M Programs (n=10-15)**: Extracted from published journals on p2m.polibatam.ac.id, including actual program details, locations, and outcomes.
> 
> 2. **Representative Programs (n=35-40)**: Generated using realistic templates based on typical P2M program patterns, categories, and geographic distribution in Batam and Kepulauan Riau.
> 
> The system architecture is designed to accommodate full real data integration when deployed for production use by Politeknik Negeri Batam. This prototype demonstrates the technical feasibility and user experience of geographic visualization for community service programs."

---

## ⏰ Time Estimates

| Task | Fastest | Better Quality |
|------|---------|----------------|
| Setup | 5 min | 5 min |
| Data Collection | 2 min (generate) | 60 min (journals) |
| Geocoding | 0 min (auto) | 10 min (manual) |
| Integration | 5 min | 20 min |
| Testing | 5 min | 15 min |
| **TOTAL** | **17 min** | **110 min** |

---

## 🎯 Next Steps After Data

Once you have 50+ programs:

1. **Test thoroughly** (30 min)
2. **Take screenshots** for documentation (15 min)
3. **Write report/journal** (Day 2 - Sunday)
4. **Final polish** (Sunday evening)

**You're on track to finish before Monday!** 🚀
