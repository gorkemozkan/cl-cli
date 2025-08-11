import { buildLetter } from './src/template.mjs';
import { ensureDirAndWrite } from './src/file.mjs';

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
    const data = { ...sampleData, format };
    const letter = buildLetter(data);
    const filename = `test-${format}-format.${format === 'md' ? 'md' : 'txt'}`;
    
    await ensureDirAndWrite(filename, letter);
    console.log(`✅ Generated ${format.toUpperCase()} format: ${filename}`);
  }
  
  console.log('\n📄 All test files generated successfully!');
}

testAllFormats().catch(console.error); 