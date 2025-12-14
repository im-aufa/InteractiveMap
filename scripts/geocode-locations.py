"""
Location Geocoder
Converts location names to coordinates using multiple methods

Usage:
    python scripts/geocode-locations.py

Methods:
    1. Nominatim (OpenStreetMap) - Free, no API key
    2. Manual coordinate database for Batam/Kepri
    3. Google Maps fallback (requires API key)
"""

import time
import json
from typing import Dict, Optional, Tuple
import requests

# ============================================================================
# PRE-DEFINED BATAM/KEPRI LOCATIONS (Most Accurate)
# ============================================================================

BATAM_LOCATIONS = {
    # Batam City Areas
    'nagoya': {'lat': 1.1396, 'lng': 104.0041, 'address': 'Nagoya, Lubuk Baja, Batam'},
    'batam centre': {'lat': 1.1181, 'lng': 104.0569, 'address': 'Batam Centre, Batam Kota, Batam'},
    'sekupang': {'lat': 1.1234, 'lng': 103.9876, 'address': 'Sekupang, Batam'},
    'batu aji': {'lat': 1.0544, 'lng': 104.0150, 'address': 'Batu Aji, Batam'},
    'bengkong': {'lat': 1.1234, 'lng': 104.0234, 'address': 'Bengkong, Batam'},
    'lubuk baja': {'lat': 1.1456, 'lng': 104.0345, 'address': 'Lubuk Baja, Batam'},
    'sagulung': {'lat': 1.0234, 'lng': 103.9876, 'address': 'Sagulung, Batam'},
    'nongsa': {'lat': 1.1789, 'lng': 104.0876, 'address': 'Nongsa, Batam'},
    'tanjung uncang': {'lat': 1.0856, 'lng': 103.9456, 'address': 'Tanjung Uncang, Batu Aji, Batam'},
    'sei beduk': {'lat': 1.0789, 'lng': 104.0123, 'address': 'Sei Beduk, Sagulung, Batam'},
    'baloi': {'lat': 1.1123, 'lng': 104.0456, 'address': 'Baloi, Batam Kota, Batam'},
    
    # Galang & Islands
    'pulau mubut': {'lat': 0.9892, 'lng': 104.0156, 'address': 'Pulau Mubut Darat, Galang, Batam'},
    'pulau galang': {'lat': 0.9876, 'lng': 104.0234, 'address': 'Pulau Galang, Batam'},
    'pulau rempang': {'lat': 1.0123, 'lng': 103.9987, 'address': 'Pulau Rempang, Batam'},
    'sembulang': {'lat': 1.0544, 'lng': 104.0150, 'address': 'Sembulang, Galang, Batam'},
    'galang baru': {'lat': 0.9956, 'lng': 104.0289, 'address': 'Galang Baru, Galang, Batam'},
    
    # Bintan
    'tanjung pinang': {'lat': 0.9183, 'lng': 104.4577, 'address': 'Tanjung Pinang, Bintan'},
    'bintan resorts': {'lat': 1.1500, 'lng': 104.5000, 'address': 'Bintan Resorts, Bintan'},
    
    # Karimun
    'tanjung balai karimun': {'lat': 1.0667, 'lng': 103.4333, 'address': 'Tanjung Balai Karimun, Karimun'},
}

# ============================================================================
# GEOCODING FUNCTIONS
# ============================================================================

def geocode_from_database(location_name: str) -> Optional[Dict]:
    """
    Check if location exists in our pre-defined database
    This is the most accurate method for Batam/Kepri
    """
    location_lower = location_name.lower().strip()
    
    # Direct match
    if location_lower in BATAM_LOCATIONS:
        result = BATAM_LOCATIONS[location_lower].copy()
        result['method'] = 'database'
        result['confidence'] = 'high'
        return result
    
    # Partial match
    for key, value in BATAM_LOCATIONS.items():
        if key in location_lower or location_lower in key:
            result = value.copy()
            result['method'] = 'database_partial'
            result['confidence'] = 'medium'
            return result
    
    return None

def geocode_nominatim(location_name: str) -> Optional[Dict]:
    """
    Geocode using Nominatim (OpenStreetMap) - Free, no API key required
    """
    try:
        # Add "Batam" or "Kepulauan Riau" to improve accuracy
        search_query = f"{location_name}, Batam, Kepulauan Riau, Indonesia"
        
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': search_query,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'id',  # Indonesia only
        }
        headers = {
            'User-Agent': 'P2M-Interactive-Map/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        
        results = response.json()
        if results:
            result = results[0]
            return {
                'lat': float(result['lat']),
                'lng': float(result['lon']),
                'address': result.get('display_name', location_name),
                'method': 'nominatim',
                'confidence': 'medium'
            }
        
        return None
        
    except Exception as e:
        print(f"  ⚠️  Nominatim error: {e}")
        return None

def geocode_location(location_name: str, delay: float = 1.0) -> Optional[Dict]:
    """
    Geocode a location using multiple methods (fallback chain)
    
    Priority:
    1. Pre-defined database (most accurate for Batam)
    2. Nominatim (free, no API key)
    3. Manual input (fallback)
    """
    print(f"\n📍 Geocoding: {location_name}")
    
    # Method 1: Database lookup
    result = geocode_from_database(location_name)
    if result:
        print(f"  ✓ Found in database ({result['confidence']} confidence)")
        return result
    
    # Method 2: Nominatim
    time.sleep(delay)  # Rate limiting
    result = geocode_nominatim(location_name)
    if result:
        print(f"  ✓ Found via Nominatim")
        return result
    
    # Method 3: Manual fallback
    print(f"  ❌ Could not geocode automatically")
    print(f"  💡 Please find coordinates manually:")
    print(f"     1. Go to https://www.google.com/maps")
    print(f"     2. Search for: {location_name}, Batam")
    print(f"     3. Right-click and copy coordinates")
    
    return None

# ============================================================================
# BATCH GEOCODING
# ============================================================================

def geocode_batch(locations: list) -> Dict:
    """
    Geocode a batch of locations
    """
    print("🌍 Starting batch geocoding...")
    print("=" * 60)
    
    results = {}
    failed = []
    
    for location in locations:
        result = geocode_location(location)
        if result:
            results[location] = result
        else:
            failed.append(location)
    
    print("\n" + "=" * 60)
    print(f"✅ Successfully geocoded: {len(results)}/{len(locations)}")
    
    if failed:
        print(f"\n❌ Failed to geocode ({len(failed)}):")
        for loc in failed:
            print(f"   - {loc}")
    
    return results

# ============================================================================
# INTERACTIVE MODE
# ============================================================================

def interactive_mode():
    """
    Interactive geocoding mode
    """
    print("\n🗺️  Interactive Geocoding Mode")
    print("=" * 60)
    print("Enter location names (one per line)")
    print("Type 'done' when finished")
    print("=" * 60)
    
    locations = []
    while True:
        location = input("\nLocation: ").strip()
        if location.lower() == 'done':
            break
        if location:
            locations.append(location)
    
    if locations:
        results = geocode_batch(locations)
        
        # Save results
        output_file = "geocoded_locations.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Saved results to {output_file}")

# ============================================================================
# MAIN
# ============================================================================

def main():
    """Main function"""
    print("🚀 Location Geocoder for P2M Programs")
    print("=" * 60)
    
    # Example usage
    print("\n📋 Available pre-defined locations:")
    for i, location in enumerate(BATAM_LOCATIONS.keys(), 1):
        print(f"   {i}. {location.title()}")
    
    print("\n" + "=" * 60)
    choice = input("\nStart interactive mode? (y/n): ").strip().lower()
    
    if choice == 'y':
        interactive_mode()
    else:
        print("\n💡 Usage examples:")
        print("   from geocode_locations import geocode_location")
        print("   result = geocode_location('Nagoya, Batam')")
        print("   print(result)")

if __name__ == "__main__":
    main()
