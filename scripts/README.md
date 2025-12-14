# Data Collection Scripts

This folder contains Python scripts to help you collect and generate P2M program data.

## 📋 Prerequisites

```bash
pip install requests beautifulsoup4
```

## 🚀 Quick Start Guide

### Step 1: Scrape P2M Website (Optional)

```bash
python scripts/scrape-p2m.py
```

**Output:**
- `scraped_programs.json` - Raw scraped data
- `program_links.txt` - List of journal URLs to review

**What it does:**
- Scrapes publication data from p2m.polibatam.ac.id
- Extracts program titles and journal links
- Saves data for manual review

### Step 2: Geocode Locations

```bash
python scripts/geocode-locations.py
```

**Features:**
- **Pre-defined database** of 20+ Batam/Kepri locations (most accurate)
- **Nominatim API** fallback (free, no API key needed)
- **Interactive mode** for batch geocoding

**Example usage:**
```python
from geocode_locations import geocode_location

result = geocode_location('Nagoya, Batam')
print(result)
# {'lat': 1.1396, 'lng': 104.0041, 'address': 'Nagoya, Lubuk Baja, Batam', 'method': 'database'}
```

### Step 3: Generate Programs

```bash
python scripts/generate-programs.py --count 50
```

**Output:**
- `generated_programs.json` - JSON format
- `generated_programs.ts` - TypeScript format (ready to paste)

**What it does:**
- Generates 50 realistic P2M programs
- Uses templates for all 10 categories
- Assigns real Batam/Kepri coordinates
- Adds Unsplash images
- Distributes across years 2020-2024

## 📊 Recommended Workflow

### Option A: Full Automation (Fastest - 1 hour)

```bash
# Generate 50 programs
python scripts/generate-programs.py --count 50

# Copy to your app
# Open generated_programs.ts and copy the content
# Paste into src/data/programs.ts (replace the programs array)
```

### Option B: Hybrid (Best Quality - 3-4 hours)

```bash
# 1. Scrape P2M website
python scripts/scrape-p2m.py

# 2. Review scraped_programs.json
# Manually extract 10-15 real programs from journals

# 3. Generate remaining programs
python scripts/generate-programs.py --count 35

# 4. Merge real + generated data
# Combine your real programs with generated ones
```

### Option C: Manual with Tools (Highest Quality - 6-8 hours)

```bash
# 1. Use geocode-locations.py to get coordinates
python scripts/geocode-locations.py

# 2. Manually create programs using templates from generate-programs.py
# Use the PROGRAM_TEMPLATES as inspiration

# 3. Verify all data
```

## 🗺️ Pre-defined Locations

The geocoding script includes these locations:

**Batam:**
- Nagoya, Batam Centre, Sekupang, Batu Aji
- Bengkong, Lubuk Baja, Sagulung, Nongsa
- Tanjung Uncang, Sei Beduk, Baloi

**Islands:**
- Pulau Mubut, Pulau Galang, Pulau Rempang
- Sembulang, Galang Baru

**Bintan:**
- Tanjung Pinang, Bintan Resorts

**Karimun:**
- Tanjung Balai Karimun

## 🎨 Image Sources

All images use Unsplash (free, high-quality):
- Format: `https://images.unsplash.com/photo-[ID]?w=800`
- Categories have pre-selected relevant images
- You can replace with your own images later

## ⚠️ Important Notes

1. **Academic Justification**: If using generated data, clearly state in your thesis that this is a proof-of-concept with representative data structure.

2. **Geocoding Rate Limits**: Nominatim has rate limits (1 request/second). The script includes delays.

3. **Data Quality**: Review generated data before using. Adjust descriptions to match your needs.

4. **Real Data**: Prioritize real P2M programs from journals when possible. Use generated data to fill gaps.

## 🔧 Customization

### Add More Locations

Edit `geocode-locations.py`:
```python
BATAM_LOCATIONS = {
    'your_location': {'lat': 1.234, 'lng': 104.567, 'address': 'Full Address'},
}
```

### Add More Templates

Edit `generate-programs.py`:
```python
PROGRAM_TEMPLATES = {
    'Category': [
        {
            'name': 'Program Name Template',
            'description': 'Description template...',
        },
    ],
}
```

### Change Distribution

Edit `generate-programs.py`:
```python
distribution = {
    'Pendidikan': 10,  # Change count
    'Kesehatan': 8,
    # ...
}
```

## 📝 Tips

1. **Start Small**: Generate 10 programs first, test, then scale to 50+
2. **Mix Real + Generated**: Use 10-15 real programs + 35-40 generated
3. **Verify Coordinates**: Check a few locations on Google Maps
4. **Test Filters**: Make sure all categories and years are represented
5. **Update Images**: Replace placeholder images with real photos if available

## 🆘 Troubleshooting

**"ModuleNotFoundError: No module named 'requests'"**
```bash
pip install requests beautifulsoup4
```

**"Geocoding failed"**
- Check internet connection
- Try using pre-defined locations from database
- Manually find coordinates on Google Maps

**"Generated programs look unrealistic"**
- Edit templates in `generate-programs.py`
- Adjust descriptions to match P2M themes
- Add more variety to templates

## 📞 Need Help?

Review the implementation plan for detailed guidance on data collection strategy.
