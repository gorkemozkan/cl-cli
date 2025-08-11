import readline from 'readline';
import { getConfig } from './config.mjs';
import { isEmailLike, isValidPhoneNumber, sanitizeCompanyName, sanitizeContactName } from './validators.mjs';
import { suggestFilename } from './file.mjs';
import { displayError, ValidationError } from './errors.mjs';

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

async function displayFormatOptions() {
  const config = await getConfig();
  const exportFormats = config.exportFormats;
  
  console.log('\n📄 Available Export Formats:');
  Object.entries(exportFormats).forEach(([key, format]) => {
    console.log(`  ${key}: ${format.name} - ${format.description}`);
  });
  console.log('');
}

async function validateAndSanitizeInput(value, type, field, defaultValue = '') {
  const trimmed = value.trim();
  const finalValue = trimmed || defaultValue;
  
  try {
    switch (type) {
      case 'email':
        if (finalValue && !isEmailLike(finalValue)) {
          console.log('⚠️  Warning: Invalid email format. Using default email.');
          return defaultValue;
        }
        return finalValue;
        
      case 'phone':
        if (finalValue && !isValidPhoneNumber(finalValue)) {
          console.log('⚠️  Warning: Invalid phone number format. Using default phone.');
          return defaultValue;
        }
        return finalValue;
        
      case 'company':
        return sanitizeCompanyName(finalValue);
        
      case 'contact':
        return sanitizeContactName(finalValue);
        
      case 'format':
        const validFormats = ['md', 'txt', 'email'];
        if (finalValue && !validFormats.includes(finalValue)) {
          console.log(`⚠️  Warning: Invalid format. Using ${defaultValue} format.`);
          return defaultValue;
        }
        return finalValue;
        
      default:
        return finalValue;
    }
  } catch (error) {
    console.log(`⚠️  Warning: Error processing ${field}. Using default value.`);
    return defaultValue;
  }
}

export async function runCLI() {
  const rl = createInterface();
  
  try {
    console.log('📝 Cover Letter Generator\n');
    
    // Load configuration
    const config = await getConfig();
    const defaults = config.defaults;
    
    // Get user inputs with validation
    const fullName = await question(rl, 'Full Name', defaults.fullName);
    const phone = await question(rl, 'Phone Number', defaults.phone);
    const email = await question(rl, 'Email Address', defaults.email);
    const company = await question(rl, 'Company Name');
    const contactName = await question(rl, 'Contact Name');
    const platform = await question(rl, 'Platform (e.g., LinkedIn, Indeed)');
    const dateDisplay = await question(rl, 'Date', defaults.dateDisplay);
    
    // Display format options and get user choice
    await displayFormatOptions();
    const format = await question(rl, 'Export Format (md/txt/email)', defaults.format);
    
    // Validate and sanitize all inputs
    const validatedData = {
      fullName: await validateAndSanitizeInput(fullName, 'text', 'fullName', defaults.fullName),
      phone: await validateAndSanitizeInput(phone, 'phone', 'phone', defaults.phone),
      email: await validateAndSanitizeInput(email, 'email', 'email', defaults.email),
      company: await validateAndSanitizeInput(company, 'company', 'company'),
      contactName: await validateAndSanitizeInput(contactName, 'contact', 'contactName'),
      platform: await validateAndSanitizeInput(platform, 'text', 'platform'),
      dateDisplay: await validateAndSanitizeInput(dateDisplay, 'text', 'dateDisplay', defaults.dateDisplay),
      format: await validateAndSanitizeInput(format, 'format', 'format', defaults.format)
    };
    
    // Generate filename
    const suggestedFilename = suggestFilename(validatedData.company, validatedData.format);
    const filename = await question(rl, 'Output Filename', suggestedFilename);
    
    return {
      ...validatedData,
      filename: filename.trim() || suggestedFilename
    };
  } catch (error) {
    const errorInfo = displayError(error, { context: 'CLI Input' });
    if (errorInfo.shouldExit) {
      process.exit(errorInfo.exitCode);
    }
    throw error;
  } finally {
    rl.close();
  }
} 