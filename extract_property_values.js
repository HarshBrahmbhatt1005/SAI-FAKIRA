const fs = require('fs');

try {
    const content = fs.readFileSync('cardsData.js', 'utf-8');
    
    // Regex to find all schemeNames
    const schemeRegex = /"schemeName"\s*:\s*"([^"]+)"/g;
    let match;
    const propertyNames = [];

    while ((match = schemeRegex.exec(content)) !== null) {
        propertyNames.push(match[1]);
    }

    // Build CSV with BOM
    const rows = [['Sr. No.', 'Property Name (Scheme Native)']];
    propertyNames.forEach((name, index) => {
        rows.push([index + 1, name]);
    });

    const csvContent = rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\r\n');

    const outputFile = 'property_list.csv';
    fs.writeFileSync(outputFile, '\uFEFF' + csvContent, 'utf-8');

    console.log(`Successfully extracted ${propertyNames.length} property names to ${outputFile}`);
} catch (error) {
    console.error('Error:', error.message);
}
