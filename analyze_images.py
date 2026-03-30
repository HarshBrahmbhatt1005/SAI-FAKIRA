import os
import re

# Get all actual files
actual_files = {}
all_files = []
if os.path.exists('images'):
    for filename in os.listdir('images'):
        all_files.append(filename)
        # Store both with and without extension
        name_lower = filename.lower()
        actual_files[name_lower] = filename

print(f"Total files in images folder: {len(all_files)}")

# Read cardsData.js
with open('cardsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all image references
image_pattern = r'["\']\/?\s*images\/([^"\']+)["\']'
image_refs = re.findall(image_pattern, content)

print(f"Total image references: {len(image_refs)}")

# Check each reference
missing = []
found = []

for ref in image_refs:
    ref_lower = ref.lower()
    if ref_lower in actual_files:
        found.append(ref)
    else:
        missing.append(ref)

print(f"\nFound: {len(found)}")
print(f"Missing: {len(missing)}")

if missing:
    print("\n" + "="*70)
    print("MISSING FILES:")
    print("="*70)
    for m in missing[:20]:  # Show first 20
        print(f"  Looking for: {m}")
        # Try to find similar names
        ref_base = m.lower().replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
        similar = [f for f in all_files if ref_base in f.lower()]
        if similar:
            print(f"    Similar files found: {similar}")
        else:
            print(f"    No similar files found")
