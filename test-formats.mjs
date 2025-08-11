import { buildLetter } from './src/template.mjs';
import { ensureDirAndWrite } from './src/file.mjs';
import { displayError } from './src/errors.mjs';

const sampleData = {
  fullName: 'Görkem Özkan',
  phone: '+90 0542 353 73 35',
  email: 'developer@ozgorkem.com',
  company: 'TechCorp Inc',
  contactName: 'John Smith',
  platform: 'LinkedIn',
  dateDisplay: 'August 11, 2025'
};

async function testAllFormats() {
  console.log('🧪 Testing all export formats...\n');
  
  const formats = ['md', 'txt', 'email'];
  
  for (const format of formats) {
    try {
      const data = { ...sampleData, format };
      console.log(`📝 Generating ${format.toUpperCase()} format...`);
      
      const letter = await buildLetter(data);
      const filename = `test-${format}-format.${format === 'md' ? 'md' : 'txt'}`;
      
      await ensureDirAndWrite(filename, letter);
      console.log(`✅ Generated ${format.toUpperCase()} format: ${filename}`);
      console.log(`📊 File size: ${(letter.length / 1024).toFixed(2)} KB\n`);
    } catch (error) {
      const errorInfo = displayError(error, { 
        context: `Testing ${format} format`,
        filepath: `test-${format}-format.${format === 'md' ? 'md' : 'txt'}`
      });
      
      if (errorInfo.shouldExit) {
        process.exit(errorInfo.exitCode);
      }
    }
  }
  
  console.log('📄 All test files generated successfully!');
}

// Handle process interruptions gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Testing cancelled by user.');
  process.exit(0);
});

testAllFormats().catch((error) => {
  const errorInfo = displayError(error, { context: 'Test Runner' });
  process.exit(errorInfo.exitCode);
}); 