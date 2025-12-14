"""
Program Data Generator
Generates realistic P2M program data based on templates

Usage:
    python scripts/generate-programs.py --count 50

Output:
    - generated_programs.json
    - programs.ts (ready to paste into src/data/programs.ts)
"""

import json
import random
import argparse
from typing import List, Dict
from datetime import datetime

# Import geocoding
import sys
sys.path.append('.')
from geocode_locations import BATAM_LOCATIONS

# ============================================================================
# PROGRAM TEMPLATES BY CATEGORY
# ============================================================================

PROGRAM_TEMPLATES = {
    'Pendidikan': [
        {
            'name': 'Pelatihan Pembelajaran Berbasis Teknologi untuk Guru {location}',
            'description': 'Program pelatihan untuk meningkatkan kompetensi guru dalam menggunakan teknologi pembelajaran modern. Mencakup penggunaan Learning Management System (LMS), pembuatan konten digital interaktif, dan strategi pembelajaran hybrid. Peserta dibekali dengan keterampilan praktis mengintegrasikan teknologi dalam proses belajar mengajar.',
        },
        {
            'name': 'Workshop Coding untuk Siswa SMP {location}',
            'description': 'Workshop pengenalan pemrograman untuk siswa SMP menggunakan platform Scratch dan Python. Program ini bertujuan mengembangkan computational thinking dan kreativitas siswa melalui pembelajaran coding yang menyenangkan. Siswa akan membuat game sederhana dan aplikasi interaktif.',
        },
        {
            'name': 'Program Literasi Digital Masyarakat {location}',
            'description': 'Program edukasi literasi digital untuk masyarakat umum, mencakup penggunaan internet yang aman, media sosial yang bijak, dan pengenalan aplikasi produktivitas. Peserta diajarkan cara mengidentifikasi hoaks, melindungi data pribadi, dan memanfaatkan teknologi untuk meningkatkan kualitas hidup.',
        },
        {
            'name': 'Pelatihan Bahasa Inggris untuk UMKM {location}',
            'description': 'Pelatihan bahasa Inggris praktis untuk pelaku UMKM yang ingin memasarkan produk ke pasar internasional. Materi fokus pada business English, product description, customer service, dan komunikasi bisnis. Peserta dilatih untuk berkomunikasi dengan buyer asing secara efektif.',
        },
    ],
    
    'Kesehatan': [
        {
            'name': 'Sosialisasi Pencegahan Stunting di {location}',
            'description': 'Program sosialisasi pencegahan stunting untuk ibu hamil dan balita. Materi mencakup gizi seimbang, ASI eksklusif, imunisasi lengkap, dan pemantauan tumbuh kembang anak. Program ini melibatkan kader posyandu dan tenaga kesehatan profesional untuk memberikan edukasi yang komprehensif.',
        },
        {
            'name': 'Pelatihan Kader Posyandu {location}',
            'description': 'Pelatihan untuk meningkatkan kapasitas kader posyandu dalam memberikan pelayanan kesehatan dasar kepada masyarakat. Materi meliputi pengukuran antropometri, pencatatan data kesehatan, penyuluhan gizi, dan deteksi dini masalah kesehatan. Kader dibekali dengan pengetahuan dan keterampilan praktis.',
        },
        {
            'name': 'Screening Kesehatan Gratis Masyarakat {location}',
            'description': 'Program pemeriksaan kesehatan gratis untuk masyarakat mencakup cek tekanan darah, gula darah, kolesterol, dan konsultasi kesehatan. Kegiatan ini bertujuan untuk deteksi dini penyakit tidak menular seperti hipertensi, diabetes, dan penyakit jantung. Peserta mendapat edukasi pola hidup sehat.',
        },
    ],
    
    'Teknologi': [
        {
            'name': 'Pengembangan Aplikasi Mobile untuk Nelayan {location}',
            'description': 'Pengembangan aplikasi mobile untuk membantu nelayan mendapatkan informasi cuaca, harga ikan, dan lokasi fishing ground. Aplikasi dilengkapi dengan fitur GPS tracking, marketplace hasil laut, dan forum komunitas nelayan. Teknologi ini membantu meningkatkan efisiensi dan pendapatan nelayan.',
        },
        {
            'name': 'Sistem Informasi Geografis Potensi Desa {location}',
            'description': 'Pembuatan sistem informasi geografis (SIG) untuk memetakan potensi desa meliputi sumber daya alam, infrastruktur, dan demografi. Sistem ini membantu perencanaan pembangunan desa berbasis data spasial. Output berupa peta digital interaktif yang dapat diakses oleh perangkat desa dan masyarakat.',
        },
        {
            'name': 'Pelatihan IoT untuk Monitoring Pertanian Urban {location}',
            'description': 'Pelatihan penggunaan teknologi Internet of Things (IoT) untuk monitoring pertanian urban. Peserta belajar membuat sistem monitoring kelembaban tanah, suhu, dan cahaya menggunakan sensor otomatis. Teknologi ini membantu optimalisasi perawatan tanaman dan efisiensi penggunaan air.',
        },
    ],
    
    'Lingkungan': [
        {
            'name': 'Program Bank Sampah {location}',
            'description': 'Pembentukan dan pendampingan bank sampah untuk mengelola sampah rumah tangga menjadi bernilai ekonomi. Program mencakup pemilahan sampah, sistem tabungan sampah, dan kerjasama dengan pengepul. Masyarakat diedukasi tentang reduce, reuse, recycle untuk mengurangi volume sampah ke TPA.',
        },
        {
            'name': 'Konservasi Mangrove {location}',
            'description': 'Program penanaman dan konservasi hutan mangrove untuk melindungi ekosistem pesisir. Kegiatan meliputi pembibitan, penanaman, dan pemeliharaan mangrove. Masyarakat diedukasi tentang pentingnya mangrove untuk mencegah abrasi, menjaga biodiversitas, dan mitigasi perubahan iklim.',
        },
        {
            'name': 'Pelatihan Pengolahan Sampah Organik {location}',
            'description': 'Pelatihan pembuatan kompos dan pupuk organik dari sampah dapur dan kebun. Peserta belajar teknik composting, penggunaan komposter, dan aplikasi pupuk organik untuk tanaman. Program ini membantu mengurangi sampah organik sekaligus menghasilkan pupuk berkualitas untuk pertanian.',
        },
    ],
    
    'Ekonomi Kreatif': [
        {
            'name': 'Pelatihan Branding Produk UMKM {location}',
            'description': 'Pelatihan branding dan packaging untuk meningkatkan daya saing produk UMKM. Materi mencakup desain logo, kemasan produk, storytelling brand, dan strategi positioning. Peserta dibantu mengembangkan identitas brand yang kuat dan menarik untuk meningkatkan nilai jual produk.',
        },
        {
            'name': 'Workshop E-Commerce untuk Pengrajin Lokal {location}',
            'description': 'Workshop pemanfaatan platform e-commerce (Shopee, Tokopedia, Lazada) untuk memasarkan produk kerajinan lokal. Peserta belajar membuat toko online, fotografi produk, copywriting, dan strategi promosi digital. Program ini membantu pengrajin menjangkau pasar yang lebih luas.',
        },
        {
            'name': 'Pelatihan Fotografi Produk untuk UMKM {location}',
            'description': 'Pelatihan teknik fotografi produk menggunakan smartphone untuk keperluan marketing online. Materi mencakup komposisi, pencahayaan, editing foto, dan styling produk. Peserta dilatih membuat foto produk yang menarik untuk meningkatkan konversi penjualan di marketplace.',
        },
    ],
    
    'Pariwisata': [
        {
            'name': 'Pelatihan Tour Guide Lokal {location}',
            'description': 'Pelatihan untuk calon tour guide lokal mencakup pengetahuan destinasi wisata, storytelling, bahasa Inggris pariwisata, dan customer service. Peserta dibekali dengan keterampilan memandu wisatawan domestik dan mancanegara. Program ini mendukung pengembangan pariwisata berbasis masyarakat.',
        },
        {
            'name': 'Pengembangan Paket Wisata Bahari {location}',
            'description': 'Pengembangan paket wisata bahari untuk mempromosikan potensi wisata laut dan pulau. Kegiatan mencakup identifikasi spot wisata, penyusunan itinerary, penetapan harga, dan strategi pemasaran. Melibatkan pelaku wisata lokal untuk menciptakan paket wisata yang menarik dan berkelanjutan.',
        },
        {
            'name': 'Workshop Manajemen Homestay Desa Wisata {location}',
            'description': 'Workshop manajemen homestay untuk pengelola desa wisata mencakup standar pelayanan, kebersihan, keamanan, dan hospitality. Peserta belajar memberikan pengalaman menginap yang berkesan bagi wisatawan. Program ini meningkatkan kualitas akomodasi dan pendapatan masyarakat.',
        },
    ],
    
    'Pemberdayaan Masyarakat': [
        {
            'name': 'Pelatihan Menjahit untuk Ibu Rumah Tangga {location}',
            'description': 'Pelatihan keterampilan menjahit untuk ibu rumah tangga sebagai keterampilan produktif. Materi mencakup teknik menjahit dasar, membuat pola, dan produksi pakaian sederhana. Peserta diharapkan dapat membuka usaha konveksi rumahan untuk menambah penghasilan keluarga.',
        },
        {
            'name': 'Pembentukan Koperasi Nelayan {location}',
            'description': 'Pendampingan pembentukan koperasi nelayan untuk meningkatkan bargaining power dalam penjualan hasil tangkapan. Program mencakup pelatihan manajemen koperasi, pembukuan, dan akses permodalan. Koperasi membantu nelayan mendapat harga jual yang lebih baik dan akses ke pasar yang lebih luas.',
        },
        {
            'name': 'Workshop Kepemimpinan Pemuda Desa {location}',
            'description': 'Workshop pengembangan kepemimpinan untuk pemuda desa mencakup public speaking, organizational management, dan community development. Peserta dilatih menjadi agen perubahan di desanya. Program ini mendorong partisipasi aktif pemuda dalam pembangunan desa.',
        },
    ],
    
    'Infrastruktur': [
        {
            'name': 'Pemetaan Batas Wilayah RT/RW {location}',
            'description': 'Pemetaan partisipatif untuk penetapan batas wilayah RT dan RW menggunakan teknologi GPS dan GIS. Program menghasilkan peta digital batas administrasi yang akurat untuk keperluan perencanaan tata ruang dan kepastian hukum. Melibatkan perangkat kelurahan dan masyarakat dalam proses pemetaan.',
        },
        {
            'name': 'Perencanaan Tata Ruang Desa Wisata {location}',
            'description': 'Penyusunan rencana tata ruang desa wisata berbasis partisipatif. Kegiatan mencakup identifikasi zona wisata, zona konservasi, dan zona pemukiman. Output berupa dokumen perencanaan dan peta zonasi yang menjadi acuan pengembangan desa wisata berkelanjutan.',
        },
    ],
    
    'Pertanian': [
        {
            'name': 'Pelatihan Urban Farming untuk Warga Kota {location}',
            'description': 'Pelatihan pertanian urban untuk memanfaatkan lahan terbatas di perkotaan. Materi mencakup vertical garden, pot farming, dan rooftop garden. Peserta belajar menanam sayuran organik untuk konsumsi sendiri sekaligus menghijaukan lingkungan perkotaan.',
        },
        {
            'name': 'Pengembangan Sistem Hidroponik Komunitas {location}',
            'description': 'Pembangunan sistem hidroponik komunitas untuk produksi sayuran segar tanpa tanah. Program mencakup pelatihan teknik hidroponik, pembuatan instalasi, dan manajemen produksi. Hasil panen dapat dikonsumsi bersama atau dijual untuk menambah kas komunitas.',
        },
    ],
    
    'Kelautan': [
        {
            'name': 'Pelatihan Budidaya Ikan Kerapu {location}',
            'description': 'Pelatihan budidaya ikan kerapu dalam keramba jaring apung untuk nelayan. Materi mencakup pemilihan bibit, pakan, pengelolaan kualitas air, dan pencegahan penyakit. Program ini membuka peluang diversifikasi usaha nelayan dari menangkap ke membudidayakan ikan.',
        },
        {
            'name': 'Pengolahan Hasil Laut untuk Nilai Tambah {location}',
            'description': 'Pelatihan pengolahan hasil laut menjadi produk bernilai tambah seperti ikan asap, abon ikan, dan kerupuk ikan. Peserta belajar teknik pengolahan, pengemasan, dan pemasaran produk. Program ini meningkatkan pendapatan nelayan dan mengurangi ketergantungan pada penjualan ikan segar.',
        },
    ],
}

# ============================================================================
# IMAGE SOURCES (Unsplash)
# ============================================================================

CATEGORY_IMAGES = {
    'Pendidikan': [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    ],
    'Kesehatan': [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
        'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    ],
    'Teknologi': [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    ],
    'Lingkungan': [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
    ],
    'Ekonomi Kreatif': [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    ],
    'Pariwisata': [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        'https://images.unsplash.com/photo-1552581234-26160f608093?w=800',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    ],
    'Pemberdayaan Masyarakat': [
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
    ],
    'Infrastruktur': [
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
        'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    ],
    'Pertanian': [
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
    ],
    'Kelautan': [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
}

# ============================================================================
# GENERATION FUNCTIONS
# ============================================================================

def generate_program(category: str, index: int, year: int) -> Dict:
    """Generate a single program"""
    
    # Select random template
    template = random.choice(PROGRAM_TEMPLATES[category])
    
    # Select random location
    location_key = random.choice(list(BATAM_LOCATIONS.keys()))
    location_data = BATAM_LOCATIONS[location_key]
    location_name = location_key.title()
    
    # Generate program data
    program = {
        'id': f'p2m-{year}-{index:03d}',
        'name': template['name'].format(location=location_name),
        'category': category,
        'description': template['description'],
        'location': {
            'lat': location_data['lat'],
            'lng': location_data['lng'],
            'address': location_data['address'],
        },
        'images': random.sample(CATEGORY_IMAGES[category], 3),
        'videoUrl': 'https://www.youtube.com/embed/dQw4w9WgXcQ' if random.random() > 0.3 else None,
        'detailsUrl': 'https://jurnal.polibatam.ac.id',
        'year': year,
        'status': random.choices(
            ['Completed', 'In Progress', 'Planned'],
            weights=[0.6, 0.3, 0.1]
        )[0],
    }
    
    return program

def generate_programs(total_count: int = 50) -> List[Dict]:
    """Generate multiple programs"""
    
    # Category distribution
    distribution = {
        'Pendidikan': 8,
        'Kesehatan': 6,
        'Teknologi': 7,
        'Lingkungan': 5,
        'Ekonomi Kreatif': 5,
        'Pariwisata': 5,
        'Pemberdayaan Masyarakat': 6,
        'Infrastruktur': 4,
        'Pertanian': 2,
        'Kelautan': 2,
    }
    
    programs = []
    index = 1
    
    for category, count in distribution.items():
        for i in range(count):
            year = random.choice([2020, 2021, 2022, 2023, 2024])
            program = generate_program(category, index, year)
            programs.append(program)
            index += 1
            print(f"✓ Generated: {program['name'][:60]}...")
    
    return programs

# ============================================================================
# EXPORT FUNCTIONS
# ============================================================================

def export_to_typescript(programs: List[Dict], output_file: str):
    """Export programs to TypeScript format"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated program data\n")
        f.write("// Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
        f.write("export const programs: Program[] = [\n")
        
        for i, program in enumerate(programs):
            f.write("  {\n")
            f.write(f"    id: '{program['id']}',\n")
            f.write(f"    name: '{program['name']}',\n")
            f.write(f"    category: '{program['category']}',\n")
            f.write(f"    description: '{program['description']}',\n")
            f.write(f"    location: {{\n")
            f.write(f"      lat: {program['location']['lat']},\n")
            f.write(f"      lng: {program['location']['lng']},\n")
            f.write(f"      address: '{program['location']['address']}',\n")
            f.write(f"    }},\n")
            f.write(f"    images: {json.dumps(program['images'])},\n")
            if program['videoUrl']:
                f.write(f"    videoUrl: '{program['videoUrl']}',\n")
            f.write(f"    detailsUrl: '{program['detailsUrl']}',\n")
            f.write(f"    year: {program['year']},\n")
            f.write(f"    status: '{program['status']}',\n")
            f.write("  },\n" if i < len(programs) - 1 else "  }\n")
        
        f.write("];\n")

# ============================================================================
# MAIN
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Generate P2M program data')
    parser.add_argument('--count', type=int, default=50, help='Number of programs to generate')
    args = parser.parse_args()
    
    print("🚀 P2M Program Generator")
    print("=" * 60)
    print(f"Generating {args.count} programs...")
    print()
    
    programs = generate_programs(args.count)
    
    # Save JSON
    with open('generated_programs.json', 'w', encoding='utf-8') as f:
        json.dump(programs, f, indent=2, ensure_ascii=False)
    
    # Save TypeScript
    export_to_typescript(programs, 'generated_programs.ts')
    
    print()
    print("=" * 60)
    print(f"✅ Generated {len(programs)} programs")
    print(f"📁 Saved to generated_programs.json")
    print(f"📁 Saved to generated_programs.ts")
    print()
    print("💡 Next steps:")
    print("   1. Review generated_programs.json")
    print("   2. Copy content from generated_programs.ts to src/data/programs.ts")
    print("   3. Test the application")

if __name__ == "__main__":
    main()
