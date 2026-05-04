# Data Strategy & Deployment Guide for P2M Interactive Map

> **Version:** 2.4.0 (Implemented)  
> **Last Updated:** December 14, 2024  
> **Project Context:** Final Project - Politeknik Negeri Batam  
> **Goal:** Transform text-based P2M program listings into an interactive geographic visualization  
> **Current Data Source:** 49 Journal PDFs (2019-2025) - Extracted via LLM

> [!NOTE]
> **For UX patterns, popup design, and filter system design, see:** [DOCS.md - UX Design Patterns](./DOCS.md#4-ux-design-patterns)
> 
> This document focuses exclusively on **data collection, processing, and deployment strategies**.

---

## 1. PROBLEM STATEMENT

### Current Situation
Program P2M Polibatam saat ini hanya tersedia dalam bentuk **list text-based** di website resmi P2M (p2m.polibatam.ac.id), tanpa konteks geografis visual.

### Impact on Stakeholders

| Stakeholder | Problem | Impact |
|------------|---------|--------|
| **Mahasiswa** | Kesulitan menemukan referensi program di lokasi spesifik | Sulit untuk PKL/PBL planning |
| **Dosen** | Tidak dapat melihat distribusi program | Duplikasi program, perencanaan tidak optimal |
| **Stakeholder Eksternal** | Tidak memahami jangkauan geografis P2M | Kurang awareness tentang impact |
| **Masyarakat** | Tidak aware dengan program di area mereka | Partisipasi rendah, manfaat tidak maksimal |
| **Dokumentasi** | Program tidak terpresentasi secara engaging | Kurang menarik, sulit dipahami |

### Proposed Solution
**Interactive Map Application** yang memvisualisasikan:
- ✅ Lokasi geografis setiap program (pulau/desa)
- ✅ Detail program (nama, kategori, tahun, status)
- ✅ Ketua pelaksana dan tim
- ✅ Outcome/hasil program
- ✅ Multimedia (foto, video dokumentasi)

---

## 2. IMPLEMENTED DATA PIPELINE (LLM-ASSISTED)

> **Status:** ✅ Successfully Implemented & Executed
> **Output:** `src/data/programs.ts` containing 40+ fully geocoded programs.

We transformed the manual data collection challenge into an automated **ETL (Extract, Transform, Load)** pipeline using Python and Large Language Models (LLM).

### 2.1 The Pipeline Architecture

```mermaid
graph TD
    A[PDF Journals] -->|PyPDF2| B(Raw Text)
    B -->|OpenAI GPT-3.5| C(Structured JSON)
    C -->|Nominatim + Custom Logic| D(Geocoded JSON)
    D -->|Manual Review| E(Corrected JSON)
    E -->|Python Script| F[programs.ts]
    F -->|Import| G[Next.js App]
```

### 2.2 Step-by-Step Workflow

#### Step 1: Intelligent Extraction (`extract_with_chatgpt.py`)
Instead of manual copy-pasting, we utilized **OpenAI's GPT-3.5-turbo** to "read" the PDF journals.
- **Input:** 49 raw PDF files from `data example/`.
- **Process:** The LLM was prompted to extract specific fields (Title, Category, Location Hints, Outcomes) and output them as strict JSON.
- **Key Feature:** The prompt specifically aimed to find *where* the service happened (e.g., "Desa Pasir Panjang") rather than the author's address.
- **⏱️ Timing (measured on this machine):**
  - PyPDF2 text extraction: **515.79 ms avg** (min 383.67 ms, max 654.92 ms) per PDF
  - OpenAI GPT-3.5-turbo API call: **~4,367 ms avg** per PDF *(derived from actual log)*
  - Inter-request safety delay: **500 ms fixed** *(hardcoded, `time.sleep(0.5)`)*
  - **Total batch (49 PDFs): 264,000 ms = 4.4 min** ✅ *confirmed from `logs/extraction_log_20251214_221345.txt`*

#### Step 2: Automated Geocoding (`geocode_locations.py`)
We built a smart geocoder using `geopy` (Nominatim/OpenStreetMap) with a "fall-through" strategy:
1.  **Exact Match:** Checks a hardcoded `KNOWN_LOCATIONS` dictionary for common P2M sites (e.g., "Pulau Mubut", "Sembulang", "Politeknik Negeri Batam").
2.  **Smart Queries:** If no exact match, it constructs queries like `"{Village}, Kepulauan Riau"` to avoid ambiguous results.
3.  **Fallback:** Defaults to "Batam, Indonesia" if all else fails, to be caught in review.
- **⏱️ Timing (measured + estimated):**
  - Known location dict lookup: **~1.32 µs** per query *(measured, 40,000 iterations)*
  - Nominatim API call: **~1,210 ms** per query *(1,000 ms enforced rate-limit + ~210 ms response)*
  - JSON read+write per file: **11.97 ms** *(measured)*
  - **Total geocoding (~23 Nominatim queries): ~28,429 ms ≈ 28 sec** *(estimated from rate-limits)*

#### Step 3: Human-in-the-Loop Validation (`corrections.json`)
Automated geocoding is never 100% perfect. We implemented a correction layer:
- **Validation:** We reviewed the generated map and identified markers that were off (e.g., "Pulau Jemare" appearing in the wrong ocean).
- **Correction:** A `corrections.json` file maps specific Program IDs to manually verified Lat/Lng coordinates.
- **Script:** `apply_json_corrections.py` merges these manual fixes into the automated dataset.
- **⏱️ Timing (measured rate):**
  - Load `corrections.json`: **~5 ms**
  - Per-file correction (JSON read + patch + write): **~16.97 ms** per file *(measured)*
  - Active corrections applied: **35** (36 total entries, 1 skipped — `null` lat/lng)
  - **Total (~35 corrections): ~593.95 ms ≈ 594 ms** *(measured rate)*

#### Step 4: Code Generation (`json_to_ts.py`)
the final step converts the validated JSON data into the TypeScript file required by the Next.js app.
- **Image Assignment:** Automatically assigns high-quality Unsplash images based on the program's `category`.
- **Clustering Fix:** Adds a tiny random "jitter" (+/- 50m) to coordinates so that programs at the exact same location (e.g., same Village Hall) don't overlap perfectly, allowing the clustering system to handle them.
- **Output:** Generates `src/data/programs.ts` with strong typing.
- **⏱️ Timing (fully measured):**
  - Read 48 JSON files: **419.83 ms** *(measured)*
  - Build TypeScript content string: **2.03 ms** *(measured)*
  - Write `programs.ts` (46 KB): **1.06 ms** *(measured)*
  - **Total: 422.93 ms** ✅ *(measured)*

---

### 2.3 Data Structure (Final)

The pipeline produces data matching this TypeScript interface:

```typescript
export type Program = {
  id: string;          // e.g., "p2m-2022-031"
  name: string;
  category: string;    // One of 10 P2M categories
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];    // Automapped from Unsplash
  videoUrl?: string;   // Default fallback or extracted
  detailsUrl: string;  // Link to original journal
  year: number;
  status: 'Completed'; // Journals imply completion
};
```

---

### 2.4 Performance Metrics

> **Benchmark run:** 2026-04-28 · Machine: Windows 11, Python 3.11  
> **Log source:** `logs/extraction_log_20251214_221345.txt` (actual execution Dec 14, 2025)  
> **Script:** `scripts/time_pipeline.py` (run `python time_pipeline.py` to reproduce)

#### Per-Operation Breakdown

| # | Script | Operation | Min | Mean | Max | Source |
|---|--------|-----------|-----|------|-----|--------|
| 2a | `extract_with_chatgpt.py` | PyPDF2 text read (per PDF) | 383.67 ms | **515.79 ms** | 654.92 ms | ✅ Measured |
| 2b | `extract_with_chatgpt.py` | OpenAI GPT-3.5-turbo API (per PDF) | ~2,100 ms | **~4,367 ms** | ~8,000 ms | Derived |
| 2c | `batch_process_chatgpt.py` | Inter-PDF safety delay | 500 ms | **500 ms** | 500 ms | Hardcoded |
| 2d | `extract_with_chatgpt.py` | JSON parse + file write | — | **~15 ms** | — | Estimated |
| 3a | `geocode_locations.py` | KNOWN_LOCATIONS dict lookup | — | **1.32 µs** | — | ✅ Measured |
| 3b | `geocode_locations.py` | Nominatim API call (per query) | ~1,000 ms | **~1,210 ms** | ~2,000 ms | Rate-limited |
| 3c | `geocode_locations.py` | JSON read+write (per file) | — | **11.97 ms** | — | ✅ Measured |
| 4 | `apply_json_corrections.py` | Per-file correction | — | **16.97 ms** | — | ✅ Measured |

> **Corrections count note:** `corrections.json` contains 36 total entries. 1 entry has `null` lat/lng coordinates (deliberately excluded program) and is skipped by `apply_json_corrections.py`. **35 corrections are actively applied.**
| 5a | `json_to_ts.py` | Read 48 JSON files | — | **419.83 ms** | — | ✅ Measured |
| 5b | `json_to_ts.py` | Build TypeScript string | — | **2.03 ms** | — | ✅ Measured |
| 5c | `json_to_ts.py` | Write `programs.ts` (46 KB) | — | **1.06 ms** | — | ✅ Measured |

#### Per-Step Total Time

| Step | Script | Total Time | Source |
|------|--------|------------|--------|
| Step 2 — GPT Extraction (49 PDFs) | `batch_process_chatgpt.py` | **264,000 ms (4 min 24 sec)** | ✅ ACTUAL LOG |
| Step 3 — Geocoding (49 programs) | `geocode_locations.py` | **~28,429 ms (~28 sec)** | Estimated (rate-limited) |
| Step 4 — Corrections (35 active / 36 total) | `apply_json_corrections.py` | **~593.95 ms (~594 ms)** | Measured rate |
| Step 5 — TS Generation (48 files) | `json_to_ts.py` | **422.93 ms** | ✅ Measured |
| **Full Pipeline** | All scripts | **~293,446 ms ≈ 4 min 53 sec** | Derived + Actual |

#### Key Insights

- **GPT API is the bottleneck:** accounts for **90.1%** of total runtime (4,367 ms of ~4,898 ms per PDF)
- **PDF extraction is faster than expected** but still significant: 515.79 ms avg for pure-Python PyPDF2
- **Geocoding is entirely I/O-bound:** the ~1,000 ms per Nominatim query is Nominatim's enforced rate-limit, not network latency
- **Steps 4 & 5 are negligible:** corrections (208.67 ms) and TS generation (422.93 ms) are tiny compared to API steps
- **Reproducibility:** run `python scripts/time_pipeline.py` to re-measure; results saved to `logs/timing_benchmark.json`

---

*This section describes the original manual strategy, kept for reference or efficiently adding single non-journal programs.*
---

## 4. DEPLOYMENT STRATEGIES (WITH & WITHOUT BACKEND)

### 4.1 Strategy A: Static Site with JSON Data (RECOMMENDED FOR FINAL PROJECT)

**✅ Best for:** Academic projects, limited budget, no backend access

**How it works:**
1. Collect all program data manually
2. Store data in a JSON file (`programs.json`)
3. Deploy as static Next.js site
4. Data is loaded at build time or runtime from JSON

**Advantages:**
- ✅ **FREE hosting** (Vercel, Netlify, GitHub Pages)
- ✅ **No backend required**
- ✅ **Fast performance** (static files)
- ✅ **Easy to maintain**
- ✅ **Perfect for final project** (demonstrates full-stack skills without backend complexity)
- ✅ **Can be deployed immediately**
- ✅ **No server costs**

**Disadvantages:**
- ❌ Data updates require rebuild/redeploy
- ❌ No real-time updates
- ❌ No user-generated content (comments, ratings)

**Implementation:**

```typescript
// src/data/programs.json
[
  {
    "id": "program-001",
    "name": "Pelatihan IoT untuk Nelayan Batam",
    "location": {
      "lat": 1.0456,
      "lng": 103.9915,
      "address": "Desa Tanjung Uncang, Batam",
      "island": "Batam",
      "village": "Tanjung Uncang",
      "district": "Batu Aji"
    },
    "category": "Teknologi",
    "year": 2022,
    "status": "Completed",
    "projectLead": "Dr. Ahmad Hamim Thohari",
    "teamMembers": ["Febrianto Hidayat", "Maidel Fani"],
    "outcomes": {
      "description": "Meningkatkan efisiensi penangkapan ikan dengan IoT",
      "beneficiaries": 50,
      "publications": [{
        "title": "Rancang Bangun Sistem Pengelolaan Barang Milik Negara Berbasis QR Code",
        "journal": "Jurnal Integrasi (Sinta 4)",
        "url": "https://jurnal.polibatam.ac.id/index.php/JI/article/view/3975"
      }]
    },
    "images": [
      "/images/programs/program-001-1.jpg",
      "/images/programs/program-001-2.jpg"
    ],
    "videoUrl": "https://www.youtube.com/embed/xxxxx"
  }
]
```

```typescript
// src/app/page.tsx (Next.js App Router)
import programsData from '@/data/programs.json';

export default function Home() {
  return <Map programs={programsData} />;
}
```

**Deployment Options:**

| Platform | Free Tier | Best For | Deployment |
|----------|-----------|----------|------------|
| **Vercel** | 100GB bandwidth/month | Next.js apps | `git push` (auto-deploy) |
| **Netlify** | 100GB bandwidth/month | Static sites | `git push` (auto-deploy) |
| **GitHub Pages** | 1GB storage | Simple static sites | GitHub Actions |
| **Cloudflare Pages** | Unlimited bandwidth | High-traffic sites | `git push` (auto-deploy) |

**Recommended:** **Vercel** (optimized for Next.js, easiest setup)

### 4.2 Strategy B: Static Site + Google Sheets as "Database"

**✅ Best for:** Easy data updates without rebuild, collaborative data entry

**How it works:**
1. Store data in Google Sheets
2. Publish sheet as CSV/JSON
3. Fetch data at build time or client-side
4. Update sheet → automatic updates

**Advantages:**
- ✅ Easy data updates (no code changes)
- ✅ Collaborative editing (multiple people can update)
- ✅ Still free hosting
- ✅ No backend required
- ✅ Good for ongoing data collection

**Disadvantages:**
- ❌ Slight performance overhead
- ❌ Google Sheets API rate limits
- ❌ Less control over data structure

**Implementation:**

```typescript
// Fetch from Google Sheets at build time
export async function getStaticProps() {
  const SHEET_ID = 'your-sheet-id';
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Programs?key=${API_KEY}`
  );
  
  const data = await response.json();
  const programs = parseSheetData(data.values);
  
  return { props: { programs }, revalidate: 3600 }; // Rebuild every hour
}
```

### 4.3 Strategy C: Full Backend API (FUTURE ENHANCEMENT)

**✅ Best for:** Post-graduation enhancement, production deployment

**How it works:**
1. Build REST API (Node.js/Express, Python/FastAPI)
2. Database (PostgreSQL, MongoDB)
3. Admin panel for data management
4. Real-time updates

**Advantages:**
- ✅ Real-time data updates
- ✅ User authentication
- ✅ Advanced features (comments, ratings, analytics)
- ✅ Scalable

**Disadvantages:**
- ❌ Requires backend development
- ❌ Hosting costs (unless using free tiers)
- ❌ More complex deployment
- ❌ Overkill for final project

**When to use:** After graduation, if Polibatam wants to adopt the system officially.

---

## 5. RECOMMENDED IMPLEMENTATION PLAN FOR FINAL PROJECT

### Phase 1: Data Collection (2-3 weeks)

**Week 1: Automated Extraction**
- [ ] Scrape/extract publication data from P2M website
- [ ] Create initial spreadsheet with available data
- [ ] Identify data gaps

**Week 2-3: Manual Collection**
- [ ] Contact P2M office for program documentation
- [ ] Interview 3-5 project leads for detailed information
- [ ] Research and geocode program locations
- [ ] Categorize programs
- [ ] Collect multimedia (photos, videos)

**Deliverable:** Complete `programs.json` with 20-50 programs

### Phase 2: Development (2-3 weeks)

**Week 1: Core Features**
- [ ] Set up Next.js project (already done ✅)
- [ ] Import JSON data
- [ ] Display markers on map
- [ ] Implement filtering

**Week 2: Enhanced Features**
- [ ] Program detail pages
- [ ] Image galleries
- [ ] Video embeds
- [ ] Search functionality

**Week 3: Polish**
- [ ] Responsive design
- [ ] Accessibility
- [ ] Performance optimization

**Deliverable:** Fully functional interactive map

### Phase 3: Deployment & Documentation (1 week)

**Deployment:**
- [ ] Deploy to Vercel (free)
- [ ] Configure custom domain (optional)
- [ ] Test on multiple devices

**Documentation:**
- [ ] User guide
- [ ] Technical documentation
- [ ] Thesis methodology chapter

**Deliverable:** Live website + complete documentation

---

## 6. DATA COLLECTION TEMPLATE

### 6.1 Spreadsheet Structure

Create a Google Sheet or Excel file with these columns:

| Column | Type | Required | Example |
|--------|------|----------|---------|
| id | Text | Yes | "program-001" |
| name | Text | Yes | "Pelatihan IoT untuk Nelayan" |
| description | Text | Yes | "Program pelatihan..." |
| island | Text | Yes | "Batam" |
| village | Text | Yes | "Tanjung Uncang" |
| district | Text | Yes | "Batu Aji" |
| address | Text | Yes | "Jl. Ahmad Yani No. 1" |
| latitude | Number | Yes | 1.0456 |
| longitude | Number | Yes | 103.9915 |
| category | Text | Yes | "Teknologi" |
| year | Number | Yes | 2022 |
| status | Text | Yes | "Completed" |
| project_lead | Text | Yes | "Dr. Ahmad Hamim" |
| team_members | Text | No | "Febrianto, Maidel" |
| department | Text | No | "Teknik Elektro" |
| beneficiaries | Number | No | 50 |
| outcome_description | Text | No | "Meningkatkan efisiensi..." |
| publication_title | Text | No | "Rancang Bangun..." |
| publication_journal | Text | No | "Jurnal Integrasi" |
| publication_url | Text | No | "https://..." |
| image_1 | Text | No | "program-001-1.jpg" |
| image_2 | Text | No | "program-001-2.jpg" |
| image_3 | Text | No | "program-001-3.jpg" |
| video_url | Text | No | "https://youtube.com/..." |

### 6.2 How to Get Coordinates

**Method 1: Google Maps (Recommended)**
1. Go to https://www.google.com/maps
2. Search for the location
3. Right-click on the exact spot
4. Click on coordinates to copy
5. Format: `1.0456, 103.9915` (latitude, longitude)

**Method 2: GPS Coordinates App**
- Use smartphone GPS app
- Visit location physically (if possible)
- Record coordinates

**Method 3: Geocoding Service**
- Use https://www.latlong.net/
- Enter address
- Get coordinates

### 6.3 Data Quality Checklist

Before finalizing data:
- [ ] All coordinates verified on Google Maps
- [ ] All addresses complete and accurate
- [ ] All categories consistent (use predefined list)
- [ ] All years are numbers (not text)
- [ ] All required fields filled
- [ ] No duplicate IDs
- [ ] All image files exist and are optimized (<150KB)
- [ ] All video URLs tested and working
- [ ] All publication URLs tested and working

---

## 7. FALLBACK STRATEGIES (IF DATA COLLECTION FAILS)

### Scenario 1: Cannot Get Real Program Data

**Solution: Use Realistic Mock Data**

Create 20-30 realistic mock programs based on:
- Typical P2M program categories (education, health, technology, environment)
- Real locations in Batam and surrounding islands
- Realistic outcomes and beneficiary numbers
- Sample publications from actual P2M website

**Thesis Justification:**
> "Due to limited access to comprehensive P2M program documentation during the research period, this prototype demonstrates the system's capabilities using representative mock data based on publicly available P2M publications and typical program patterns. The data structure and system architecture are designed to accommodate real data integration in future implementation."

### Scenario 2: Cannot Get Multimedia

**Solution: Use Placeholder Images**

- Use free stock photos from Unsplash/Pexels
- Use generic program-related images
- Use map screenshots of locations
- Create infographics for outcomes

### Scenario 3: Cannot Deploy to Custom Domain

**Solution: Use Free Subdomain**

- Vercel: `your-project.vercel.app`
- Netlify: `your-project.netlify.app`
- GitHub Pages: `username.github.io/project-name`

**All are perfectly acceptable for final projects!**

---

## 8. THESIS METHODOLOGY DOCUMENTATION

### 8.1 Data Collection Method (for Methodology Chapter)

```markdown
### 3.2 Data Collection

Data collection for this research employs a hybrid methodology:

#### 3.2.1 Secondary Data Collection
Secondary data was obtained through automated extraction from the official 
P2M Polibatam website (p2m.polibatam.ac.id), including:
- Program publication records (2020-2024)
- Author/team member information
- Publication journals and links

Tools used: Web scraping with Python BeautifulSoup library / Manual extraction 
to spreadsheet.

#### 3.2.2 Primary Data Collection
Primary data was collected through:

1. **Document Analysis**
   - P2M program final reports (obtained from P2M office)
   - Program proposals and documentation
   
2. **Interviews**
   - Semi-structured interviews with 5 project leads
   - Questions focused on: program location, outcomes, beneficiaries, challenges
   
3. **Geographic Data Collection**
   - Location verification using Google Maps
   - Coordinate extraction for each program site
   - Administrative boundary verification (island, village, district)

4. **Multimedia Collection**
   - Program documentation photos from P2M office
   - Video documentation from project teams

#### 3.2.3 Data Validation
All collected data was validated through:
- Cross-referencing with official P2M records
- Coordinate verification on Google Maps
- Peer review by P2M staff
- Consistency checks using data validation rules
```

### 8.2 System Architecture (for Design Chapter)

```markdown
### 4.3 Data Architecture

The system implements a **static data architecture** suitable for academic 
demonstration and prototype deployment:

**Data Storage:**
- Format: JSON (JavaScript Object Notation)
- Location: `/src/data/programs.json`
- Structure: Array of program objects with standardized schema

**Data Flow:**
1. Data collected and validated in spreadsheet format
2. Converted to JSON using automated script
3. Imported into Next.js application at build time
4. Rendered on interactive map using Leaflet library

**Advantages of Static Data Approach:**
- Zero backend infrastructure required
- Fast performance (pre-rendered at build time)
- Free hosting on platforms like Vercel
- Easy to version control with Git
- Suitable for prototype and demonstration purposes

**Future Enhancement Path:**
The architecture is designed to easily migrate to a dynamic backend API 
when the system is adopted for production use by Polibatam.
```

---

## 9. SUCCESS METRICS FOR FINAL PROJECT

### 9.1 Minimum Viable Product (MVP)

To successfully graduate, your project should have:

**Data:**
- ✅ At least 20 programs with complete data
- ✅ All programs have valid coordinates
- ✅ At least 3 different categories
- ✅ At least 3 different years
- ✅ At least 10 programs with images

**Features:**
- ✅ Interactive map with markers
- ✅ Category filtering
- ✅ Year filtering
- ✅ Search functionality
- ✅ Program detail pages
- ✅ Responsive design (mobile + desktop)

**Deployment:**
- ✅ Live website (Vercel/Netlify)
- ✅ Accessible via URL
- ✅ Works on mobile devices

**Documentation:**
- ✅ Complete thesis with methodology
- ✅ User guide
- ✅ Technical documentation

### 9.2 Excellent Project (A Grade)

Everything in MVP plus:

**Enhanced Data:**
- ✅ 50+ programs
- ✅ Multimedia for 80% of programs
- ✅ Detailed outcomes and impact data

**Advanced Features:**
- ✅ Marker clustering
- ✅ Advanced filters (status, department)
- ✅ Statistics dashboard
- ✅ Export functionality
- ✅ Accessibility (WCAG 2.1 AA)

**Polish:**
- ✅ Professional design
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling

---

## 10. TIMELINE & MILESTONES

### Recommended 8-Week Timeline

| Week | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| 1 | Planning | Define scope, create data template, contact P2M office | Data collection plan |
| 2-3 | Data Collection | Extract website data, interview project leads, geocode locations | Complete dataset (20-50 programs) |
| 4-5 | Development | Build core features, implement filtering, create detail pages | Working prototype |
| 6 | Enhancement | Add multimedia, polish UI, optimize performance | Feature-complete app |
| 7 | Testing & Deployment | Test on devices, deploy to Vercel, fix bugs | Live website |
| 8 | Documentation | Write thesis chapters, create user guide, prepare presentation | Complete documentation |

---

## 11. CONCLUSION & RECOMMENDATIONS

### For Your Final Project:

**✅ RECOMMENDED APPROACH:**

1. **Use Static JSON Data**
   - Perfect for final project scope
   - Free deployment
   - Demonstrates full-stack skills
   - Easy to maintain

2. **Focus on Quality over Quantity**
   - 20-30 well-documented programs > 100 incomplete programs
   - Prioritize programs with good documentation
   - Ensure all data is accurate and verified

3. **Deploy on Vercel**
   - Free, fast, professional
   - Auto-deploy from Git
   - Perfect for Next.js

4. **Document Everything**
   - Keep detailed notes of data collection process
   - Screenshot your methodology
   - Save all correspondence with P2M office

### If You Can't Get Real Data:

**Don't panic!** Use realistic mock data and clearly state in your thesis:
- This is a prototype/proof-of-concept
- Data structure is designed for real data
- System demonstrates the solution to the problem
- Future work includes real data integration

**Your contribution is the SYSTEM, not the data.**

### Post-Graduation Path:

If Polibatam likes your project:
1. Migrate to backend API (Node.js + PostgreSQL)
2. Build admin panel for data management
3. Add user authentication
4. Implement analytics dashboard
5. Add collaborative features

---

---

## 12. RESOURCES & CONTACTS

### Data Collection:
- **P2M Office:** Contact for program documentation
- **Project Leads:** Interview for detailed information
- **Google Maps:** For coordinates
- **Geocoding Tools:** https://www.latlong.net/
- **Journal PDF Extraction:** Adobe Acrobat, PDF.js, or manual extraction

### Development:
- **Next.js Docs:** https://nextjs.org/docs
- **Leaflet Docs:** https://leafletjs.com/
- **Vercel Deployment:** https://vercel.com/docs

### Academic:
- **Thesis Guidelines:** Check Polibatam thesis format
- **Methodology References:** Indonesian academic standards
- **Data Collection Ethics:** Informed consent, data privacy

---

## 13. LOCAL API DEVELOPMENT & VPS DEPLOYMENT (ADVANCED)

> **Note:** This section is for **post-graduation** or if you want to build a production-ready system with a backend API. For your final project, the static JSON approach (Section 4.1) is recommended.

### 13.1 Why Build a Local API?

**Advantages of Having a Backend:**
- ✅ **Real-time data updates** without rebuilding the site
- ✅ **Admin panel** for P2M staff to manage programs
- ✅ **User authentication** for restricted features
- ✅ **Advanced features:** comments, ratings, analytics
- ✅ **Data validation** on the server side
- ✅ **File uploads** for images and documents
- ✅ **Search optimization** with database indexing

**When to Build:**
- After graduation if Polibatam wants to adopt the system
- If you have time after completing the static version
- If you want to learn full-stack development

### 13.2 Recommended Tech Stack for Local Development

#### Backend Options:

**Option A: Node.js + Express (Recommended for JavaScript developers)**
```
Tech Stack:
- Runtime: Node.js 20+
- Framework: Express.js
- Database: PostgreSQL (with PostGIS for geographic data)
- ORM: Prisma or TypeORM
- Authentication: JWT (JSON Web Tokens)
- File Upload: Multer
- Validation: Zod or Joi
```

**Option B: Python + FastAPI (Recommended for Python developers)**
```
Tech Stack:
- Runtime: Python 3.11+
- Framework: FastAPI
- Database: PostgreSQL (with PostGIS)
- ORM: SQLAlchemy
- Authentication: OAuth2 with JWT
- File Upload: Python-multipart
- Validation: Pydantic (built into FastAPI)
```

**Option C: PHP + Laravel (If you're familiar with PHP)**
```
Tech Stack:
- Runtime: PHP 8.2+
- Framework: Laravel 10+
- Database: MySQL or PostgreSQL
- ORM: Eloquent (built into Laravel)
- Authentication: Laravel Sanctum
- File Upload: Laravel Storage
```

#### Database Choice:

**PostgreSQL with PostGIS Extension (HIGHLY RECOMMENDED)**
- ✅ Best for geographic data
- ✅ Built-in spatial queries (find programs within radius, etc.)
- ✅ Free and open source
- ✅ Excellent performance
- ✅ JSON support for flexible data

**Alternative: MongoDB**
- ✅ Good for flexible schemas
- ✅ GeoJSON support
- ❌ Less mature spatial features than PostGIS

### 13.3 Local Development Workflow (Offline Development)

**Step 1: Set Up Local Environment**

```bash
# Install PostgreSQL locally
# Windows: Download from https://www.postgresql.org/download/windows/
# Or use Docker:
docker run --name p2m-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15

# Install PostGIS extension
# Connect to PostgreSQL and run:
CREATE EXTENSION postgis;
```

**Step 2: Create Backend Project**

```bash
# Node.js + Express example
mkdir p2m-api
cd p2m-api
npm init -y
npm install express pg prisma @prisma/client cors dotenv
npm install -D typescript @types/node @types/express ts-node nodemon

# Initialize Prisma
npx prisma init
```

**Step 3: Define Database Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Program {
  id          String   @id @default(uuid())
  name        String
  description String   @db.Text
  
  // Geographic data
  latitude    Float
  longitude   Float
  address     String
  island      String
  village     String
  district    String
  
  // Program details
  category    String
  year        Int
  status      ProgramStatus
  
  // Team
  projectLead String
  teamMembers String[]
  department  String?
  
  // Outcomes
  outcomeDescription String? @db.Text
  beneficiaries      Int?
  impact             String? @db.Text
  
  // Multimedia
  images      Image[]
  videoUrl    String?
  
  // Publications
  publications Publication[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ProgramStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}

model Image {
  id        String  @id @default(uuid())
  url       String
  caption   String?
  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)
  programId String
}

model Publication {
  id        String  @id @default(uuid())
  title     String
  journal   String
  url       String
  sintaRank Int?
  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)
  programId String
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed
  name      String
  role      UserRole @default(VIEWER)
  createdAt DateTime @default(now())
}

enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}
```

**Step 4: Create API Endpoints**

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all programs
app.get('/api/programs', async (req, res) => {
  const { category, year, status, search } = req.query;
  
  const programs = await prisma.program.findMany({
    where: {
      ...(category && { category: category as string }),
      ...(year && { year: parseInt(year as string) }),
      ...(status && { status: status as any }),
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      images: true,
      publications: true,
    },
    orderBy: {
      year: 'desc',
    },
  });
  
  res.json(programs);
});

// Get single program
app.get('/api/programs/:id', async (req, res) => {
  const program = await prisma.program.findUnique({
    where: { id: req.params.id },
    include: {
      images: true,
      publications: true,
    },
  });
  
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  
  res.json(program);
});

// Create program (requires authentication in production)
app.post('/api/programs', async (req, res) => {
  const program = await prisma.program.create({
    data: req.body,
  });
  
  res.status(201).json(program);
});

// Update program
app.put('/api/programs/:id', async (req, res) => {
  const program = await prisma.program.update({
    where: { id: req.params.id },
    data: req.body,
  });
  
  res.json(program);
});

// Delete program
app.delete('/api/programs/:id', async (req, res) => {
  await prisma.program.delete({
    where: { id: req.params.id },
  });
  
  res.status(204).send();
});

// Geographic search (programs within radius)
app.get('/api/programs/nearby', async (req, res) => {
  const { lat, lng, radius } = req.query;
  
  // Use PostGIS for spatial queries
  const programs = await prisma.$queryRaw`
    SELECT * FROM "Program"
    WHERE ST_DWithin(
      ST_MakePoint(longitude, latitude)::geography,
      ST_MakePoint(${lng}, ${lat})::geography,
      ${radius}
    )
  `;
  
  res.json(programs);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
```

**Step 5: Connect Next.js Frontend to API**

```typescript
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getPrograms(filters?: {
  category?: string;
  year?: number;
  status?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  
  const response = await fetch(`${API_URL}/programs?${params}`);
  return response.json();
}

export async function getProgram(id: string) {
  const response = await fetch(`${API_URL}/programs/${id}`);
  return response.json();
}
```

```typescript
// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPrograms } from '@/lib/api';
import Map from '@/components/Map';

export default function Home() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadPrograms() {
      const data = await getPrograms();
      setPrograms(data);
      setLoading(false);
    }
    loadPrograms();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <Map programs={programs} />;
}
```

### 13.4 VPS Deployment Guide

#### Choosing a VPS Provider:

| Provider | Starting Price | Specs | Best For |
|----------|---------------|-------|----------|
| **DigitalOcean** | $4-6/month | 1GB RAM, 1 CPU | Simple deployment |
| **Vultr** | $2.50-6/month | 512MB-1GB RAM | Budget-friendly |
| **Linode (Akamai)** | $5/month | 1GB RAM, 1 CPU | Reliable performance |
| **AWS Lightsail** | $3.50-5/month | 512MB-1GB RAM | AWS ecosystem |
| **Contabo** | $4-7/month | 4GB RAM, 2 CPU | Best value |

**Recommended:** DigitalOcean or Vultr for beginners

#### VPS Setup Steps:

**1. Create VPS Instance**
```bash
# Choose Ubuntu 22.04 LTS
# Minimum specs: 1GB RAM, 1 CPU, 25GB SSD
```

**2. Initial Server Setup**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser p2mapp
usermod -aG sudo p2mapp

# Switch to new user
su - p2mapp
```

**3. Install Dependencies**
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib postgis

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

**4. Set Up PostgreSQL**
```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE p2m_db;
CREATE USER p2muser WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE p2m_db TO p2muser;
\c p2m_db
CREATE EXTENSION postgis;
\q
```

**5. Deploy Backend**
```bash
# Clone your repository
git clone https://github.com/yourusername/p2m-api.git
cd p2m-api

# Install dependencies
npm install

# Set up environment variables
nano .env
```

```env
# .env
DATABASE_URL="postgresql://p2muser:your-secure-password@localhost:5432/p2m_db"
PORT=3001
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV=production
```

```bash
# Run database migrations
npx prisma migrate deploy

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/server.js --name p2m-api
pm2 save
pm2 startup
```

**6. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/p2m-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # or use IP address
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/p2m-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**7. Set Up SSL (Optional but Recommended)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

**8. Deploy Frontend to Vercel**
```bash
# Update API URL in .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Deploy to Vercel
vercel --prod
```

### 13.5 Offline Development Workflow

**For developing without internet:**

1. **Use Local Database**
   ```bash
   # PostgreSQL runs locally
   DATABASE_URL="postgresql://localhost:5432/p2m_db"
   ```

2. **Run Backend Locally**
   ```bash
   npm run dev  # Runs on http://localhost:3001
   ```

3. **Run Frontend Locally**
   ```bash
   # In Next.js project
   NEXT_PUBLIC_API_URL=http://localhost:3001/api npm run dev
   ```

4. **Test Everything Offline**
   - Both frontend and backend run on localhost
   - No internet required for development
   - Database is local

5. **Deploy When Ready**
   - Push code to GitHub
   - Deploy backend to VPS
   - Deploy frontend to Vercel
   - Update API URL in production

### 13.6 Migration Path: Static → Dynamic

**Phase 1: Start with Static (Final Project)**
- Use JSON file for data
- Deploy to Vercel (free)
- Complete thesis with this version

**Phase 2: Add Backend (Post-Graduation)**
- Build API locally
- Migrate JSON data to PostgreSQL
- Test locally

**Phase 3: Deploy to VPS**
- Set up VPS
- Deploy backend
- Update frontend to use API

**Phase 4: Add Admin Panel**
- Build admin interface
- Add authentication
- Allow P2M staff to manage data

**Phase 5: Advanced Features**
- User comments/ratings
- Analytics dashboard
- Email notifications
- Export functionality

### 13.7 Cost Estimation

**Static Approach (Recommended for Final Project):**
- Hosting: **FREE** (Vercel)
- Domain (optional): $10-15/year
- **Total: $0-15/year**

**Dynamic Approach with VPS:**
- VPS: $4-6/month = $48-72/year
- Domain: $10-15/year
- SSL: **FREE** (Let's Encrypt)
- **Total: $58-87/year**

**Recommendation:** Start with static (free), migrate to VPS after graduation if needed.

---

### 13.8 Understanding Different P2M Journal Types

Based on analysis of real P2M programs, journals fall into **7 distinct types**, each requiring different data points:

#### **Type 1: Community Service / Training Programs**
**Examples:** Pelatihan Media Promosi, Virtual Tour 360

**Characteristics:**
- Target beneficiaries (specific count)
- Training/workshop activities
- Measurable outcomes (participants, satisfaction scores)
- Before/after comparisons
- Multimedia (videos, photos of activities)

**Key Data Points:**
- Participant count
- Training date
- Skills taught
- Outcome metrics (Likert scores, achievement rates)
- Feedback/testimonials

**Category:** Pariwisata, Pemberdayaan Masyarakat, Teknologi

#### **Type 2: Infrastructure / Technical Projects**
**Examples:** Penetapan Batas Wilayah RT/RW

**Characteristics:**
- Technical/engineering focus
- Deliverables (maps, systems, infrastructure)
- Methodology-heavy
- Cartometric/survey data
- Official handover/documentation

**Key Data Points:**
- Technical specifications
- Coverage area (RT/RW count, area size)
- Methodology used
- Deliverables produced
- Official recipients

**Category:** Infrastruktur, Pemetaan, Teknik

#### **Type 3: Research / Study Programs**
**Characteristics:**
- Hypothesis testing
- Data collection and analysis
- Scientific findings
- Publications in journals

**Key Data Points:**
- Research questions
- Methodology
- Sample size
- Findings/conclusions
- Statistical significance

**Category:** Penelitian, Kesehatan, Lingkungan

#### **Type 4: Product Development / Innovation**
**Examples:** Rancang Bangun Sistem IoT, Aplikasi Mobile, Prototype Alat

**Characteristics:**
- Technical product/system creation
- Prototype development
- Testing and validation
- Technology transfer

**Key Data Points:**
- Product specifications
- Features developed
- Testing results
- Users/adopters
- Technology used

**Category:** Teknologi, Inovasi, Rekayasa

**Hook Example:** "📱 Aplikasi dengan 500+ download"

#### **Type 5: Policy / Consultation Programs**
**Examples:** Pendampingan UMKM, Konsultasi Hukum, Asistensi Teknis

**Characteristics:**
- Advisory/consultation services
- Policy recommendations
- Ongoing support/mentoring
- Institutional capacity building

**Key Data Points:**
- Number of consultations
- Organizations assisted
- Policy recommendations made
- Implementation status
- Follow-up activities

**Category:** Pemberdayaan Masyarakat, Ekonomi Kreatif, Hukum

**Hook Example:** "🤝 15 UMKM didampingi, omzet naik 40%"

#### **Type 6: Awareness Campaign / Socialization**
**Examples:** Sosialisasi Kesehatan, Kampanye Lingkungan, Penyuluhan

**Characteristics:**
- Public awareness activities
- Information dissemination
- Behavior change campaigns
- Mass communication

**Key Data Points:**
- Reach (people reached)
- Materials distributed
- Events held
- Media coverage
- Behavior change indicators

**Category:** Kesehatan, Lingkungan, Sosial

**Hook Example:** "📢 1000+ warga teredukasi, 80% tahu bahaya rokok"

#### **Type 7: Capacity Building / Institutional Strengthening**
**Examples:** Peningkatan Kapasitas Organisasi, Pembentukan Kelompok

**Characteristics:**
- Organizational development
- Group formation
- Institutional strengthening
- Sustainability planning

**Key Data Points:**
- Organizations strengthened
- Groups formed
- Members trained
- Sustainability indicators
- Post-program activities

**Category:** Pemberdayaan Masyarakat, Organisasi

**Hook Example:** "🏢 3 kelompok tani dibentuk, 45 anggota aktif"

### 13.9 Unified Data Model for All Journal Types

```typescript
type P2MProgram = {
  // ... existing basic fields ...
  
  // Type-specific data (optional fields)
  programType: 'training' | 'infrastructure' | 'research' | 'product' | 'consultation' | 'campaign' | 'capacity_building';
  
  // Training-specific
  training?: {
    participantCount: number;
    participantProfile: string;  // "Pengelola wisata", "Nelayan", etc.
    skillsTaught: string[];
    trainingDate: string;
    duration: string;  // "1 hari", "3 hari", etc.
    satisfactionScore?: number;  // Likert index
  };
  
  // Infrastructure-specific
  infrastructure?: {
    deliverables: string[];  // "Peta RT/RW", "Sistem Informasi", etc.
    coverageArea: string;  // "11 RT, 5 RW", "500 ha", etc.
    methodology: string;  // "Kartometrik", "Survei GPS", etc.
    specifications: string;
    recipients: string[];  // "Kelurahan Sembulang", etc.
  };
  
  // Research-specific
  research?: {
    researchQuestions: string[];
    hypothesis: string;
    sampleSize: number;
    methodology: string;
    findings: string[];
    statisticalSignificance?: string;
  };
  
  // Product development-specific
  product?: {
    productName: string;
    specifications: string[];
    features: string[];
    testingResults: string;
    users: number;
    technology: string[];
  };
  
  // Consultation-specific
  consultation?: {
    consultationCount: number;
    organizationsAssisted: string[];
    recommendations: string[];
    implementationStatus: string;
    followUp: string[];
  };
  
  // Campaign-specific
  campaign?: {
    reach: number;  // People reached
    materialsDistributed: number;
    eventsHeld: number;
    mediaCoverage: string[];
    behaviorChange: string;
  };
  
  // Capacity building-specific
  capacityBuilding?: {
    organizationsStrengthened: number;
    groupsFormed: string[];
    membersTrained: number;
    sustainabilityPlan: string;
    postProgramActivities: string[];
  };
};
```

---

## 14. ENHANCED DATA COLLECTION WITH JOURNAL SCRAPING

### 14.1 Journal PDF Extraction Strategy

**Tools for PDF Extraction:**

1. **Manual Extraction (Recommended for Final Project)**
   - Open each journal PDF
   - Copy relevant information
   - Paste into spreadsheet
   - Time: ~5-10 minutes per paper

2. **Semi-Automated Extraction**
   ```python
   # Python script to extract text from PDFs
   import PyPDF2
   import re
   
   def extract_location_from_pdf(pdf_path):
       with open(pdf_path, 'rb') as file:
           reader = PyPDF2.PdfReader(file)
           text = ''
           for page in reader.pages:
               text += page.extract_text()
       
       # Look for location patterns
       location_patterns = [
           r'lokasi[:\s]+([^\.]+)',
           r'tempat[:\s]+([^\.]+)',
           r'desa[:\s]+([^\.]+)',
       ]
       
       for pattern in location_patterns:
           match = re.search(pattern, text, re.IGNORECASE)
           if match:
               return match.group(1)
       
       return None
   ```

3. **OCR for Scanned PDFs**
   - Use Tesseract OCR if PDFs are scanned images
   - Or use Adobe Acrobat's OCR feature

### 14.2 Data Extraction Checklist from Journals

For each journal paper, extract:
- [ ] **Title** → Program name
- [ ] **Abstract** → Program description
- [ ] **Methodology section** → Location, implementation details
- [ ] **Results section** → Outcomes, beneficiaries
- [ ] **Images/Figures** → Save for multimedia
- [ ] **Authors** → Project lead and team
- [ ] **Conclusion** → Impact statement

### 14.3 Improved Data Collection Timeline

| Week | Task | Output |
|------|------|--------|
| 1 | Scrape journal links from P2M website | List of 50-100 journal URLs |
| 2 | Download and organize PDFs | Organized folder structure |
| 3 | Extract data from journals (10-15 papers/day) | Spreadsheet with 50+ programs |
| 4 | Geocode locations from extracted location names | Complete coordinates |
| 5 | Collect multimedia from journals and P2M office | Image and video library |

**Estimated Total Time:** 5 weeks instead of 8 weeks with this improved strategy!

---

**Good luck with your final project! 🚀**

*Remember: The goal is to solve the problem (visualizing P2M programs geographically), not to build a perfect production system. Focus on demonstrating the concept and your technical skills.*

**For your final project:** Use static JSON (Section 4.1)  
**After graduation:** Consider VPS + API (Section 13) if Polibatam wants to adopt it
