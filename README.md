# 🗺️ P2M Interactive Map Application

> Interactive map visualization for 50+ P2M (Pengabdian Kepada Masyarakat) programs at Politeknik Negeri Batam

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)

## 🚀 Quick Start

```bash
cd interactive-map-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Documentation

- **[Complete Documentation](./DOCS.md)** - Architecture, features, UX patterns, **production action plan**
- **[Data Strategy](./DATA_STRATEGY.md)** - Data collection, processing & deployment
- **[Changelog](./interactive-map-app/CHANGELOG.md)** - Version history

> **🔴 CRITICAL:** See [DOCS.md Section 5](./DOCS.md#5-development-roadmap) for the production-ready action plan with deadlines and priorities.

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Map** | Leaflet 1.9, react-leaflet 5.0 |
| **Clustering** | react-leaflet-cluster 4.0 |
| **Components** | vaul (drawer), lucide-react (icons) |

## 📊 Project Status

| Metric | Value |
|--------|-------|
| **Version** | 2.1.0 |
| **Completion** | ~90% |
| **Last Updated** | December 2024 |
| **Current Phase** | Phase 4-5 (Architecture & Accessibility) |

## ✨ Features

✅ **Interactive Map**
- Custom category-based markers (10 P2M categories)
- Marker clustering for performance
- Hover states with smooth animations
- Pan & zoom to search results

✅ **Smart Filtering**
- Filter by category (Pendidikan, Kesehatan, Teknologi, Lingkungan, Ekonomi Kreatif, Pariwisata, Pemberdayaan Masyarakat, Infrastruktur, Pertanian, Kelautan)
- Filter by year (2020-2024)
- Filter by status (Planned, In Progress, Completed)
- Filter by location (Batam, Bintan, Karimun)
- Advanced filters (Target Beneficiary, Department, Media)
- Real-time marker updates
- Responsive drawer UI (mobile-first)

✅ **Search**
- Debounced search (300ms)
- Auto-pan/zoom to single result
- Case-insensitive matching

✅ **Program Details**
- Responsive image gallery (3→2→1 columns)
- Embedded video player
- Google Maps integration ("Get Directions")
- Dynamic routing (`/program/[id]`)

✅ **Responsive Design**
- Mobile-first approach
- Touch-friendly controls (44x44px minimum)
- Bottom sheet filters on mobile

## 🎯 Use Cases

| User Type | Primary Use | Key Features |
|-----------|-------------|--------------|
| **Students** | Explore P2M programs | Search, Filter, Quick Info |
| **Lecturers** | Review program details | Detail Pages, Multimedia |
| **Public** | Discover community programs | Map Exploration, Directions |

## 📁 Project Structure

```
interactive-map-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main map page
│   │   ├── layout.tsx         # Root layout
│   │   └── program/[id]/      # Detail pages
│   ├── components/            # React components
│   │   ├── Map.tsx           # Main map component
│   │   ├── HoverMarker.tsx   # Marker with hover
│   │   ├── Header.tsx        # Search + filter
│   │   └── ...
│   ├── context/              # React Context
│   ├── data/                 # Static data
│   └── hooks/                # Custom hooks
└── public/                   # Static assets
```

## 🧪 Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Environment Variables

No environment variables required for basic functionality. Optional:
- `NEXT_PUBLIC_API_URL` - For future API integration
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For enhanced directions

## 🗺️ Roadmap

- **Phase 4-5 (Current):** Architecture & Accessibility
- **Phase 6-7:** Performance & Visual Polish
- **Phase 8-9:** PWA Features & Testing

See [DOCS.md - Development Roadmap](./DOCS.md#5-development-roadmap) for detailed breakdown.

## 📝 Contributing

This is an academic project for Politeknik Negeri Batam. For questions or suggestions, please contact the project team.

## 📄 License

[Your License Here]

---

**Built with ❤️ for Politeknik Negeri Batam**  
**Project Type:** Final Project (Tugas Akhir)  
**Academic Year:** 2024