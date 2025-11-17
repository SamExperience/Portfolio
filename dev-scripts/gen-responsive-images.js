/**
 * scripts/generate-responsives-optimized.js
 *
 * Generates 4 WebP responsive versions for each image found in:
 *   src/assets/images (recursively)
 *
 * Versions (labels & widths):
 *   - mobile  : 480
 *   - tablet  : 768
 *   - desktop : 1280
 *   - large   : 1920
 *
 * Safe & robust features:
 *   - async/await + async directory walker (no big arrays)
 *   - concurrency limit to avoid overloading the machine
 *   - skip files smaller than MIN_BYTES
 *   - skip generation if output exists and is newer than source
 *   - catch errors per-file so script continues on failures
 *   - short and clear comments at the top of functions for future devs
 *
 * Usage:
 *   npm install --save-dev sharp
 *   node scripts/generate-responsives-optimized.js
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'src', 'assets', 'images'); // change if needed

const VERSIONS = {
  mobile: 480,
  tablet: 768,
  desktop: 1280,
  large: 1920,
};

const QUALITY = 80; // WebP quality
const MIN_BYTES = 5 * 1024; // skip files smaller than this (5KB)
const CONCURRENCY = Math.max(2, Math.floor(os.cpus().length / 2));

/**
 * Simple pLimit implementation.
 * Keeps at most `concurrency` tasks running concurrently.
 * Returns a function that accepts an async function and runs it under the limit.
 */
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (queue.length === 0) return;
    if (active >= concurrency) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(fn)
      .then((v) => {
        active--;
        resolve(v);
        next();
      })
      .catch((err) => {
        active--;
        reject(err);
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

const limit = pLimit(CONCURRENCY);

/**
 * Safely stat a file.
 * Returns the fs.Stats object or null if the file does not exist or stat fails.
 */
async function fileStatSafe(p) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

/**
 * Determine whether we need to create the output file.
 * - returns false if source does not exist or is too small
 * - returns true if output does not exist
 * - returns true if output exists but is older than source
 */
async function needsCreation(srcPath, outPath) {
  const srcStat = await fileStatSafe(srcPath);
  if (!srcStat) return false;
  if (srcStat.size < MIN_BYTES) return false;
  const outStat = await fileStatSafe(outPath);
  if (!outStat) return true;
  return outStat.mtimeMs < srcStat.mtimeMs;
}

/**
 * Async generator that walks a directory recursively yielding file paths.
 * This avoids building large arrays in memory for big trees.
 */
async function* walkDir(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    // If directory cannot be read, log and stop walking this branch.
    console.error(`Cannot read directory ${dir}:`, err.message);
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(full);
    } else {
      yield full;
    }
  }
}

/**
 * Process a single image file:
 * - for each version label/width, generate a {base}-{label}.webp file
 * - uses concurrency limiter for image generation tasks
 * - returns an object with counts and any error encountered
 */
async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return { processed: 0, created: 0 };
  }

  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);

  let createdCount = 0;
  let processedCount = 0;

  const tasks = Object.entries(VERSIONS).map(([label, width]) => async () => {
    processedCount++;
    const outName = `${base}-${label}.webp`;
    const outPath = path.join(dir, outName);
    try {
      const shouldCreate = await needsCreation(filePath, outPath);
      if (!shouldCreate) {
        // Skip silently to keep logs clean
        return { created: false, outPath };
      }

      // Make sure we don't enlarge small images beyond original size
      await sharp(filePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      return { created: true, outPath };
    } catch (err) {
      // Log the error but don't throw: we want to process other images
      console.error(`Failed to process ${filePath} -> ${outPath}:`, err.message || err);
      return { created: false, outPath, error: err };
    }
  });

  // Run tasks with concurrency limit and collect results
  const results = await Promise.all(tasks.map((t) => limit(t)));
  createdCount = results.filter((r) => r && r.created).length;

  return { processed: processedCount, created: createdCount, base };
}

/**
 * Main runner:
 * - ensures the images directory exists
 * - iterates files using walkDir generator
 * - processes images sequentially (limited concurrency internally)
 * - prints a summary and exits with code 0 on success
 */
(async function main() {
  try {
    const dirExists = await fileStatSafe(IMAGES_DIR);
    if (!dirExists || !dirExists.isDirectory()) {
      console.error(`Images directory not found: ${IMAGES_DIR}`);
      process.exit(1);
    }

    console.log(`Starting responsive image generation in: ${IMAGES_DIR}`);
    console.log(`Concurrency limit: ${CONCURRENCY}, quality: ${QUALITY}, min bytes: ${MIN_BYTES}`);

    let totalFiles = 0;
    let totalProcessedVersions = 0;
    let totalCreated = 0;
    let skippedTooSmall = 0;
    let totalErrors = 0;

    for await (const file of walkDir(IMAGES_DIR)) {
      totalFiles++;
      try {
        const stat = await fileStatSafe(file);
        if (!stat) continue;
        if (stat.size < MIN_BYTES) {
          skippedTooSmall++;
          continue;
        }
        const res = await processFile(file);
        totalProcessedVersions += res.processed || 0;
        totalCreated += res.created || 0;
      } catch (err) {
        totalErrors++;
        console.error(`Unexpected error processing ${file}:`, err.message || err);
        // continue with next file
      }
    }

    console.log('--- Summary ---');
    console.log(`Files scanned: ${totalFiles}`);
    console.log(`Versions processed (attempted): ${totalProcessedVersions}`);
    console.log(`New files created: ${totalCreated}`);
    console.log(`Skipped (too small): ${skippedTooSmall}`);
    console.log(`Errors encountered: ${totalErrors}`);
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err.message || err);
    process.exit(1);
  }
})();
