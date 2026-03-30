// This script extracts all property cards from property.html
// Run with: node extract-cards.js

const fs = require('fs');

// Read property.html
const html = fs.readFileSync('property.html', 'utf8');

// Extract all cards
const cardRegex = /<div data-id="(\d+)"[^>]*class="Property-card"[^>]*>([\s\S]*?)(?=<div data-id="|<\/div>\s*<\/div>\s*<button class="slider-btn next">)/g;

let match;
const cards = [];
let cardCount = 0;

while ((match = cardRegex.exec(html)) !== null) {
  cardCount++;
  const cardId = match[1];
  const cardHTML = match[2];
  
  // Extract data attributes
  const dataIdMatch = match[0].match(/data-id="(\d+)"/);
  const dataTypeMatch = match[0].match(/data-type="([^"]*)"/);
  const dataLatestMatch = match[0].match(/data-latest="([^"]*)"/);
  const dataLocationMatch = match[0].match(/data-location="([^"]*)"/);
  const dataPriceMatch = match[0].match(/data-price="([^"]*)"/);
  const dataImagesMatch = match[0].match(/data-images='(\[[\s\S]*?\])'/);
  
  // Extract content
  const titleMatch = cardHTML.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const priceMatch = cardHTML.match(/<i class="fa-solid fa-indian-rupee-sign"><\/i>\s*([^<]*)/);
  const sqftMatch = cardHTML.match(/<i class="fa-solid fa-vector-square"><\/i>\s*([^<]*)/);
  const featuresMatch = cardHTML.match(/<ul class="star-list">([\s\S]*?)<\/ul>/);
  
  console.log(`\nCard ${cardCount} (ID: ${cardId}):`);
  console.log(`  Type: ${dataTypeMatch ? dataTypeMatch[1] : 'N/A'}`);
  console.log(`  Location: ${dataLatestMatch ? dataLatestMatch[1] : 'N/A'}`);
  console.log(`  Has Images: ${dataImagesMatch ? 'Yes' : 'No'}`);
}

console.log(`\n\nTotal cards found: ${cardCount}`);
