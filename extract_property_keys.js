const fs = require('fs');

try {
    const content = fs.readFileSync('cardsData.js', 'utf-8');
    
    // Regex to find all keys: "key": or 'key':
    const keyRegex = /["']([^"']+)["']\s*:/g;
    let match;
    const seenKeys = new Set();
    const uniqueKeys = [];

    while ((match = keyRegex.exec(content)) !== null) {
        const key = match[1];
        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueKeys.push(key);
        }
    }

    // Build CSV with BOM for Excel compatibility
    const rows = [['Sr. No.', 'Property Name (Key)']];
    uniqueKeys.forEach((key, index) => {
        rows.push([index + 1, key]);
    });

    const csvContent = rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\r\n');

    const outputFile = 'all_property_keys.csv';
    fs.writeFileSync(outputFile, '\uFEFF' + csvContent, 'utf-8');

    console.log(`Successfully extracted ${uniqueKeys.length} unique property names (keys) to ${outputFile}`);
} catch (error) {
    console.error('Error:', error.message);
}
