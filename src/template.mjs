import { getConfig } from './config.mjs';
import { nonEmptyOr, sanitizeCompanyName, sanitizeContactName } from './validators.mjs';
import { validateInput } from './errors.mjs';

async function buildTemplateData(answers) {
  const config = await getConfig();
  const defaults = config.defaults;
  const placeholders = config.placeholders;

  const fullName = validateInput(answers.fullName || defaults.fullName, 'required', 'fullName');
  const phone = validateInput(answers.phone || defaults.phone, 'phone', 'phone');
  const email = validateInput(answers.email || defaults.email, 'email', 'email');
  const format = validateInput(answers.format || defaults.format, 'format', 'format');
  
  const company = sanitizeCompanyName(answers.company);
  const contactName = sanitizeContactName(answers.contactName);
  const platform = optionalString(answers.platform);
  const dateDisplay = answers.dateDisplay || defaults.dateDisplay;

  return {
    fullName,
    phone,
    email,
    company: nonEmptyOr(company, placeholders.company),
    contactName: nonEmptyOr(contactName, placeholders.contactName),
    platform: nonEmptyOr(platform, placeholders.platform),
    dateDisplay: nonEmptyOr(dateDisplay, placeholders.date),
    format
  };
}

function optionalString(value) {
  return value && typeof value === 'string' ? value.trim() : '';
}

const TEMPLATE_CONTENT = {
  markdown: {
    header: (data) => `# Cover Letter\n\n**${data.fullName}**  \n${data.phone}  \n${data.email}\n\n---\n\n${data.dateDisplay}\n\n${data.contactName}  \n${data.company}\n\nDear ${data.contactName},\n\n`,
    body: (data) => `I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nI am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.\n\n`,
    footer: (data) => `**Kind regards,**\n\n${data.fullName}`
  },
  plainText: {
    header: (data) => `COVER LETTER\n\n${data.fullName}\n${data.phone}\n${data.email}\n\n${data.dateDisplay}\n\n${data.contactName}\n${data.company}\n\nDear ${data.contactName},\n\n`,
    body: (data) => `I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nI am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.\n\n`,
    footer: (data) => `Kind regards,\n\n${data.fullName}`
  },
  email: {
    header: (data) => `Subject: Application for Position - ${data.company}\n\nDear ${data.contactName},\n\n`,
    body: (data) => `I am writing to express my interest in the position you have advertised on ${data.platform}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nI am particularly drawn to ${data.company} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.\n\n`,
    footer: (data) => `Best regards,\n${data.fullName}\n\n---\n${data.fullName}\n${data.phone}\n${data.email}`
  }
};

function buildLetterContent(data, format) {
  const template = TEMPLATE_CONTENT[format] || TEMPLATE_CONTENT.markdown;
  
  return template.header(data) + template.body(data) + template.footer(data);
}

async function buildMarkdownLetter(answers) {
  const data = await buildTemplateData(answers);
  return buildLetterContent(data, 'markdown');
}

async function buildPlainTextLetter(answers) {
  const data = await buildTemplateData(answers);
  return buildLetterContent(data, 'plainText');
}

async function buildEmailLetter(answers) {
  const data = await buildTemplateData(answers);
  return buildLetterContent(data, 'email');
}

export async function buildLetter(answers) {
  const data = await buildTemplateData(answers);
  
  switch (data.format) {
    case 'txt':
      return buildLetterContent(data, 'plainText');
    case 'email':
      return buildLetterContent(data, 'email');
    case 'md':
    default:
      return buildLetterContent(data, 'markdown');
  }
}

export { buildMarkdownLetter, buildPlainTextLetter, buildEmailLetter }; 