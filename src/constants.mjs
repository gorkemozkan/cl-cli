export const DEFAULTS = {
  fullName: 'Görkem Özkan',
  phone: '+90 0542 353 73 35',
  email: 'developer@ozgorkem.com',
  dateDisplay: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  format: 'md'
};

export const PLACEHOLDERS = {
  company: '[Company Name]',
  contactName: '[Name of the person concerned / Human Resources Officer]',
  platform: '[Platform]',
  date: '[Date]'
};

export const EXPORT_FORMATS = {
  md: {
    extension: '.md',
    name: 'Markdown',
    description: 'Markdown format with headers and formatting'
  },
  txt: {
    extension: '.txt',
    name: 'Plain Text',
    description: 'Plain text format for simple text editors'
  },
  email: {
    extension: '.txt',
    name: 'Email Format',
    description: 'Plain text optimized for email clients'
  }
}; 