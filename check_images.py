import os
import re

def check_images():
    # Read the cardsData.js file
    with open('cardsData.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get all actual files in images folder
    actual_files = {}
    if os.path.exists('images'):
        for filename in os.listdir('images'):
            # Store filename without extension as key (lowercase for comparison)
            name_without_ext = os.path.splitext(filename)[0].lower()
            if name_without_ext not in actual_files:
                actual_files[name_without_ext] = []
            actual_files[name_without_ext].append(filename)
    
    print(f"Files in images folder: {len(os.listdir('images')) if os.path.exists('images') else 0}\n")
    
    # Extract all image paths - with OR without leading slash
    # Pattern matches: "/images/file.jpg" OR "images/file.jpg"
    image_pattern = r'["\']\/?\s*images\/([^"\']+)["\']'
    image_refs = re.findall(image_pattern, content)
    
    print(f"Total image references found: {len(image_refs)}\n")
    
    missing_images = []
    existing_images = []
    extension_mismatch = []
    
    # Check each image reference
    for img_ref in image_refs:
        # Get filename and extension
        ref_name = os.path.splitext(img_ref)[0].lower()
        ref_ext = os.path.splitext(img_ref)[1].lower()
        
        # Check if file exists with same name (any extension)
        if ref_name in actual_files:
            # Check if exact match exists
            exact_match = False
            for actual_file in actual_files[ref_name]:
                if actual_file.lower() == img_ref.lower():
                    existing_images.append(img_ref)
                    exact_match = True
                    break
            
            # If no exact match, it's an extension mismatch
            if not exact_match:
                extension_mismatch.append((img_ref, actual_files[ref_name]))
        else:
            # File doesn't exist at all
            missing_images.append(img_ref)
    
    # Print results
    print(f"✓ Existing images (exact match): {len(existing_images)}")
    print(f"⚠ Extension mismatch: {len(extension_mismatch)}")
    print(f"✗ Missing images: {len(missing_images)}\n")
    
    if extension_mismatch:
        print("=" * 70)
        print("EXTENSION MISMATCH (file exists but different extension):")
        print("=" * 70)
        for referenced, actual_files_list in extension_mismatch:
            print(f"  Referenced: images/{referenced}")
            print(f"  Actual:     {', '.join(actual_files_list)}")
            print()
    
    if missing_images:
        print("=" * 70)
        print("MISSING IMAGES (file does not exist):")
        print("=" * 70)
        for filename in missing_images:
            print(f"  ✗ images/{filename}")
        print()
    
    # Find which cards have issues
    if missing_images or extension_mismatch:
        print("=" * 70)
        print("CARDS WITH ISSUES:")
        print("=" * 70)
        
        # Extract card objects with their IDs, scheme names, and images
        # More flexible pattern to catch all variations
        card_pattern = r'\{\s*id:\s*(\d+),.*?schemeName:\s*["\']([^"\']*)["\'].*?images:\s*\[(.*?)\]'
        cards = re.finditer(card_pattern, content, re.DOTALL)
        
        issue_count = 0
        for card_match in cards:
            card_id = card_match.group(1)
            scheme_name = card_match.group(2) or "(No scheme name)"
            images_block = card_match.group(3)
            
            # Extract images in this card (with or without leading slash)
            card_images = re.findall(r'["\']\/?\s*images\/([^"\']+)["\']', images_block)
            
            # Check for issues in this card
            card_issues = []
            
            for img in card_images:
                # Check if missing
                if img in missing_images:
                    card_issues.append(('MISSING', img))
                # Check if extension mismatch
                else:
                    for ref, actual_list in extension_mismatch:
                        if ref == img:
                            card_issues.append(('EXTENSION', img, actual_list))
                            break
            
            if card_issues:
                issue_count += 1
                print(f"\n  Card ID {card_id}: {scheme_name}")
                print(f"  Total images in card: {len(card_images)}")
                for issue in card_issues:
                    if issue[0] == 'MISSING':
                        print(f"    ✗ MISSING: {issue[1]}")
                    else:
                        print(f"    ⚠ EXTENSION: {issue[1]} (actual: {', '.join(issue[2])})")
        
        print(f"\n  Total cards with issues: {issue_count}")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY:")
    print("=" * 70)
    total_refs = len(image_refs)
    print(f"Total image references: {total_refs}")
    print(f"Existing (exact): {len(existing_images)} ({len(existing_images)/total_refs*100:.1f}%)")
    print(f"Extension mismatch: {len(extension_mismatch)} ({len(extension_mismatch)/total_refs*100:.1f}%)")
    print(f"Missing: {len(missing_images)} ({len(missing_images)/total_refs*100:.1f}%)")
    
    return len(missing_images) == 0 and len(extension_mismatch) == 0

if __name__ == "__main__":
    print("Checking image paths in cardsData.js...\n")
    print("This script checks for:")
    print("  - Missing image files")
    print("  - Extension mismatches (.jpg vs .png vs .jpeg)")
    print("  - Case sensitivity is ignored (Windows compatible)")
    print("  - Handles paths with or without leading slash")
    print("\n")
    
    all_exist = check_images()
    
    if all_exist:
        print("\n✓ All images exist with correct extensions!")
        exit(0)
    else:
        print("\n✗ Some images have issues!")
        exit(1)
