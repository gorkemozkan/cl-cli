import { DEFAULTS, PLACEHOLDERS } from './constants.mjs';
import { nonEmptyOr } from './validators.mjs';

function buildMarkdownLetter(answers) {
  const {
    fullName = DEFAULTS.fullName,
    phone = DEFAULTS.phone,
    email = DEFAULTS.email,
    company,
    contactName,
    platform,
    dateDisplay = DEFAULTS.dateDisplay
  } = answers;

  const companyName = nonEmptyOr(company, PLACEHOLDERS.company);
  const contact = nonEmptyOr(contactName, PLACEHOLDERS.contactName);
  const platformName = nonEmptyOr(platform, PLACEHOLDERS.platform);
  const date = nonEmptyOr(dateDisplay, PLACEHOLDERS.date);

  return `# Cover Letter

**${fullName}**  
${phone}  
${email}

---

${date}

${contact}  
${companyName}

Dear ${contact},

I am writing to express my interest in the position you have advertised on ${platformName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${companyName} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

**Kind regards,**

${fullName}`;
}

function buildPlainTextLetter(answers) {
  const {
    fullName = DEFAULTS.fullName,
    phone = DEFAULTS.phone,
    email = DEFAULTS.email,
    company,
    contactName,
    platform,
    dateDisplay = DEFAULTS.dateDisplay
  } = answers;

  const companyName = nonEmptyOr(company, PLACEHOLDERS.company);
  const contact = nonEmptyOr(contactName, PLACEHOLDERS.contactName);
  const platformName = nonEmptyOr(platform, PLACEHOLDERS.platform);
  const date = nonEmptyOr(dateDisplay, PLACEHOLDERS.date);

  return `COVER LETTER

${fullName}
${phone}
${email}

${date}

${contact}
${companyName}

Dear ${contact},

I am writing to express my interest in the position you have advertised on ${platformName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${companyName} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

Kind regards,

${fullName}`;
}

function buildEmailLetter(answers) {
  const {
    fullName = DEFAULTS.fullName,
    phone = DEFAULTS.phone,
    email = DEFAULTS.email,
    company,
    contactName,
    platform,
    dateDisplay = DEFAULTS.dateDisplay
  } = answers;

  const companyName = nonEmptyOr(company, PLACEHOLDERS.company);
  const contact = nonEmptyOr(contactName, PLACEHOLDERS.contactName);
  const platformName = nonEmptyOr(platform, PLACEHOLDERS.platform);
  const date = nonEmptyOr(dateDisplay, PLACEHOLDERS.date);

  return `Subject: Application for Position - ${companyName}

Dear ${contact},

I am writing to express my interest in the position you have advertised on ${platformName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

I am particularly drawn to ${companyName} because of its reputation for excellence and commitment to innovation. I believe my skills and experience align well with your company's values and the requirements of this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team. I am available for an interview at your convenience and look forward to hearing from you.

Best regards,
${fullName}

---
${fullName}
${phone}
${email}`;
}

export function buildLetter(answers) {
  const format = answers.format || DEFAULTS.format;
  
  switch (format) {
    case 'txt':
      return buildPlainTextLetter(answers);
    case 'email':
      return buildEmailLetter(answers);
    case 'md':
    default:
      return buildMarkdownLetter(answers);
  }
} 