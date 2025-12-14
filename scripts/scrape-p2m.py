"""
P2M Website Scraper
Scrapes program data from p2m.polibatam.ac.id

Usage:
    python scripts/scrape-p2m.py

Output:
    - scraped_programs.json (raw data)
    - program_links.txt (list of journal URLs)
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from typing import List, Dict

# P2M website URLs by year
P2M_URLS = {
    2024: "https://p2m.polibatam.ac.id/?page_id=7000",  # Update with actual URL
    2023: "https://p2m.polibatam.ac.id/?page_id=6998",
    2022: "https://p2m.polibatam.ac.id/?page_id=6994",
    2021: "https://p2m.polibatam.ac.id/?page_id=6992",
    2020: "https://p2m.polibatam.ac.id/?page_id=6990",
}

def scrape_year(year: int, url: str) -> List[Dict]:
    """Scrape programs from a specific year page"""
    print(f"\n📅 Scraping year {year}...")
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        programs = []
        
        # Find publication section (usually at the bottom)
        # Look for headings like "PUBLIKASI LUARAN" or similar
        publication_section = soup.find(string=re.compile(r'PUBLIKASI|LUARAN', re.I))
        
        if publication_section:
            # Find all links in the publication section
            parent = publication_section.find_parent()
            if parent:
                links = parent.find_all('a', href=True)
                
                for link in links:
                    title = link.get_text(strip=True)
                    url = link['href']
                    
                    # Extract author (usually before the title)
                    # This is a simplified extraction - adjust based on actual HTML structure
                    program = {
                        'title': title,
                        'url': url,
                        'year': year,
                        'authors': [],  # Will need manual extraction
                        'journal': '',  # Will need manual extraction
                    }
                    programs.append(program)
                    print(f"  ✓ Found: {title[:60]}...")
        
        print(f"  📊 Total programs found: {len(programs)}")
        return programs
        
    except Exception as e:
        print(f"  ❌ Error scraping {year}: {e}")
        return []

def main():
    """Main scraping function"""
    print("🚀 Starting P2M Website Scraper...")
    print("=" * 60)
    
    all_programs = []
    
    for year, url in P2M_URLS.items():
        programs = scrape_year(year, url)
        all_programs.extend(programs)
    
    # Save results
    output_file = "scraped_programs.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_programs, f, indent=2, ensure_ascii=False)
    
    # Save just the URLs for manual review
    with open("program_links.txt", 'w', encoding='utf-8') as f:
        for prog in all_programs:
            f.write(f"{prog['year']} - {prog['title']}\n")
            f.write(f"    {prog['url']}\n\n")
    
    print("\n" + "=" * 60)
    print(f"✅ Scraping complete!")
    print(f"📁 Saved {len(all_programs)} programs to {output_file}")
    print(f"📋 Saved links to program_links.txt")
    print("\n💡 Next steps:")
    print("   1. Review scraped_programs.json")
    print("   2. Visit journal URLs to extract details")
    print("   3. Use geocode-locations.py to get coordinates")

if __name__ == "__main__":
    main()
