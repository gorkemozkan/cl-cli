#!/usr/bin/env node

import { runCLI } from '../src/cli.mjs';
import { buildLetter } from '../src/template.mjs';
import { suggestFilename, ensureDirAndWrite } from '../src/file.mjs';
import { displayError } from '../src/errors.mjs';

async function main() {
  try {
    console.log('Starting Cover Letter Generator...\n');
    
    const answers = await runCLI();
    
    console.log('Generating cover letter...');
    const letter = await buildLetter(answers);
    
    const filename = answers.filename || await suggestFilename(answers.company, answers.format);
    
    console.log('Saving file...');
    await ensureDirAndWrite(filename, letter);
    
    console.log(`\nCover letter saved to: ${filename}`);
    console.log(`Format: ${answers.format.toUpperCase()}`);
    console.log(`File size: ${(letter.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    const errorInfo = displayError(error, { 
      filepath: error.filepath,
      context: 'Main Process'
    });
    
    if (errorInfo.shouldExit) {
      process.exit(errorInfo.exitCode);
    }
  }
}

process.on('SIGINT', () => {
  console.log('\n\nOperation cancelled by user.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nProcess terminated.');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

main(); 