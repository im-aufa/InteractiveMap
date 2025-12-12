// src/data/programs.ts

export type Program = {
  id: string;
  name: string;
  category: 'Pendidikan' | 'Kesehatan' | 'Teknologi' | 'Lingkungan' | 'Ekonomi Kreatif' | 'Pariwisata' | 'Pemberdayaan Masyarakat' | 'Infrastruktur' | 'Pertanian' | 'Kelautan';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[]; // URLs to images
  videoUrl?: string; // URL to a video (e.g., YouTube embed URL)
  detailsUrl: string; // URL for more detailed info, maybe Wikipedia
  year: number;
  status: 'Planned' | 'In Progress' | 'Completed';
};

export const programs: Program[] = [
  // PROGRAM 1: REAL - Pelatihan Media Promosi Pulau Mubut
  {
    id: 'p2m-2022-001',
    name: 'Pelatihan Optimasi Media Promosi Desa Wisata Pulau Mubut',
    category: 'Pariwisata',
    description: 'Pelatihan optimasi Facebook sebagai media promosi untuk pengelola Desa Wisata Pulau Mubut. Program ini bertujuan meningkatkan kemampuan pengelola dalam mengelola media sosial untuk mempromosikan keindahan Pulau Mubut kepada calon wisatawan. Pelatihan mencakup teknik pengambilan foto dan video, pembuatan konten yang menarik, serta strategi Social Media Optimization (SMO).',
    location: {
      lat: 0.9892,
      lng: 104.0156,
      address: 'Pulau Mubut Darat, Galang, Batam, Kepulauan Riau',
    },
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1552581234-26160f608093?w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/kNpK7R49nco',
    detailsUrl: 'https://jurnal.polibatam.ac.id',
    year: 2022,
    status: 'Completed',
  },

  // PROGRAM 2: REAL - Virtual Tour 360 Pulau Mubut
  {
    id: 'p2m-2022-002',
    name: 'Pengembangan Virtual Tour 360 Interaktif Pulau Mubut',
    category: 'Teknologi',
    description: 'Pengembangan aplikasi Virtual Reality (VR) dengan video 360 derajat untuk memperkenalkan keindahan Pantai Mubut kepada calon wisatawan. Aplikasi ini memungkinkan pengguna merasakan pengalaman virtual tour seolah berada langsung di Pulau Mubut. Teknologi VR ini membantu meningkatkan minat wisatawan lokal maupun asing untuk berkunjung.',
    location: {
      lat: 0.9892,
      lng: 104.0156,
      address: 'Pulau Mubut Darat, Galang, Batam, Kepulauan Riau',
    },
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
      'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    detailsUrl: 'https://jurnal.polibatam.ac.id',
    year: 2022,
    status: 'Completed',
  },

  // PROGRAM 3: REAL - Penetapan Batas Wilayah Sembulang
  {
    id: 'p2m-2022-003',
    name: 'Penetapan Batas Wilayah RT & RW Kelurahan Sembulang',
    category: 'Infrastruktur',
    description: 'Pemetaan partisipatif untuk penetapan batas wilayah RT dan RW di Kelurahan Sembulang menggunakan metode kartometrik. Program ini menghasilkan peta resmi batas administrasi yang digunakan untuk perencanaan tata ruang, kepastian hukum, dan inventarisasi potensi desa. Melibatkan perangkat kelurahan, RT/RW, dan mahasiswa dalam proses pemetaan.',
    location: {
      lat: 1.0544,
      lng: 104.0150,
      address: 'Kelurahan Sembulang, Galang, Batam, Kepulauan Riau',
    },
    images: [
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
      'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    ],
    detailsUrl: 'https://jurnal.polibatam.ac.id',
    year: 2022,
    status: 'Completed',
  },

  // PROGRAM 4: MOCK - Pelatihan Digital Marketing UMKM
  {
    id: 'p2m-2023-004',
    name: 'Pelatihan Digital Marketing untuk UMKM Batam',
    category: 'Pemberdayaan Masyarakat',
    description: 'Program pelatihan pemasaran digital untuk meningkatkan kapasitas pelaku UMKM di Batam dalam memanfaatkan platform e-commerce dan media sosial. Pelatihan mencakup strategi pemasaran online, pembuatan konten produk, manajemen toko online, dan analisis data penjualan. Peserta dibekali dengan keterampilan praktis untuk meningkatkan omzet usaha mereka.',
    location: {
      lat: 1.1396,
      lng: 104.0041,
      address: 'Nagoya, Lubuk Baja, Batam, Kepulauan Riau',
    },
    images: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    detailsUrl: 'https://jurnal.polibatam.ac.id',
    year: 2023,
    status: 'Completed',
  },

  // PROGRAM 5: MOCK - Sosialisasi Kesehatan Ibu dan Anak
  {
    id: 'p2m-2023-005',
    name: 'Sosialisasi Kesehatan Ibu dan Anak di Tanjung Uncang',
    category: 'Kesehatan',
    description: 'Program sosialisasi kesehatan yang fokus pada edukasi kesehatan ibu hamil dan balita di wilayah Tanjung Uncang. Materi meliputi gizi ibu hamil, imunisasi dasar lengkap, tumbuh kembang anak, dan pencegahan stunting. Program ini melibatkan tenaga kesehatan profesional dan menggunakan metode penyuluhan interaktif dengan media visual yang mudah dipahami masyarakat.',
    location: {
      lat: 1.0856,
      lng: 103.9456,
      address: 'Tanjung Uncang, Batu Aji, Batam, Kepulauan Riau',
    },
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    detailsUrl: 'https://jurnal.polibatam.ac.id',
    year: 2023,
    status: 'In Progress',
  },
];

// All 10 P2M categories (static list to show all, even if no programs exist yet)
export const categories = [
  'Pendidikan',
  'Kesehatan',
  'Teknologi',
  'Lingkungan',
  'Ekonomi Kreatif',
  'Pariwisata',
  'Pemberdayaan Masyarakat',
  'Infrastruktur',
  'Pertanian',
  'Kelautan',
];

// Dynamically extract unique years
export const years = [...new Set(programs.map(p => p.year))].sort((a, b) => a - b);

// Dynamically extract unique statuses
export const statuses = [...new Set(programs.map(p => p.status))];
