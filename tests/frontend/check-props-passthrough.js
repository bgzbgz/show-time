/**
 * Props Pass-Through Checker for Fast Track Tool HTML files
 *
 * When a React component is called with props in JSX, verifies that the
 * function definition accepts those props. Catches ReferenceError crashes
 * from missing destructured params.
 *
 * Usage: node tests/frontend/check-props-passthrough.js
 * Exit code: 0 = all pass, 1 = errors found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from '@babel/parser';

const TOOLS_DIR = join(process.cwd(), 'frontend', 'tools');
const ERRORS = [];
const PASSED = [];

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

function walk(node, visitor, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 50) return;
  if (node.type) visitor(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item === 'object' && item.type) walk(item, visitor, depth + 1);
      }
    } else if (child && typeof child === 'object' && child.type) {
      walk(child, visitor, depth + 1);
    }
  }
}

function checkFile(filePath) {
  const rel = relative(process.cwd(), filePath);
  let html;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch (e) {
    ERRORS.push({ file: rel, issues: [`Cannot read: ${e.message}`] });
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
      continue;
    }

    // 1. Collect component definitions and their accepted props
    //    function ComponentName({ prop1, prop2 }) or function ComponentName(props)
    const componentDefs = new Map(); // name -> { params: Set<string>, usesPropsObj: boolean }

    walk(ast.program, (node) => {
      let name = null;
      let params = null;

      // function ComponentName(...)
      if (node.type === 'FunctionDeclaration' && node.id?.name && /^[A-Z]/.test(node.id.name)) {
        name = node.id.name;
        params = node.params;
      }
      // const ComponentName = (...) => ... or const ComponentName = function(...)
      if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && /^[A-Z]/.test(node.id.name)) {
        const init = node.init;
        if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
          name = node.id.name;
          params = init.params;
        }
      }

      if (name && params) {
        const acceptedProps = new Set();
        let usesPropsObj = false;

        for (const param of params) {
          if (param.type === 'Identifier') {
            // function Comp(props) — uses props.xxx, can't check easily
            usesPropsObj = true;
          }
          if (param.type === 'ObjectPattern') {
            for (const prop of param.properties) {
              if (prop.type === 'RestElement') {
                usesPropsObj = true; // ...rest — accepts anything
              } else if (prop.key?.type === 'Identifier') {
                acceptedProps.add(prop.key.name);
              }
            }
          }
          if (param.type === 'AssignmentPattern' && param.left?.type === 'ObjectPattern') {
            for (const prop of param.left.properties) {
              if (prop.key?.type === 'Identifier') acceptedProps.add(prop.key.name);
            }
          }
        }

        // If no params at all, it's a zero-props component
        if (params.length === 0) {
          componentDefs.set(name, { params: new Set(), usesPropsObj: false, noParams: true });
        } else {
          componentDefs.set(name, { params: acceptedProps, usesPropsObj, noParams: false });
        }
      }
    });

    // 2. Collect JSX usages: <ComponentName prop1={...} prop2={...} />
    const componentUsages = []; // { name, passedProps: string[], line }

    walk(ast.program, (node) => {
      if (node.type === 'JSXOpeningElement' && node.name?.type === 'JSXIdentifier') {
        const name = node.name.name;
        if (!/^[A-Z]/.test(name)) return; // skip HTML elements

        const passedProps = [];
        for (const attr of (node.attributes || [])) {
          if (attr.type === 'JSXAttribute' && attr.name?.type === 'JSXIdentifier') {
            passedProps.push(attr.name.name);
          }
          if (attr.type === 'JSXSpreadAttribute') {
            // {...props} — can't check, skip this component usage
            return;
          }
        }

        // Filter out React special props that are never passed to the component
        const filtered = passedProps.filter(p => p !== 'key' && p !== 'ref');
        if (filtered.length > 0) {
          componentUsages.push({
            name,
            passedProps: filtered,
            line: (node.loc?.start?.line || 0) + script.lineOffset - 1
          });
        }
      }
    });

    // 3. Cross-check: for each usage, verify the definition accepts those props
    for (const usage of componentUsages) {
      const def = componentDefs.get(usage.name);
      if (!def) continue; // external component or not defined here — skip

      if (def.usesPropsObj) continue; // uses props.xxx pattern — can't check

      if (def.noParams && usage.passedProps.length > 0) {
        issues.push(
          `<${usage.name}> (line ~${usage.line}) receives ${usage.passedProps.length} props [${usage.passedProps.join(', ')}] but function has NO parameters`
        );
        continue;
      }

      const missing = usage.passedProps.filter(p => !def.params.has(p));
      if (missing.length > 0) {
        issues.push(
          `<${usage.name}> (line ~${usage.line}) passes props [${missing.join(', ')}] not in function signature. Accepted: [${[...def.params].join(', ')}]`
        );
      }
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
console.log('║   PROPS PASS-THROUGH CHECK — Fast Track       ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

const files = findHtmlFiles(TOOLS_DIR);
console.log(`Scanning ${files.length} tool files...\n`);

for (const file of files) {
  checkFile(file);
}

if (ERRORS.length === 0) {
  console.log(`✅ ALL ${PASSED.length} files passed props check\n`);
  process.exit(0);
} else {
  console.log(`❌ ${ERRORS.length} file(s) with props issues:\n`);
  for (const err of ERRORS) {
    console.log(`  ${err.file}`);
    for (const issue of err.issues) {
      console.log(`    ✗ ${issue}`);
    }
  }
  console.log(`\n  ${PASSED.length} passed, ${ERRORS.length} failed\n`);
  process.exit(1);
}
