"""
Markdown to Programs Converter
Converts reviewed markdown files to TypeScript program data

Usage:
    python scripts/md-to-programs.py <md_folder>

Requirements:
    - Markdown files with structured format
    - Manual review completed (locations, categories filled in)

Output:
    - programs.ts (ready to paste into src/data/programs.ts)
    - programs.json (backup)
"""

import os
import sys
import json
import re
from pathlib import Path

# Import geocoding
from geocode_locations import geocode_location, BATAM_LOCATIONS

# ============================================================================
# CATEGORY MAPPING
# ============================================================================

CATEGORY_KEYWORDS = {
    'Pendidikan': ['pendidikan', 'pembelajaran', 'pelatihan guru', 'siswa', 'mahasiswa', 'sekolah', 'kampus', 'literasi', 'coding', 'bahasa'],
    'Kesehatan': ['kesehatan', 'posyandu', 'stunting', 'gizi', 'ibu', 'anak', 'balita', 'screening', 'penyakit'],
    'Teknologi': ['teknologi', 'aplikasi', 'mobile', 'iot', 'sistem informasi', 'digital', 'website', 'software', 'virtual'],
    'Lingkungan': ['lingkungan', 'sampah', 'mangrove', 'konservasi', 'bank sampah', 'kompos', 'daur ulang', 'hijau'],
    'Ekonomi Kreatif': ['umkm', 'branding', 'packaging', 'e-commerce', 'fotografi produk', 'marketing', 'kreatif', 'kerajinan'],
    'Pariwisata': ['wisata', 'pariwisata', 'tour', 'guide', 'homestay', 'bahari', 'pulau', 'destinasi'],
    'Pemberdayaan Masyarakat': ['pemberdayaan', 'masyarakat', 'koperasi', 'menjahit', 'keterampilan', 'pemuda', 'ibu rumah tangga'],
    'Infrastruktur': ['infrastruktur', 'pemetaan', 'batas wilayah', 'tata ruang', 'survei', 'gis', 'geografis'],
    'Pertanian': ['pertanian', 'urban farming', 'hidroponik', 'tanaman', 'sayuran', 'organik'],
    'Kelautan': ['kelautan', 'nelayan', 'ikan', 'budidaya', 'laut', 'hasil laut', 'kerapu'],
}

def auto_categorize(title: str, abstract: str) -> str:
    """Auto-categorize program based on keywords"""
    text = (title + " " + abstract).lower()
    
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text)
        scores[category] = score
    
    # Return category with highest score
    best_category = max(scores, key=scores.get)
    if scores[best_category] > 0:
        return best_category
    
    return 'Pemberdayaan Masyarakat'  # Default

# ============================================================================
# MARKDOWN PARSING
# ============================================================================

def parse_markdown(md_path: str) -> dict:
    """Parse markdown file and extract program data"""
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title (first heading)
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Unknown Program"
    
    # Extract year
    year_match = re.search(r'\*\*Year\*\*:\s*(\d{4})', content)
    year = int(year_match.group(1)) if year_match else 2023
    
    # Extract authors
    authors_match = re.search(r'\*\*Authors\*\*:\s*(.+)$', content, re.MULTILINE)
    authors = authors_match.group(1).split(',') if authors_match else []
    authors = [a.strip() for a in authors]
    
    # Extract abstract
    abstract_match = re.search(r'## Abstract\n(.+?)\n##', content, re.DOTALL)
    abstract = abstract_match.group(1).strip() if abstract_match else ""
    
    # Extract location hints
    location_hints = []
    location_section = re.search(r'## Location Hints\n(.+?)\n##', content, re.DOTALL)
    if location_section:
        hints = re.findall(r'- (.+)$', location_section.group(1), re.MULTILINE)
        location_hints = hints
    
    # Check for manual location entry
    manual_location = re.search(r'\*\*Location\*\*:\s*(.+)$', content, re.MULTILINE)
    manual_coords = re.search(r'\*\*Coordinates\*\*:\s*([0-9.-]+),\s*([0-9.-]+)', content)
    manual_category = re.search(r'\*\*Category\*\*:\s*(.+)$', content, re.MULTILINE)
    
    return {
        'title': title,
        'year': year,
        'authors': authors,
        'abstract': abstract,
        'location_hints': location_hints,
        'manual_location': manual_location.group(1) if manual_location else None,
        'manual_coords': (float(manual_coords.group(1)), float(manual_coords.group(2))) if manual_coords else None,
        'manual_category': manual_category.group(1) if manual_category else None,
    }

# ============================================================================
# PROGRAM GENERATION
# ============================================================================

def create_program_from_md(md_path: str, index: int) -> dict:
    """Create program data from markdown file"""
    
    filename = Path(md_path).stem
    print(f"\n📄 Processing: {filename}")
    
    # Parse markdown
    data = parse_markdown(md_path)
    
    # Determine category
    category = data['manual_category'] or auto_categorize(data['title'], data['abstract'])
    print(f"  ✓ Category: {category}")
    
    # Determine location
    if data['manual_coords']:
        lat, lng = data['manual_coords']
        address = data['manual_location'] or "Batam, Kepulauan Riau"
        print(f"  ✓ Location: Manual ({lat}, {lng})")
    else:
        # Try to geocode from hints
        location_result = None
        if data['location_hints']:
            for hint in data['location_hints']:
                location_result = geocode_location(hint)
                if location_result:
                    break
        
        # Fallback to random Batam location
        if not location_result:
            import random
            location_key = random.choice(list(BATAM_LOCATIONS.keys()))
            location_result = BATAM_LOCATIONS[location_key]
            print(f"  ⚠️  Using fallback location: {location_key}")
        
        lat = location_result['lat']
        lng = location_result['lng']
        address = location_result['address']
    
    # Create program
    program = {
        'id': f'p2m-{data["year"]}-{index:03d}',
        'name': data['title'],
        'category': category,
        'description': data['abstract'] if len(data['abstract']) > 50 else f"Program {category.lower()} yang dilaksanakan di {address}. Detail program dapat dilihat pada publikasi jurnal terkait.",
        'location': {
            'lat': lat,
            'lng': lng,
            'address': address,
        },
        'images': [
            f'https://images.unsplash.com/photo-{1500000000000 + index}?w=800',  # Placeholder
            f'https://images.unsplash.com/photo-{1500000000000 + index + 1}?w=800',
            f'https://images.unsplash.com/photo-{1500000000000 + index + 2}?w=800',
        ],
        'videoUrl': None,  # Can be added manually
        'detailsUrl': 'https://jurnal.polibatam.ac.id',
        'year': data['year'],
        'status': 'Completed',
    }
    
    print(f"  ✓ Generated program: {program['id']}")
    
    return program

# ============================================================================
# BATCH CONVERSION
# ============================================================================

def convert_md_folder(md_folder: str):
    """Convert all markdown files to programs"""
    
    print("🚀 Markdown to Programs Converter")
    print("=" * 60)
    
    # Find all markdown files
    md_files = list(Path(md_folder).glob("*.md"))
    
    if not md_files:
        print(f"❌ No markdown files found in: {md_folder}")
        return
    
    print(f"📁 Found {len(md_files)} markdown files")
    print("=" * 60)
    
    # Convert each file
    programs = []
    for i, md_path in enumerate(md_files, 1):
        try:
            program = create_program_from_md(str(md_path), i)
            programs.append(program)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            continue
    
    # Save JSON
    json_path = "programs.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(programs, f, indent=2, ensure_ascii=False)
    
    # Save TypeScript
    ts_path = "programs.ts"
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated from journal PDFs\n")
        f.write(f"// Total programs: {len(programs)}\n\n")
        f.write("export const programs: Program[] = [\n")
        
        for i, prog in enumerate(programs):
            f.write("  {\n")
            f.write(f"    id: '{prog['id']}',\n")
            f.write(f"    name: '{prog['name']}',\n")
            f.write(f"    category: '{prog['category']}',\n")
            f.write(f"    description: '{prog['description']}',\n")
            f.write(f"    location: {{\n")
            f.write(f"      lat: {prog['location']['lat']},\n")
            f.write(f"      lng: {prog['location']['lng']},\n")
            f.write(f"      address: '{prog['location']['address']}',\n")
            f.write(f"    }},\n")
            f.write(f"    images: {json.dumps(prog['images'])},\n")
            if prog['videoUrl']:
                f.write(f"    videoUrl: '{prog['videoUrl']}',\n")
            f.write(f"    detailsUrl: '{prog['detailsUrl']}',\n")
            f.write(f"    year: {prog['year']},\n")
            f.write(f"    status: '{prog['status']}',\n")
            f.write("  },\n" if i < len(programs) - 1 else "  }\n")
        
        f.write("];\n")
    
    print("\n" + "=" * 60)
    print(f"✅ Conversion complete!")
    print(f"📊 Generated {len(programs)} programs")
    print(f"📄 JSON: {json_path}")
    print(f"📄 TypeScript: {ts_path}")
    print("\n💡 Next steps:")
    print("   1. Review programs.ts")
    print("   2. Copy content to src/data/programs.ts")
    print("   3. Replace placeholder images with real ones")
    print("   4. Test the application")

# ============================================================================
# MAIN
# ============================================================================

def main():
    if len(sys.argv) < 2:
        print("Usage: python md-to-programs.py <md_folder>")
        print("Example: python md-to-programs.py ./pdfs/extracted_data")
        sys.exit(1)
    
    md_folder = sys.argv[1]
    
    if not os.path.exists(md_folder):
        print(f"❌ Folder not found: {md_folder}")
        sys.exit(1)
    
    convert_md_folder(md_folder)

if __name__ == "__main__":
    main()
