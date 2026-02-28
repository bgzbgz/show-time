/**
 * Undefined Reference Checker for Fast Track Tool HTML files
 *
 * Scans each tool's <script type="text/babel"> block for functions/components
 * that are CALLED but never DEFINED. Catches bugs like renderStep1() missing.
 *
 * Uses @babel/parser AST traversal for accuracy.
 *
 * Usage: node tests/frontend/check-undefined-refs.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from '@babel/parser';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
const PASSED = [];

// Known globals that should NOT be flagged
const KNOWN_GLOBALS = new Set([
  // React
  'React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useMemo',
  'useCallback', 'useContext', 'useReducer', 'useLayoutEffect', 'Fragment',
  'createRoot', 'createElement', 'memo', 'forwardRef', 'lazy', 'Suspense',
  // Browser
  'document', 'window', 'console', 'localStorage', 'sessionStorage',
  'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'fetch', 'URL', 'URLSearchParams', 'FormData', 'Blob', 'File',
  'alert', 'confirm', 'prompt', 'navigator', 'location', 'history',
  'requestAnimationFrame', 'cancelAnimationFrame', 'performance',
  'MutationObserver', 'ResizeObserver', 'IntersectionObserver',
  'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent',
  'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement',
  'AbortController', 'TextEncoder', 'TextDecoder',
  // Built-in objects
  'JSON', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean',
  'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Promise', 'Proxy', 'Reflect',
  'RegExp', 'Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent',
  'decodeURIComponent', 'encodeURI', 'decodeURI', 'atob', 'btoa',
  'structuredClone', 'queueMicrotask', 'globalThis', 'undefined', 'NaN', 'Infinity',
  // Libraries used by tools
  'supabase', 'html2canvas', 'jsPDF', 'jspdf',
  // Fast Track globals
  'ToolDB', 'AIChallenge', 'DependencyInjection', 'CognitiveLoad',
  'renderTransitionScreen', 'CONFIG',
  // Common patterns
  'require', 'module', 'exports', 'process', '__dirname', '__filename',
]);

function findHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findHtmlFiles(full));
    } else if (entry.endsWith('.html') && !entry.includes('BLUEPRINT')) {
      files.push(full);
    }
  }
  return files;
}

function extractBabelScripts(html) {
  const scripts = [];
  const regex = /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const beforeScript = html.substring(0, match.index);
    const lineOffset = beforeScript.split('\n').length;
    scripts.push({ content: match[1], lineOffset });
  }
  return scripts;
}

function collectDefinitionsAndCalls(ast) {
  const defined = new Set();
  const called = []; // { name, line }

  function walk(node, depth) {
    if (!node || typeof node !== 'object') return;
    if (depth > 50) return; // prevent infinite recursion

    // Track definitions
    if (node.type === 'FunctionDeclaration' && node.id) {
      defined.add(node.id.name);
    }
    if (node.type === 'VariableDeclarator' && node.id) {
      if (node.id.type === 'Identifier') {
        defined.add(node.id.name);
      }
      // Destructuring: const [x, setX] = useState()
      if (node.id.type === 'ArrayPattern') {
        for (const el of node.id.elements) {
          if (el && el.type === 'Identifier') defined.add(el.name);
        }
      }
      // Destructuring: const { a, b } = obj
      if (node.id.type === 'ObjectPattern') {
        for (const prop of node.id.properties) {
          if (prop.value && prop.value.type === 'Identifier') defined.add(prop.value.name);
          else if (prop.key && prop.key.type === 'Identifier' && !prop.computed) defined.add(prop.key.name);
        }
      }
    }
    // Function params
    if ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && node.params) {
      for (const param of node.params) {
        if (param.type === 'Identifier') defined.add(param.name);
        if (param.type === 'ObjectPattern') {
          for (const prop of param.properties) {
            if (prop.value && prop.value.type === 'Identifier') defined.add(prop.value.name);
            else if (prop.key && prop.key.type === 'Identifier') defined.add(prop.key.name);
          }
        }
        if (param.type === 'AssignmentPattern' && param.left?.type === 'Identifier') {
          defined.add(param.left.name);
        }
      }
    }
    // Class declarations
    if (node.type === 'ClassDeclaration' && node.id) {
      defined.add(node.id.name);
    }
    // Import specifiers
    if (node.type === 'ImportSpecifier' || node.type === 'ImportDefaultSpecifier') {
      if (node.local) defined.add(node.local.name);
    }
    // Catch clause param
    if (node.type === 'CatchClause' && node.param?.type === 'Identifier') {
      defined.add(node.param.name);
    }
    // For-in/for-of
    if ((node.type === 'ForInStatement' || node.type === 'ForOfStatement') && node.left?.type === 'VariableDeclaration') {
      for (const decl of node.left.declarations) {
        if (decl.id?.type === 'Identifier') defined.add(decl.id.name);
      }
    }

    // Track calls: functionName() — only top-level-ish calls to our own functions
    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier') {
      const name = node.callee.name;
      // Only track calls that look like custom functions (start with lowercase or render*)
      if (/^[a-z]/.test(name) || /^render/.test(name) || /^[A-Z]/.test(name)) {
        called.push({ name, line: node.loc?.start?.line || 0 });
      }
    }

    // Track JSX components: <ComponentName ... />
    if (node.type === 'JSXOpeningElement' && node.name?.type === 'JSXIdentifier') {
      const name = node.name.name;
      // Only custom components (uppercase first letter), skip HTML elements
      if (/^[A-Z]/.test(name)) {
        called.push({ name, line: node.loc?.start?.line || 0 });
      }
    }

    // Recurse into all child nodes
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && item.type) walk(item, depth + 1);
        }
      } else if (child && typeof child === 'object' && child.type) {
        walk(child, depth + 1);
      }
    }
  }

  walk(ast, 0);
  return { defined, called };
}

function checkFile(filePath) {
  const rel = relative(process.cwd(), filePath);
  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (e) {
    ERRORS.push({ file: rel, issues: [`Cannot read file: ${e.message}`] });
    return;
  }

  const scripts = extractBabelScripts(html);
  if (scripts.length === 0) return;

  const issues = [];

  for (const script of scripts) {
    let ast;
    try {
      ast = parse(script.content, {
        sourceType: 'script',
        plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
        errorRecovery: true,
      });
    } catch (e) {
      // Syntax errors handled by check-babel-syntax.js
      continue;
    }

    const { defined, called } = collectDefinitionsAndCalls(ast.program);

    // Find calls to undefined functions
    const seen = new Set();
    for (const call of called) {
      if (defined.has(call.name)) continue;
      if (KNOWN_GLOBALS.has(call.name)) continue;
      // Skip member-accessed names (we only track bare identifiers)
      const key = call.name;
      if (seen.has(key)) continue;
      seen.add(key);

      const actualLine = call.line + script.lineOffset - 1;
      issues.push(`"${call.name}" called (line ~${actualLine}) but never defined`);
    }
  }

  if (issues.length > 0) {
    ERRORS.push({ file: rel, issues });
  } else {
    PASSED.push(rel);
  }
}

// ── Run ──
console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║   UNDEFINED REFERENCE CHECK — Fast Track      ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed undefined reference check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with undefined references:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
