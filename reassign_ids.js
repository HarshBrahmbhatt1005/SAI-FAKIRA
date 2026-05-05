const fs = require('fs');

try {
    const filename = 'cardsData.js';
    const content = fs.readFileSync(filename, 'utf-8');
    
    let counter = 1;
    // Regex matches "id": number (optional spaces)
    // We use a function as the second argument to replace to increment the counter
    const updatedContent = content.replace(/"id"\s*:\s*\d+/g, (match) => {
        return `"id": ${counter++}`;
    });

    fs.writeFileSync(filename, updatedContent, 'utf-8');
    console.log(`Successfully reassigned ${counter - 1} IDs in ${filename} in ascending order.`);
} catch (error) {
    console.error('Error:', error.message);
}
