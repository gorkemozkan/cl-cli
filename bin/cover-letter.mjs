#!/usr/bin/env node

import { runCLI } from '../src/cli.mjs';
import { buildLetter } from '../src/template.mjs';
import { suggestFilename, ensureDirAndWrite } from '../src/file.mjs';
import { displayError } from '../src/errors.mjs';

async function main() {
  try {
    console.log('🚀 Starting Cover Letter Generator...\n');
    
    // Get user inputs
    const answers = await runCLI();
    
    // Build the letter
    console.log('📝 Generating cover letter...');
    const letter = await buildLetter(answers);
    
    // Generate filename if not provided
    const filename = answers.filename || await suggestFilename(answers.company, answers.format);
    
    // Write the file
    console.log('💾 Saving file...');
    await ensureDirAndWrite(filename, letter);
    
    // Success message
    console.log(`\n✅ Cover letter saved to: ${filename}`);
    console.log(`📄 Format: ${answers.format.toUpperCase()}`);
    console.log(`📊 File size: ${(letter.length / 1024).toFixed(2)} KB`);
    
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

// Handle process interruptions gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Operation cancelled by user.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Process terminated.');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  process.exit(1);
});

main(); 