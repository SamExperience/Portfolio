const express = require('express');
const path = require('path');
const compression = require('compression'); // gzip

const app = express();
const distFolder = path.join(__dirname, 'dist/portfolio/browser');

// Abilita gzip su tutti i file
app.use(
  compression({
    level: 9, // massima compressione gzip
    threshold: 0, // comprime tutti i file
  })
);

// Serve static con cache headers
app.use(
  express.static(distFolder, {
    setHeaders: (res, filePath) => {
      if (filePath.match(/\.(?:js|css|woff2?|avif|webp|png|jpg|svg)$/)) {
        // Cache lunga per file hashati
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('index.html')) {
        // Cache breve per HTML
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      }
    },
  })
);

// Fallback SPA per tutte le route
app.use((req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

// Porta locale
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
