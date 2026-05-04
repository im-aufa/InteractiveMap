# 🗺️ P2M Interactive Map Application

> Interactive map visualization for 50+ P2M (Pengabdian Kepada Masyarakat) programs at Politeknik Negeri Batam.

![Project Status](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)

## 📖 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Data Pipeline](#-data-pipeline)
- [Documentation](#-documentation)

## ✨ Features

### 🗺️ Interactive Map
- **Clustered Markers**: Efficiently handles large datasets with dynamic clustering.
- **Theme-Aware**: Fully supported dark/light mode for all map elements.
- **Custom Popups**: 
  - **Single**: Glassmorphism cards with details.
  - **Cluster**: Scrollable lists for grouped locations.
- **Smart Controls**: "Reset View" button to instantly focus on Batam.
- **GPS Locate** *(v3.0)*: "Locate Me" button flies the map to the user's current GPS position.
- **Satellite/Street Toggle** *(v3.0)*: Switch base map layer between street and satellite views with one click.

### 🔍 Advanced Filtering & Search
- **Responsive Drawer System**:
  - **Desktop**: Side drawer for easy access.
  - **Mobile**: Touch-friendly Bottom Sheet with drag gestures.
- **Multi-Criteria Filter**: Filter by **Category** (10 P2M domains), **Year**, and **Status**.
- **Visual Feedback**: Category-specific colors and icons (e.g., Education = Blue/Cap, Health = Red/Heart).
- **Real-time Search**: Instant name-based search with auto-pan functionality.
- **Autocomplete Dropdown** *(v3.0)*: Keyboard-navigable suggestion list with program name, address, and category badge.

### 📱 Responsive Design
- Mobile-first approach with touch targets >44px.
- Adaptive layouts for phones, tablets, and desktops.

### 🎓 Onboarding Experience
- **Splash Screen**: Engaging welcome screen with smooth entrance animations.
- **Interactive Tutorial** *(v3.0 — 6 Steps, Bahasa Indonesia)*: Step-by-step guided tour covering Filters, Search (with autocomplete hint), Theme, Map Controls (GPS + Satellite), Markers/Clusters, and the Help button.
- **Help Button** *(v3.0)*: Persistent floating `?` button lets users replay the tutorial at any time.
- **Smart Persistence**: Tutorial and splash screen status memorized for the session.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/interactive-map-app.git
    cd interactive-map-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 (+ globals.css) |
| **Map Engine** | Leaflet 1.9, react-leaflet 5.0 |
| **Icons** | Lucide React, React Icons |
| **Deployment** | Vercel (Recommended) |

## 📂 Project Structure

```
interactive-map-app/
├── src/
│   ├── app/              # Next.js Pages & Layouts
│   ├── components/       # UI Components (Map, Header, FilterMenu)
│   ├── context/          # Global State (MapContext, ThemeContext)
│   ├── data/             # Static Data (programs.ts)
│   └── hooks/            # Custom Hooks (useMediaQuery, useDebounce)
├── public/               # Assets (Markers, Images)
└── data-extraction-workspace/ # Python ETL Scripts
```

## 📊 Data Pipeline

The project uses a **4-step AI-assisted ETL pipeline** to transform 49 PDF journals into the live map data.

| Step | Script | Operation | Timing |
|------|--------|-----------|--------|
| 1 | `extract_with_chatgpt.py` | PyPDF2 text read (per PDF) | **515.79 ms avg** ✅ |
| 2 | `extract_with_chatgpt.py` | GPT-3.5-turbo API call (per PDF) | **~4,367 ms avg** (derived) |
| 3 | `geocode_locations.py` | Nominatim geocoding (per query) | **~1,210 ms** (rate-limited) |
| 3 | `geocode_locations.py` | KNOWN_LOCATIONS dict lookup | **1.32 µs** ✅ |
| 4 | `apply_json_corrections.py` | Per-file correction patch | **16.97 ms** ✅ |
| 5 | `json_to_ts.py` | Full TS generation (48 files) | **422.93 ms** ✅ |
| **Total** | All scripts | **Full pipeline** | **~293,060 ms ≈ 4 min 53 sec** |

> ✅ = directly measured · derived = calculated from actual log (`logs/extraction_log_20251214_221345.txt`)  
> 🤖 GPT API accounts for **90.1%** of total pipeline time.  
> Run `python scripts/time_pipeline.py` to reproduce all measurements.

See [DATA_STRATEGY.md](./DATA_STRATEGY.md) for the full pipeline documentation and performance analysis.

## 📝 Documentation

We maintain detailed documentation for development and deployment:

- **[CHANGELOG.md](./CHANGELOG.md)**: Version history (Latest: v3.0.0).
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Deployment guides (Vercel, Netlify).
- **[DOCS.md](./DOCS.md)**: Architecture deep dive and roadmap.

---

**Built for Politeknik Negeri Batam** | Final Project (Tugas Akhir) 2024