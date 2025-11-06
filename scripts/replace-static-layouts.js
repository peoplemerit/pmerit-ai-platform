#!/usr/bin/env node

/**
 * replace-static-layouts.js
 * 
 * Automates the transformation of HTML pages to use dynamic layout-loader system
 * instead of static header/footer blocks.
 * 
 * USAGE:
 *   node scripts/replace-static-layouts.js <file1.html> [file2.html] [...]
 * 
 * EXAMPLE:
 *   node scripts/replace-static-layouts.js pricing.html contact.html
 *   node scripts/replace-static-layouts.js *.html
 * 
 * WHAT IT DOES:
 *   1. Removes static <header>...</header> blocks (first occurrence only)
 *   2. Removes static <footer>...</footer> blocks (first occurrence only)
 *   3. Adds data-layout-auto-init attribute to <body> tag if missing
 *   4. Inserts <div id="header-container"></div> after opening <body> tag
 *   5. Inserts <div id="footer-container"></div> before closing </body> tag
 *   6. Ensures required script tags are present before </body>:
 *      - /assets/js/config.js
 *      - /assets/js/layout-loader.js
 *      - /assets/js/main.js
 *   7. Preserves all head content, meta tags, CSS, and page-specific attributes
 * 
 * IDEMPOTENT: Safe to run multiple times on the same file. Won't duplicate changes.
 * 
 * @version 1.0.0
 * @created November 2025
 */

const fs = require('fs');
const path = require('path');

/**
 * Remove first occurrence of header or footer block
 * @param {string} html - HTML content
 * @param {string} tagName - 'header' or 'footer'
 * @returns {string} HTML with tag removed
 */
function removeStaticBlock(html, tagName) {
  // Match opening tag with any attributes, content, and closing tag
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  
  // Only remove first occurrence
  const match = html.match(regex);
  if (match) {
    console.log(`  ✓ Removed static <${tagName}> block`);
    return html.replace(regex, '');
  }
  
  console.log(`  ℹ No static <${tagName}> block found`);
  return html;
}

/**
 * Add data-layout-auto-init to body tag if missing
 * @param {string} html - HTML content
 * @returns {string} Updated HTML
 */
function addLayoutAutoInit(html) {
  // Check if already has attribute
  if (html.match(/<body[^>]*data-layout-auto-init/i)) {
    console.log('  ℹ Body already has data-layout-auto-init');
    return html;
  }
  
  // Add attribute to body tag
  const bodyRegex = /<body([^>]*)>/i;
  const match = html.match(bodyRegex);
  
  if (match) {
    const existingAttrs = match[1];
    const newTag = `<body${existingAttrs} data-layout-auto-init>`;
    html = html.replace(bodyRegex, newTag);
    console.log('  ✓ Added data-layout-auto-init to <body>');
  }
  
  return html;
}

/**
 * Insert header container after opening body tag
 * @param {string} html - HTML content
 * @returns {string} Updated HTML
 */
function insertHeaderContainer(html) {
  // Check if already has header container
  if (html.includes('<div id="header-container"></div>')) {
    console.log('  ℹ Header container already exists');
    return html;
  }
  
  // Insert after body tag
  const bodyRegex = /(<body[^>]*>)/i;
  html = html.replace(bodyRegex, '$1\n  <div id="header-container"></div>');
  console.log('  ✓ Inserted header-container');
  
  return html;
}

/**
 * Insert footer container before closing body tag
 * @param {string} html - HTML content
 * @returns {string} Updated HTML
 */
function insertFooterContainer(html) {
  // Check if already has footer container
  if (html.includes('<div id="footer-container"></div>')) {
    console.log('  ℹ Footer container already exists');
    return html;
  }
  
  // Insert before </body>
  html = html.replace(/<\/body>/i, '  <div id="footer-container"></div>\n</body>');
  console.log('  ✓ Inserted footer-container');
  
  return html;
}

/**
 * Ensure required scripts are present and in correct order before closing body tag
 * @param {string} html - HTML content
 * @returns {string} Updated HTML
 */
function ensureScripts(html) {
  const requiredScripts = [
    '/assets/js/config.js',
    '/assets/js/layout-loader.js',
    '/assets/js/main.js'
  ];
  
  // Remove all existing instances of these scripts (to fix order)
  for (const scriptSrc of requiredScripts) {
    const pattern1 = new RegExp(`\\s*<script[^>]*src=["']${scriptSrc}["'][^>]*></script>\\s*`, 'gi');
    const pattern2 = new RegExp(`\\s*<script[^>]*src=["']${scriptSrc.replace(/^\//, '')}["'][^>]*></script>\\s*`, 'gi');
    html = html.replace(pattern1, '\n');
    html = html.replace(pattern2, '\n');
  }
  
  // Build script tags in correct order
  const scriptTags = requiredScripts
    .map(src => `  <script src="${src}"></script>`)
    .join('\n');
  
  // Insert before </body>
  html = html.replace(/<\/body>/i, `${scriptTags}\n</body>`);
  console.log('  ✓ Ensured scripts are present in correct order');
  
  return html;
}

/**
 * Process a single HTML file
 * @param {string} filePath - Path to HTML file
 */
function processFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ File not found: ${filePath}`);
    return;
  }
  
  // Read file
  let html = fs.readFileSync(filePath, 'utf8');
  const originalHtml = html;
  
  // Apply transformations
  html = removeStaticBlock(html, 'header');
  html = removeStaticBlock(html, 'footer');
  html = addLayoutAutoInit(html);
  html = insertHeaderContainer(html);
  html = insertFooterContainer(html);
  html = ensureScripts(html);
  
  // Write back if changed
  if (html !== originalHtml) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅ File updated successfully`);
  } else {
    console.log(`  ℹ No changes needed`);
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/replace-static-layouts.js <file1.html> [file2.html] [...]');
    console.log('\nExample:');
    console.log('  node scripts/replace-static-layouts.js pricing.html contact.html');
    console.log('  node scripts/replace-static-layouts.js *.html');
    process.exit(1);
  }
  
  console.log('🚀 Starting layout replacement script...');
  
  for (const filePath of args) {
    processFile(filePath);
  }
  
  console.log('\n✨ Done!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  removeStaticBlock,
  addLayoutAutoInit,
  insertHeaderContainer,
  insertFooterContainer,
  ensureScripts,
  processFile
};
