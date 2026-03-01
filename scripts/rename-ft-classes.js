/**
 * rename-ft-classes.js
 * Renames ft-* CSS class names to field-* in tools 10 and 11.
 * Both the CSS definitions and JSX className usages are updated.
 * Visual appearance is unchanged — only the class names change.
 *
 * Renames (both CSS selector and JSX className string):
 *   ft-label       → field-label
 *   ft-input       → field-input
 *   ft-textarea    → field-textarea
 *   ft-help        → field-help
 *   ft-field-group → field-group
 *
 * Left alone (no field-* equivalent):
 *   ft-required, ft-section, ft-insight, ft-example, ft-reveal-*
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOOLS = join(__dirname, '../frontend/tools');

const RENAMES = [
  // order matters: more specific first to avoid partial matches
  [/ft-field-group/g, 'field-group'],
  [/ft-textarea/g,    'field-textarea'],
  [/ft-input/g,       'field-input'],
  [/ft-label/g,       'field-label'],
  [/ft-help/g,        'field-help'],
];

const FILES = [
  'module-2-performance/10-performance.html',
  'module-2-performance/11-meeting-rhythm.html',
];

for (const rel of FILES) {
  const path = join(TOOLS, rel);
  let content = readFileSync(path, 'utf8');
  for (const [pattern, replacement] of RENAMES) {
    content = content.replace(pattern, replacement);
  }
  writeFileSync(path, content, 'utf8');
  console.log('Updated:', rel);
}
console.log('Done.');
