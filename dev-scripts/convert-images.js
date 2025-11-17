// convert-images.js
// Usage: node convert-images.js
// Make sure to install sharp: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Resolve from project root
const srcDir = path.join(__dirname, '..', 'src/assets/images/SVG');

// Output folder for optimized AVIF and WebP images
const outDir = path.join(srcDir, 'optimized');

// Create output folder if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// Function to filter image files by extension
const getImageFiles = (directory) => {
  return fs.readdirSync(directory).filter((file) => /\.(svg|png|jpg|jpeg)$/i.test(file));
};

// Function to convert a single image to AVIF and WebP
const convertImage = (file) => {
  const inputPath = path.join(srcDir, file);
  const fileNameWithoutExt = path.parse(file).name;

  // Convert to AVIF
  sharp(inputPath)
    .avif({ quality: 50 })
    .toFile(path.join(outDir, `${fileNameWithoutExt}.avif`))
    .then(() => console.log(`Generated AVIF: ${fileNameWithoutExt}.avif`))
    .catch((err) => console.error(`Error converting to AVIF: ${file}`, err));

  // Convert to WebP
  sharp(inputPath)
    .webp({ quality: 60 })
    .toFile(path.join(outDir, `${fileNameWithoutExt}.webp`))
    .then(() => console.log(`Generated WebP: ${fileNameWithoutExt}.webp`))
    .catch((err) => console.error(`Error converting to WebP: ${file}`, err));
};

// Main function to process all images
const processImages = () => {
  const files = getImageFiles(srcDir);
  if (files.length === 0) {
    console.log('No images found to convert.');
    return;
  }

  console.log(`Starting conversion of ${files.length} images...`);
  files.forEach(convertImage);
};

processImages();
