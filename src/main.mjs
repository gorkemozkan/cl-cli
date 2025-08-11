#!/usr/bin/env node

import readline from 'readline';
import { promises as fs } from 'fs';
import { dirname } from 'path';

// Simple defaults
const DEFAULTS = {
  fullName: 'Görkem Özkan',
  phone: '+90 0542 353 73 35',
  email: 'developer@ozgorkem.com',
  format: 'md'
};

const PLACEHOLDERS = {
  company: '[Company Name]',
  contactName: '[Name of the person concerned / Human Resources Officer]',
  platform: '[Platform]',
  date: '[Date]'
};

// Simple validation functions
function isValidEmail(email) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function sanitizeText(text, maxLength = 100) {
  if (!text) return '';
  return text.trim().replace(/[^\w\s&.-]/g, '').replace(/\s+/g, ' ').substring(0, maxLength);
}

function safeFilename(text) {
  if (!text) return 'unknown';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[-.]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .substring(0, 60);
}

// Template content
const TEMPLATES = {
  markdown: (data) => `# Cover Letter

**${data.fullName}**  
${data.phone}  
${data.email}

---

${data.dateDisplay}

${data.contactName}  
${data.company}

Dear ${data.contactName},

I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

**Kind regards,**

${data.fullName}`,

  plainText: (data) => `COVER LETTER

${data.fullName}
${data.phone}
${data.email}

${data.dateDisplay}

${data.contactName}
${data.company}

Dear ${data.contactName},

I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

Kind regards,

${data.fullName}`,

  email: (data) => `Subject: Application for Position - ${data.company}

Dear ${data.contactName},

I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

Best regards,
${data.fullName}

---
${data.fullName}
${data.phone}
${data.email}`
};

// CLI functions
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
      resolve(answer.trim() || defaultValue);
    });
  });
}

// Main CLI function
async function runCLI() {
  const rl = createInterface();
  
  try {
    console.log('Cover Letter Generator\n');
    
    const fullName = await question(rl, 'Full Name', DEFAULTS.fullName);
    const phone = await question(rl, 'Phone Number', DEFAULTS.phone);
    const email = await question(rl, 'Email Address', DEFAULTS.email);
    const company = await question(rl, 'Company Name');
    const contactName = await question(rl, 'Contact Name');
    const platform = await question(rl, 'Platform (e.g., LinkedIn, Indeed)');
    const dateDisplay = await question(rl, 'Date', new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    
    console.log('\nAvailable formats: md (Markdown), txt (Plain Text), email');
    const format = await question(rl, 'Export Format', DEFAULTS.format);
    
    // Validate and sanitize data
    const data = {
      fullName: fullName || DEFAULTS.fullName,
      phone: phone || DEFAULTS.phone,
      email: email || DEFAULTS.email,
      company: company ? sanitizeText(company) : PLACEHOLDERS.company,
      contactName: contactName ? sanitizeText(contactName, 50) : PLACEHOLDERS.contactName,
      platform: platform ? sanitizeText(platform) : PLACEHOLDERS.platform,
      dateDisplay: dateDisplay || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      format: ['md', 'txt', 'email'].includes(format) ? format : 'md'
    };
    
    // Validate email and phone
    if (!isValidEmail(data.email)) {
      console.log('Warning: Invalid email format. Using default email.');
      data.email = DEFAULTS.email;
    }
    
    if (!isValidPhone(data.phone)) {
      console.log('Warning: Invalid phone number. Using default phone.');
      data.phone = DEFAULTS.phone;
    }
    
    // Suggest filename
    const date = new Date().toISOString().split('T')[0];
    const safeCompany = safeFilename(data.company);
    const extension = data.format === 'md' ? '.md' : '.txt';
    const suggestedFilename = `cover-letter_${safeCompany}_${date}${extension}`;
    
    const filename = await question(rl, 'Output Filename', suggestedFilename);
    
    return { ...data, filename: filename || suggestedFilename };
  } finally {
    rl.close();
  }
}

// File operations
async function writeFile(filepath, content) {
  try {
    const dir = dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filepath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting Cover Letter Generator...\n');
    
    const data = await runCLI();
    
    console.log('Generating cover letter...');
    const template = TEMPLATES[data.format] || TEMPLATES.markdown;
    const letter = template(data);
    
    console.log('Saving file...');
    await writeFile(data.filename, letter);
    
    console.log(`\nCover letter saved to: ${data.filename}`);
    console.log(`Format: ${data.format.toUpperCase()}`);
    console.log(`File size: ${(letter.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Handle interrupts
process.on('SIGINT', () => {
  console.log('\n\nOperation cancelled by user.');
  process.exit(0);
});

main(); 