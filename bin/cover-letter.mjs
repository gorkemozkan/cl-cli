#!/usr/bin/env node

import { runCLI } from '../src/cli.mjs';
import { buildLetter } from '../src/template.mjs';
import { suggestFilename, ensureDirAndWrite } from '../src/file.mjs';

async function main() {
  try {
    const answers = await runCLI();
    const letter = buildLetter(answers);
    const filename = answers.filename || suggestFilename(answers.company, answers.format);
    
    await ensureDirAndWrite(filename, letter);
    console.log(`\n✅ Cover letter saved to: ${filename}`);
    console.log(`📄 Format: ${answers.format.toUpperCase()}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main(); 