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