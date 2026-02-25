const fs   = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'frontend', 'tools');
const SKIP = new Set(['01-know-thyself.html', 'TOOL-BLUEPRINT.html']);

let fixed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!entry.name.endsWith('.html') || SKIP.has(entry.name)) continue;

    let content = fs.readFileSync(full, 'utf8');
    // Replace 'resize: none;' only if not already !important
    const updated = content.replace(/resize: none;(?! !important)/g, 'resize: none !important;');
    if (updated !== content) {
      fs.writeFileSync(full, updated, 'utf8');
      fixed++;
      console.log('  Fixed: ' + entry.name);
    }
  }
}

walk(TOOLS_DIR);
console.log('\nTotal files updated: ' + fixed);
