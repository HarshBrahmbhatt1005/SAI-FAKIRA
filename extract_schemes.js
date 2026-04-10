const fs = require('fs');

const content = fs.readFileSync('cardsData.js', 'utf-8');

// Parse each card block by splitting on object boundaries
// Extract id, latest, schemeName per entry
const entries = [];
const idRegex = /"id"\s*:\s*(\d+)/g;
const blocks = content.split(/(?=\{\s*"id"\s*:)/);

for (const block of blocks) {
  const idMatch = block.match(/"id"\s*:\s*(\d+)/);
  const latestMatch = block.match(/"latest"\s*:\s*"([^"]+)"/);
  const schemeMatch = block.match(/"schemeName"\s*:\s*"([^"]+)"/);

  if (idMatch && schemeMatch) {
    entries.push({
      id: parseInt(idMatch[1]),
      schemeName: schemeMatch[1],
      latest: latestMatch ? latestMatch[1] : ''
    });
  }
}

// Unique by schemeName, preserving first occurrence order
const seen = new Set();
const unique = [];
for (const e of entries) {
  if (!seen.has(e.schemeName)) {
    seen.add(e.schemeName);
    unique.push(e);
  }
}

// Build CSV
const rows = [['Sr. No.', 'Scheme Name', 'Latest']];
unique.forEach((item, i) => rows.push([i + 1, item.schemeName, item.latest]));

const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
fs.writeFileSync('unique_schemes.csv', '\uFEFF' + csv, 'utf-8'); // BOM for Excel

console.log(`Done! ${unique.length} unique schemes saved to unique_schemes.csv`);
