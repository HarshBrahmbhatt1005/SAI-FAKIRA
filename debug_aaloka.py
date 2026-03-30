import os
import re

# Read cardsData.js
with open('cardsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all aaloka references
aaloka_matches = re.finditer(r'aaloka[^"\']*', content, re.IGNORECASE)
print("All aaloka references in cardsData.js:")
for match in aaloka_matches:
    start = max(0, match.start() - 50)
    end = min(len(content), match.end() + 50)
    context = content[start:end].replace('\n', ' ')
    print(f"  {context}")

print("\n" + "="*70)

# Extract all image references with aaloka
image_pattern = r'["\']\/?\s*images\/([^"\']*aaloka[^"\']*)["\']'
aaloka_images = re.findall(image_pattern, content, re.IGNORECASE)
print(f"Aaloka image references found: {len(aaloka_images)}")
for img in aaloka_images:
    print(f"  - {img}")

print("\n" + "="*70)

# Check what aaloka files actually exist
actual_aaloka = []
if os.path.exists('images'):
    for filename in os.listdir('images'):
        if 'aaloka' in filename.lower():
            actual_aaloka.append(filename)

print(f"Actual aaloka files in images folder: {len(actual_aaloka)}")
for file in actual_aaloka:
    print(f"  - {file}")