#!/usr/bin/env node
/**
 * Test runner for career matching algorithm
 * Usage: node run-tests.js
 */

import { runTests } from './career-matching.test.js';

async function main() {
  try {
    const results = await runTests();
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test runner failed:', error);
    process.exit(1);
  }
}

main();
