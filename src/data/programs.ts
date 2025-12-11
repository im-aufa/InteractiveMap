// src/data/programs.ts

export type Program = {
  id: string;
  name: string;
  category: 'Historical Sites' | 'Natural Parks' | 'Museums' | 'Cultural Spots';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[]; // URLs to images
  videoUrl?: string; // URL to a video (e.g., YouTube embed URL)
  detailsUrl: string; // URL for more detailed info, maybe Wikipedia
};

export const programs: Program[] = [
  {
    id: 'batam-island',
    name: 'Batam Island',
    category: 'Natural Parks',
    description: 'Batam is an island in Indonesia, known for its beaches, nightlife, and duty-free shopping. It is a popular weekend getaway for residents of Singapore and Malaysia.',
    location: {
      lat: 1.14937,
      lng: 104.02491,
      address: 'Batam, Riau Islands, Indonesia',
    },
    images: [
      'https://images.unsplash.com/photo-1598466699479-7a710156a5e1?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582236371754-0570b6910604?q=80&w=2940&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example YouTube embed
    detailsUrl: 'https://en.wikipedia.org/wiki/Batam',
  },
  {
    id: 'nagoya-hill',
    name: 'Nagoya Hill Shopping Mall',
    category: 'Cultural Spots',
    description: 'Nagoya Hill is one of the largest and most popular shopping malls in Batam, offering a wide range of retail stores, restaurants, and entertainment options.',
    location: {
      lat: 1.1396,
      lng: 104.0041,
      address: 'Nagoya, Batam, Riau Islands, Indonesia',
    },
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/a6/6d/2c/nagoya-hill-shopping.jpg?w=1200&h=-1&s=1',
      'https://www.batamfast.com/wp-content/uploads/2019/10/Nagoya-Hill-Shopping-Mall-Batam-Fast.jpg',
    ],
    detailsUrl: 'https://www.tripadvisor.com/Attraction_Review-g294265-d1434937-Reviews-Nagoya_Hill_Shopping_Mall-Batam_Riau_Islands_Provincial_Government.html',
  },
  {
    id: 'barelang-bridge',
    name: 'Barelang Bridge',
    category: 'Historical Sites',
    description: 'The Barelang Bridge is a chain of six bridges that connect the islands of Batam, Rempang, and Galang. It is an iconic landmark and a popular spot for sightseeing.',
    location: {
      lat: 0.9859,
      lng: 104.0039,
      address: 'Barelang, Batam, Riau Islands, Indonesia',
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/e/ea/Jembatan_Barelang%2C_Batam.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/BARELANG_BRIDGE.jpg/1280px-BARELANG_BRIDGE.jpg',
    ],
    detailsUrl: 'https://en.wikipedia.org/wiki/Barelang_Bridge',
  },
  {
    id: 'marian-grotto',
    name: 'Marian Grotto (Gua Maria)',
    category: 'Cultural Spots',
    description: 'A serene religious site featuring a grotto dedicated to the Virgin Mary, offering a peaceful place for prayer and contemplation.',
    location: {
      lat: 1.0544,
      lng: 104.0150,
      address: 'Jalan Yos Sudarso, Batam, Riau Islands, Indonesia',
    },
    images: [
      'https://i0.wp.com/www.traveling-yuk.com/wp-content/uploads/2019/04/Gua-Maria-Batam-1.jpg?fit=1200%2C799&ssl=1',
      'https://cdn-image.hipwee.com/wp-content/uploads/2018/11/hipwee-gua_maria_batam.jpg',
    ],
    detailsUrl: 'https://www.tripadvisor.com/Attraction_Review-g294265-d11974751-Reviews-Gua_Maria-Batam_Riau_Islands_Provincial_Government.html',
  },
  {
    id: 'golden-city',
    name: 'Golden City Go Kart',
    category: 'Entertainment', // Changed category for variety
    description: 'A popular entertainment complex featuring go-karting, flying fox, and other recreational activities, suitable for families and thrill-seekers.',
    location: {
      lat: 1.0560,
      lng: 104.0180,
      address: 'Bengkong Laut, Batam, Riau Islands, Indonesia',
    },
    images: [
      'https://media-cdn.tripadvisor.com/media/photo-s/0d/17/c9/41/golden-city-go-kart.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/09/b3/ef/golden-city.jpg?w=1200&h=-1&s=1',
    ],
    detailsUrl: 'https://www.tripadvisor.com/Attraction_Review-g294265-d602330-Reviews-Golden_City_Go_Kart-Batam_Riau_Islands_Provincial_Government.html',
  },
  {
    id: 'taman-mini-indonesia',
    name: 'Taman Mini Indonesia Indah',
    category: 'Cultural Spots',
    description: 'A miniature park representing Indonesia\'s diverse culture, featuring traditional houses, museums, and gardens.',
    location: {
      lat: -6.3025,
      lng: 106.8950,
      address: 'East Jakarta, Jakarta, Indonesia',
    },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Taman_Mini_Indonesia_Indah_Entrance.jpg/1280px-Taman_Mini_Indonesia_Indah_Entrance.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rumah_Gadang_in_Taman_Mini_Indonesia_Indah_Jakarta.jpg/1280px-Rumah_Gadang_in_Taman_Mini_Indonesia_Indah_Jakarta.jpg',
    ],
    detailsUrl: 'https://en.wikipedia.org/wiki/Taman_Mini_Indonesia_Indah',
  },
  {
    id: 'bali-beach',
    name: 'Bali Beach',
    category: 'Natural Parks',
    description: 'Famous for its stunning beaches, volcanic mountains, coral reefs, and iconic rice paddies, Bali is a popular tourist destination.',
    location: {
      lat: -8.4095,
      lng: 115.1889,
      address: 'Bali, Indonesia',
    },
    images: [
      'https://images.unsplash.com/photo-1536152818225-835359145657?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548328903-b09e8633c70f?q=80&w=2940&auto=format&fit=crop',
    ],
    detailsUrl: 'https://en.wikipedia.org/wiki/Bali',
  },
];

// Dynamically extract unique categories
export const categories = [...new Set(programs.map(p => p.category))];
