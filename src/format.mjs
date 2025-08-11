export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function safeFilePart(text, maxLength = 60) {
  if (!text) return '';
  
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[-.]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .substring(0, maxLength);
} 