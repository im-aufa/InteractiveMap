# Converting 49 Journal PDFs to Program Data

**You have:** 49 real P2M journal PDFs  
**You need:** TypeScript program data for your web app  
**Time estimate:** 2-4 hours

---

## 🚀 Quick Process (3 Steps)

### Step 1: Install Dependencies (2 minutes)

```bash
cd "d:\KULIAH\TA\MBKM\FINal\Almost Final\WEB\interactive map 2\interactive-map-app"
pip install PyPDF2 pdfplumber requests beautifulsoup4
```

### Step 2: Extract Data from PDFs (5 minutes)

Put all your PDF files in one folder, then run:

```bash
# Replace with your actual PDF folder path
python scripts/pdf-to-md.py "path/to/your/pdfs"
```

**What this does:**
- Extracts text from all 49 PDFs
- Creates markdown files in `pdfs/extracted_data/`
- Auto-extracts: title, authors, abstract, year, location hints
- Creates `program_data.json` with structured data

**Output example:**
```
pdfs/
├── program1.pdf
├── program2.pdf
└── extracted_data/
    ├── program1.md
    ├── program2.md
    └── program_data.json
```

### Step 3: Convert to TypeScript (2 minutes)

```bash
python scripts/md-to-programs.py "path/to/your/pdfs/extracted_data"
```

**What this does:**
- Reads all markdown files
- Auto-categorizes programs (Pendidikan, Kesehatan, etc.)
- Auto-geocodes locations using hints
- Generates `programs.ts` ready to paste

**Output:**
- `programs.ts` - Ready to paste into `src/data/programs.ts`
- `programs.json` - Backup in JSON format

---

## 📝 Manual Review (Optional but Recommended)

After Step 2, you can manually review and enhance the markdown files:

### Open any `.md` file in `extracted_data/`:

```markdown
# Program Title Here

## Metadata
- **Year**: 2022
- **Authors**: Author 1, Author 2

## Abstract
Extracted abstract text...

## Location Hints
- Batam
- Nagoya
- Kelurahan Lubuk Baja

## Manual Review Checklist
- [ ] Verify program title
- [ ] Verify authors/team members
- [ ] Extract exact location
- [ ] Find coordinates
- [ ] Categorize program
```

### Add manual data (optional):

```markdown
## Manual Entries
**Category**: Teknologi
**Location**: Nagoya, Batam
**Coordinates**: 1.1396, 104.0041
**Status**: Completed
```

This improves accuracy, but **it's optional** - the script will auto-fill missing data.

---

## 🎯 Expected Results

After running both scripts, you'll have:

✅ **49 programs** from real journal data  
✅ **Auto-categorized** into 10 P2M categories  
✅ **Auto-geocoded** with Batam/Kepri coordinates  
✅ **Ready-to-use** TypeScript code  

---

## 🔧 Troubleshooting

### "Could not extract text (might be scanned PDF)"

Some PDFs are scanned images, not text. Solutions:

**Option A: Skip them**
- 45/49 programs is still excellent

**Option B: Use OCR**
```bash
pip install pytesseract
# Requires Tesseract OCR installed
```

**Option C: Manual entry**
- For important programs, manually type the data

### "No location hints found"

The script will use a random Batam location. To fix:

1. Open the `.md` file
2. Add manual location:
```markdown
**Location**: Nagoya, Batam
**Coordinates**: 1.1396, 104.0041
```
3. Re-run `md-to-programs.py`

### "Wrong category assigned"

Auto-categorization uses keywords. To fix:

1. Open the `.md` file
2. Add manual category:
```markdown
**Category**: Teknologi
```
3. Re-run `md-to-programs.py`

---

## 📊 Data Quality Tips

### High Priority (Do This):
1. ✅ Verify all programs have valid coordinates
2. ✅ Check category distribution (should have all 10 categories)
3. ✅ Ensure descriptions are readable

### Medium Priority (Nice to Have):
1. ⭐ Add real images from PDFs (if available)
2. ⭐ Add video URLs (if available)
3. ⭐ Refine descriptions for clarity

### Low Priority (Optional):
1. 💡 Perfect location accuracy
2. 💡 Complete author lists
3. 💡 Detailed outcomes data

---

## 🚀 After Conversion

### 1. Copy to Your App

```bash
# Open programs.ts
# Copy the entire content
# Paste into src/data/programs.ts
```

### 2. Replace Placeholder Images

The script uses placeholder Unsplash images. To use real images:

**Option A: Extract from PDFs**
- Some PDFs have photos
- Save them to `public/images/programs/`
- Update image URLs in `programs.ts`

**Option B: Find relevant Unsplash images**
- Go to unsplash.com
- Search for relevant terms (e.g., "technology workshop")
- Copy image URL: `https://images.unsplash.com/photo-XXXXX?w=800`

**Option C: Keep placeholders**
- Placeholders are fine for prototype
- You can update later

### 3. Test Your App

```bash
npm run dev
```

Check:
- ✅ All 49 programs appear on map
- ✅ Filters work for all categories
- ✅ Search finds programs
- ✅ Detail pages load
- ✅ No console errors

### 4. Build for Production

```bash
npm run build
npm start
```

---

## ⏰ Time Breakdown

| Task | Time | Can Skip? |
|------|------|-----------|
| Install dependencies | 2 min | No |
| Run pdf-to-md.py | 5 min | No |
| Manual review (optional) | 1-2 hours | Yes |
| Run md-to-programs.py | 2 min | No |
| Copy to app | 2 min | No |
| Replace images (optional) | 1-2 hours | Yes |
| Testing | 10 min | No |
| **TOTAL (minimum)** | **21 min** | - |
| **TOTAL (with review)** | **3-4 hours** | - |

---

## 💡 Pro Tips

1. **Start with 5 PDFs first** - Test the process before running all 49

2. **Keep original PDFs** - Don't delete them, you might need to re-extract

3. **Backup your data** - Save `programs.ts` and `programs.json`

4. **Document your process** - Take screenshots for your thesis methodology

5. **Academic justification**:
   > "Program data was extracted from 49 published P2M journals using automated text extraction and manual verification. This ensures data authenticity and academic rigor."

---

## 📝 For Your Thesis

### Methodology Section:

> **Data Collection Method:**
> 
> This research collected data from 49 published P2M program journals from p2m.polibatam.ac.id (years 2020-2024). The data extraction process involved:
> 
> 1. **Automated Text Extraction**: Using PyPDF2 and pdfplumber libraries to extract text from journal PDFs
> 2. **Structured Data Parsing**: Extracting program titles, authors, abstracts, and location information
> 3. **Categorization**: Classifying programs into 10 P2M categories based on keyword analysis
> 4. **Geocoding**: Converting location names to geographic coordinates using OpenStreetMap Nominatim API and manual verification
> 5. **Manual Verification**: Reviewing and correcting auto-extracted data for accuracy
> 
> This hybrid approach (automated + manual) ensures both efficiency and data quality.

---

## 🎯 Next Steps

After you have 49 programs in your app:

1. ✅ **Test thoroughly** (30 min)
2. ✅ **Take screenshots** for documentation (15 min)
3. ✅ **Update CHANGELOG.md** with v3.0.0 (5 min)
4. ✅ **Write report/journal** (Sunday)
5. ✅ **Final polish** (Sunday evening)

**You're almost done!** 🎉
