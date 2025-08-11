export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function safeFilePart(text, maxLength = 60) {
  if (!text) return '';
  
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s.-]/g, '') // Keep only letters, numbers, spaces, dots, underscores, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[-.]+/g, '-') // Replace multiple dots/hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase()
    .substring(0, maxLength);
} 