// Script to analyze SVG structure and group strokes by proximity
const fs = require('fs');

// Read the SVG file
const svgContent = fs.readFileSync('assets/Natal Plum Bush.svg', 'utf8');

// Extract all stroke uses with their coordinates
const strokeMatches = svgContent.match(/<use xlink:href="#stroke(\d+)_1605_8443" transform="matrix\([^)]+\)"\/>/g);

const strokes = [];

strokeMatches.forEach((match, index) => {
  // Extract stroke number
  const strokeNum = match.match(/stroke(\d+)_1605_8443/)[1];
  
  // Extract coordinates from matrix
  const coordsMatch = match.match(/matrix\([^)]+ ([0-9.]+) ([0-9.]+)\)/);
  if (coordsMatch) {
    const x = parseFloat(coordsMatch[1]);
    const y = parseFloat(coordsMatch[2]);
    
    strokes.push({
      index: index + 1,
      strokeNum: parseInt(strokeNum),
      x: x,
      y: y,
      original: match
    });
  }
});

// Group strokes by proximity (within 20 units)
const groups = [];
const processed = new Set();

strokes.forEach((stroke, i) => {
  if (processed.has(i)) return;
  
  const group = [stroke];
  processed.add(i);
  
  // Find nearby strokes
  strokes.forEach((otherStroke, j) => {
    if (i === j || processed.has(j)) return;
    
    const distance = Math.sqrt(
      Math.pow(stroke.x - otherStroke.x, 2) + 
      Math.pow(stroke.y - otherStroke.y, 2)
    );
    
    if (distance < 20) {
      group.push(otherStroke);
      processed.add(j);
    }
  });
  
  groups.push(group);
});

// Sort groups by average Y position (top to bottom)
groups.sort((a, b) => {
  const avgA = a.reduce((sum, s) => sum + s.y, 0) / a.length;
  const avgB = b.reduce((sum, s) => sum + s.y, 0) / b.length;
  return avgA - avgB;
});

// Output results
console.log(`Found ${groups.length} potential element groups:`);
groups.forEach((group, i) => {
  const avgX = group.reduce((sum, s) => sum + s.x, 0) / group.length;
  const avgY = group.reduce((sum, s) => sum + s.y, 0) / group.length;
  const strokeTypes = [...new Set(group.map(s => s.strokeNum))].sort();
  
  console.log(`\nGroup ${i + 1} (${group.length} strokes):`);
  console.log(`  Center: (${avgX.toFixed(1)}, ${avgY.toFixed(1)})`);
  console.log(`  Stroke types: ${strokeTypes.join(', ')}`);
  console.log(`  Strokes: ${group.map(s => s.index).join(', ')}`);
});

