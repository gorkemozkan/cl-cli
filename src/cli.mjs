import readline from 'readline';
import { DEFAULTS, EXPORT_FORMATS } from './constants.mjs';
import { isEmailLike } from './validators.mjs';
import { suggestFilename } from './file.mjs';

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, prompt, defaultValue = '') {
  const displayPrompt = defaultValue ? `${prompt} (${defaultValue}): ` : `${prompt}: `;
  
  return new Promise((resolve) => {
    rl.question(displayPrompt, (answer) => {
      const trimmed = answer.trim();
      resolve(trimmed || defaultValue);
    });
  });
}

function displayFormatOptions() {
  console.log('\n📄 Available Export Formats:');
  Object.entries(EXPORT_FORMATS).forEach(([key, format]) => {
    console.log(`  ${key}: ${format.name} - ${format.description}`);
  });
  console.log('');
}

export async function runCLI() {
  const rl = createInterface();
  
  try {
    console.log('📝 Cover Letter Generator\n');
    
    const fullName = await question(rl, 'Full Name', DEFAULTS.fullName);
    const phone = await question(rl, 'Phone Number', DEFAULTS.phone);
    const email = await question(rl, 'Email Address', DEFAULTS.email);
    
    // Validate email
    if (!isEmailLike(email)) {
      console.log('⚠️  Warning: Invalid email format. Using default email.');
    }
    
    const company = await question(rl, 'Company Name');
    const contactName = await question(rl, 'Contact Name');
    const platform = await question(rl, 'Platform (e.g., LinkedIn, Indeed)');
    const dateDisplay = await question(rl, 'Date', DEFAULTS.dateDisplay);
    
    // Display format options and get user choice
    displayFormatOptions();
    const format = await question(rl, 'Export Format (md/txt/email)', DEFAULTS.format);
    
    // Validate format
    const validFormat = EXPORT_FORMATS[format] ? format : DEFAULTS.format;
    if (format !== validFormat) {
      console.log(`⚠️  Warning: Invalid format. Using ${validFormat} format.`);
    }
    
    const suggestedFilename = suggestFilename(company, validFormat);
    const filename = await question(rl, 'Output Filename', suggestedFilename);
    
    return {
      fullName,
      phone,
      email: isEmailLike(email) ? email : DEFAULTS.email,
      company,
      contactName,
      platform,
      dateDisplay,
      format: validFormat,
      filename
    };
  } finally {
    rl.close();
  }
} 