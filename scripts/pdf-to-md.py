"""
PDF to Markdown Converter
Extracts text from P2M journal PDFs and converts to structured markdown

Usage:
    python scripts/pdf-to-md.py <pdf_folder>
    python scripts/pdf-to-md.py "path/to/pdfs"

Requirements:
    pip install PyPDF2 pdfplumber

Output:
    - extracted_data/ folder with .md files for each PDF
    - program_data.json with structured data
"""

import os
import sys
import json
import re
from pathlib import Path

try:
    import PyPDF2
    import pdfplumber
except ImportError:
    print("❌ Missing dependencies!")
    print("Please install: pip install PyPDF2 pdfplumber")
    sys.exit(1)

# ============================================================================
# PDF EXTRACTION
# ============================================================================

def extract_text_pypdf2(pdf_path: str) -> str:
    """Extract text using PyPDF2 (fallback method)"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        print(f"  ⚠️  PyPDF2 error: {e}")
        return ""

def extract_text_pdfplumber(pdf_path: str) -> str:
    """Extract text using pdfplumber (better quality)"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        print(f"  ⚠️  pdfplumber error: {e}")
        return ""

def extract_pdf_text(pdf_path: str) -> str:
    """Extract text from PDF using best available method"""
    # Try pdfplumber first (better quality)
    text = extract_text_pdfplumber(pdf_path)
    
    # Fallback to PyPDF2
    if not text or len(text) < 100:
        text = extract_text_pypdf2(pdf_path)
    
    return text

# ============================================================================
# DATA EXTRACTION PATTERNS
# ============================================================================

def extract_title(text: str) -> str:
    """Extract program title from PDF text"""
    # Usually in first few lines, often in ALL CAPS or bold
    lines = text.split('\n')[:20]
    
    # Look for common title patterns
    for line in lines:
        line = line.strip()
        # Skip very short lines
        if len(line) < 20:
            continue
        # Skip lines with common header words
        if any(word in line.lower() for word in ['abstract', 'jurnal', 'volume', 'issn', 'doi']):
            continue
        # Likely a title if it's substantial
        if len(line) > 30 and len(line) < 200:
            return line
    
    return "Program Title (Manual Review Needed)"

def extract_authors(text: str) -> list:
    """Extract author names from PDF text"""
    # Look for author section (usually after title, before abstract)
    lines = text.split('\n')[:30]
    
    authors = []
    author_section = False
    
    for line in lines:
        line = line.strip()
        # Start of author section
        if any(word in line.lower() for word in ['penulis', 'author', 'oleh']):
            author_section = True
            continue
        # End of author section
        if author_section and any(word in line.lower() for word in ['abstract', 'abstrak', 'pendahuluan']):
            break
        # Extract names (simple heuristic: capitalized words)
        if author_section and line:
            # Remove common suffixes
            line = re.sub(r'\d+|,|\*', '', line)
            if len(line) > 5 and len(line) < 50:
                authors.append(line.strip())
    
    return authors[:5] if authors else ["Author Name (Manual Review Needed)"]

def extract_abstract(text: str) -> str:
    """Extract abstract/description from PDF text"""
    # Look for abstract section
    text_lower = text.lower()
    
    # Find abstract start
    abstract_start = -1
    for keyword in ['abstract', 'abstrak']:
        pos = text_lower.find(keyword)
        if pos != -1:
            abstract_start = pos
            break
    
    if abstract_start == -1:
        return "Description (Manual Review Needed)"
    
    # Find abstract end (usually "keywords" or "pendahuluan")
    abstract_end = len(text)
    for keyword in ['keywords', 'kata kunci', 'pendahuluan', 'introduction', '1.']:
        pos = text_lower.find(keyword, abstract_start + 50)
        if pos != -1 and pos < abstract_end:
            abstract_end = pos
    
    # Extract abstract text
    abstract = text[abstract_start:abstract_end]
    # Clean up
    abstract = re.sub(r'abstract|abstrak', '', abstract, flags=re.IGNORECASE)
    abstract = abstract.strip()
    
    # Limit length
    if len(abstract) > 500:
        abstract = abstract[:500] + "..."
    
    return abstract if len(abstract) > 50 else "Description (Manual Review Needed)"

def extract_location_hints(text: str) -> list:
    """Extract potential location mentions from PDF text"""
    # Common location keywords in Batam/Kepri
    locations = []
    location_keywords = [
        'batam', 'nagoya', 'sekupang', 'batu aji', 'bengkong',
        'galang', 'mubut', 'rempang', 'bintan', 'karimun',
        'tanjung', 'pulau', 'kelurahan', 'kecamatan', 'desa'
    ]
    
    text_lower = text.lower()
    for keyword in location_keywords:
        if keyword in text_lower:
            # Find context around keyword
            pos = text_lower.find(keyword)
            context = text[max(0, pos-50):min(len(text), pos+100)]
            locations.append(context.strip())
    
    return locations[:5]  # Return top 5 mentions

def extract_year(text: str, filename: str) -> int:
    """Extract publication year"""
    # Try to find year in text (2020-2024)
    years = re.findall(r'20[2-4][0-9]', text[:500])
    if years:
        return int(years[0])
    
    # Try to extract from filename
    years = re.findall(r'20[2-4][0-9]', filename)
    if years:
        return int(years[0])
    
    return 2023  # Default

# ============================================================================
# MARKDOWN CONVERSION
# ============================================================================

def create_markdown(pdf_path: str, text: str, output_dir: str) -> dict:
    """Create markdown file and extract structured data"""
    
    filename = Path(pdf_path).stem
    print(f"\n📄 Processing: {filename}")
    
    # Extract data
    title = extract_title(text)
    authors = extract_authors(text)
    abstract = extract_abstract(text)
    location_hints = extract_location_hints(text)
    year = extract_year(text, filename)
    
    print(f"  ✓ Title: {title[:60]}...")
    print(f"  ✓ Authors: {', '.join(authors[:2])}...")
    print(f"  ✓ Year: {year}")
    print(f"  ✓ Location hints: {len(location_hints)} found")
    
    # Create markdown content
    md_content = f"""# {title}

## Metadata
- **File**: {filename}.pdf
- **Year**: {year}
- **Authors**: {', '.join(authors)}

## Abstract
{abstract}

## Location Hints
{chr(10).join(f'- {hint}' for hint in location_hints) if location_hints else '- No location hints found (check PDF manually)'}

## Manual Review Checklist
- [ ] Verify program title
- [ ] Verify authors/team members
- [ ] Extract exact location (kelurahan/desa)
- [ ] Find coordinates on Google Maps
- [ ] Categorize program (Pendidikan, Kesehatan, etc.)
- [ ] Extract program outcomes/results
- [ ] Find images (if available in PDF)
- [ ] Determine status (Completed/In Progress)

## Notes
Add any additional notes here...

---
**Full Text** (for reference):

{text[:2000]}...
(Full text truncated - see original PDF)
"""
    
    # Save markdown file
    md_path = os.path.join(output_dir, f"{filename}.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"  💾 Saved: {md_path}")
    
    # Return structured data
    return {
        'filename': filename,
        'title': title,
        'authors': authors,
        'abstract': abstract,
        'location_hints': location_hints,
        'year': year,
        'pdf_path': pdf_path,
        'md_path': md_path,
    }

# ============================================================================
# BATCH PROCESSING
# ============================================================================

def process_pdf_folder(pdf_folder: str):
    """Process all PDFs in a folder"""
    
    print("🚀 PDF to Markdown Converter")
    print("=" * 60)
    
    # Create output directory
    output_dir = os.path.join(pdf_folder, "extracted_data")
    os.makedirs(output_dir, exist_ok=True)
    
    # Find all PDFs
    pdf_files = list(Path(pdf_folder).glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF files found in: {pdf_folder}")
        return
    
    print(f"📁 Found {len(pdf_files)} PDF files")
    print(f"📂 Output directory: {output_dir}")
    print("=" * 60)
    
    # Process each PDF
    all_data = []
    for i, pdf_path in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}]")
        
        try:
            # Extract text
            text = extract_pdf_text(str(pdf_path))
            
            if not text or len(text) < 100:
                print(f"  ⚠️  Could not extract text (might be scanned PDF)")
                continue
            
            # Create markdown and extract data
            data = create_markdown(str(pdf_path), text, output_dir)
            all_data.append(data)
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            continue
    
    # Save summary JSON
    summary_path = os.path.join(output_dir, "program_data.json")
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✅ Processing complete!")
    print(f"📊 Successfully processed: {len(all_data)}/{len(pdf_files)} files")
    print(f"📁 Markdown files: {output_dir}")
    print(f"📄 Summary data: {summary_path}")
    print("\n💡 Next steps:")
    print("   1. Review .md files in extracted_data/")
    print("   2. Fill in missing information (locations, categories)")
    print("   3. Use md-to-programs.py to convert to TypeScript")

# ============================================================================
# MAIN
# ============================================================================

def main():
    if len(sys.argv) < 2:
        print("Usage: python pdf-to-md.py <pdf_folder>")
        print("Example: python pdf-to-md.py ./pdfs")
        sys.exit(1)
    
    pdf_folder = sys.argv[1]
    
    if not os.path.exists(pdf_folder):
        print(f"❌ Folder not found: {pdf_folder}")
        sys.exit(1)
    
    process_pdf_folder(pdf_folder)

if __name__ == "__main__":
    main()
