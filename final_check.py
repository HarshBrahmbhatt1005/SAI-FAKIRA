import os
import re

def check_images_final():
    # Read cardsData.js
    with open('cardsData.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get all actual files in images folder
    actual_files = set()
    if os.path.exists('images'):
        for filename in os.listdir('images'):
            actual_files.add(filename.lower())  # Store lowercase for comparison
    
    print(f"Files in images folder: {len(actual_files)}")
    
    # Extract all image references (with or without leading slash)
    image_pattern = r'["\']\/?\s*images\/([^"\']+)["\']'
    image_refs = re.findall(image_pattern, content)
    
    # Remove duplicates while preserving order
    unique_refs = []
    seen = set()
    for ref in image_refs:
        if ref not in seen:
            unique_refs.append(ref)
            seen.add(ref)
    
    print(f"Total unique image references: {len(unique_refs)}")
    print(f"Total image references (including duplicates): {len(image_refs)}")
    
    missing = []
    extension_mismatch = []
    existing = []
    
    for ref in unique_refs:
        ref_lower = ref.lower()
        
        if ref_lower in actual_files:
            existing.append(ref)
        else:
            # Check if file exists with different extension
            ref_name = os.path.splitext(ref_lower)[0]
            found_with_diff_ext = False
            
            for actual_file in actual_files:
                actual_name = os.path.splitext(actual_file)[0]
                if actual_name == ref_name and actual_file != ref_lower:
                    extension_mismatch.append((ref, actual_file))
                    found_with_diff_ext = True
                    break
            
            if not found_with_diff_ext:
                missing.append(ref)
    
    print(f"\n✓ Existing (exact match): {len(existing)}")
    print(f"⚠ Extension mismatch: {len(extension_mismatch)}")
    print(f"✗ Missing: {len(missing)}")
    
    if extension_mismatch:
        print(f"\nExtension mismatches (first 10):")
        for ref, actual in extension_mismatch[:10]:
            print(f"  Referenced: {ref} → Actual: {actual}")
    
    if missing:
        print(f"\nMissing files (first 20):")
        for ref in missing[:20]:
            print(f"  ✗ {ref}")
    
    # Test specific cases
    print(f"\n" + "="*50)
    print("TESTING SPECIFIC CASES:")
    print("="*50)
    
    # Test aaloka
    aaloka_refs = [r for r in unique_refs if 'aaloka' in r.lower()]
    aaloka_files = [f for f in actual_files if 'aaloka' in f]
    print(f"Aaloka references: {aaloka_refs}")
    print(f"Aaloka files: {list(aaloka_files)}")
    
    return len(missing) == 0 and len(extension_mismatch) == 0

if __name__ == "__main__":
    check_images_final()