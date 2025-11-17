const fs = require('fs');
const path = require('path');

const distPath = 'dist/portfolio/browser';
const outputFile = 'bundle-output.txt';

// Leggi tutti i file JS nella cartella dist
const files = fs.readdirSync(distPath).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));

let modules = [];

// Per ogni file, misura la dimensione e associa un “modulo” fittizio
files.forEach((file) => {
  const size = fs.statSync(path.join(distPath, file)).size;
  modules.push({ name: file, size });
});

// Ordina per dimensione decrescente
modules.sort((a, b) => b.size - a.size);

// Scrivi TOP MODULES
let out = '# TOP MODULES — SIZE KB\tMODULE_NAME\n';
modules.slice(0, 40).forEach((m) => (out += `${(m.size / 1024).toFixed(1)} KB\t${m.name}\n`));

// Aggrega per pacchetto simulando node_modules
const map = new Map();
modules.forEach((m) => {
  const match = m.name.match(/node_modules\/(@?[^\/]+\/?[^\/]*)/);
  const key = match
    ? match[1]
    : m.name.startsWith('main') || m.name.startsWith('chunk')
    ? 'app-src'
    : 'other';
  map.set(key, (map.get(key) || 0) + m.size);
});

// Scrivi TOP PACKAGES
out += '\n# TOP PACKAGES (aggregate) — SIZE KB\tPACKAGE_NAME\n';
Array.from(map.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40)
  .forEach(([k, v]) => (out += `${(v / 1024).toFixed(1)} KB\t${k}\n`));

// Salva su file
fs.writeFileSync(outputFile, out);

console.log('Analisi completata. Risultato scritto in', outputFile);
