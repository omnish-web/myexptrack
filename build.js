const fs = require('fs');
const path = require('path');

const srcHtml = path.join(__dirname, 'ExpTracker.html');
const outDir = path.join(__dirname, 'www');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(srcHtml)) {
    console.error('Error: ExpTracker.html not found!');
    process.exit(1);
}

const htmlContent = fs.readFileSync(srcHtml, 'utf8');

// Write both index.html (Capacitor default entrypoint) and ExpTracker.html
fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(outDir, 'ExpTracker.html'), htmlContent, 'utf8');

console.log('✓ Build successful: ExpTracker.html copied to www/index.html and www/ExpTracker.html');
