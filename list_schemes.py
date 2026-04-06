import re

# Read cardsData.js
with open('cardsData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract ID and schemeName pairs
pattern = r'\{\s*id:\s*(\d+),[\s\S]*?schemeName:\s*["\']([^"\']*)["\']'
matches = re.findall(pattern, content)

# Convert to list of tuples and sort by ID
cards = [(int(id_str), scheme) for id_str, scheme in matches]
cards.sort(key=lambda x: x[0])

# Print results
print("Card ID : Scheme Name")
print("=" * 50)
for card_id, scheme_name in cards:
    scheme_display = scheme_name if scheme_name else "(No scheme name)"
    print(f"ID {card_id:3d}: {scheme_display}")

print(f"\nTotal cards: {len(cards)}")