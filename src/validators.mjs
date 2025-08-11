export function nonEmptyOr(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

export function optionalString(value) {
  return value && typeof value === 'string' ? value.trim() : '';
}

export function isEmailLike(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function sanitizeCompanyName(company) {
  if (!company || typeof company !== 'string') return '';
  
  return company
    .trim()
    .replace(/[^\w\s&.-]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100);
}

export function sanitizeContactName(name) {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 50);
}

export function validateFormat(format) {
  const validFormats = ['md', 'txt', 'email'];
  return validFormats.includes(format);
} 