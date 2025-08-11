import { describe, it, expect } from 'vitest';
import {
  nonEmptyOr,
  optionalString,
  isEmailLike,
  isValidPhoneNumber,
  sanitizeCompanyName,
  sanitizeContactName,
  validateFormat
} from '../src/validators.mjs';

describe('Validators', () => {
  describe('nonEmptyOr', () => {
    it('should return value if not empty', () => {
      expect(nonEmptyOr('test', 'fallback')).toBe('test');
      expect(nonEmptyOr(' test ', 'fallback')).toBe('test');
    });

    it('should return fallback if empty', () => {
      expect(nonEmptyOr('', 'fallback')).toBe('fallback');
      expect(nonEmptyOr('   ', 'fallback')).toBe('fallback');
      expect(nonEmptyOr(null, 'fallback')).toBe('fallback');
      expect(nonEmptyOr(undefined, 'fallback')).toBe('fallback');
    });
  });

  describe('optionalString', () => {
    it('should return trimmed string if valid', () => {
      expect(optionalString('test')).toBe('test');
      expect(optionalString(' test ')).toBe('test');
    });

    it('should return empty string if invalid', () => {
      expect(optionalString('')).toBe('');
      expect(optionalString(null)).toBe('');
      expect(optionalString(undefined)).toBe('');
      expect(optionalString(123)).toBe('');
    });
  });

  describe('isEmailLike', () => {
    it('should validate correct email formats', () => {
      expect(isEmailLike('test@example.com')).toBe(true);
      expect(isEmailLike('user.name@domain.co.uk')).toBe(true);
      expect(isEmailLike('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isEmailLike('invalid-email')).toBe(false);
      expect(isEmailLike('test@')).toBe(false);
      expect(isEmailLike('@example.com')).toBe(false);
      expect(isEmailLike('')).toBe(false);
      expect(isEmailLike(null)).toBe(false);
      expect(isEmailLike(undefined)).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('+90 0542 353 73 35')).toBe(true);
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('+1-555-123-4567')).toBe(true);
      expect(isValidPhoneNumber('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false); // Too short
      expect(isValidPhoneNumber('12345678901234567890')).toBe(false); // Too long
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber(null)).toBe(false);
      expect(isValidPhoneNumber(undefined)).toBe(false);
    });
  });

  describe('sanitizeCompanyName', () => {
    it('should sanitize company names correctly', () => {
      expect(sanitizeCompanyName('TechCorp Inc')).toBe('TechCorp Inc');
      expect(sanitizeCompanyName('Company & Sons')).toBe('Company & Sons');
      expect(sanitizeCompanyName('Test@Company')).toBe('TestCompany');
      expect(sanitizeCompanyName('  Test Company  ')).toBe('Test Company');
    });

    it('should handle edge cases', () => {
      expect(sanitizeCompanyName('')).toBe('');
      expect(sanitizeCompanyName(null)).toBe('');
      expect(sanitizeCompanyName(undefined)).toBe('');
    });

    it('should limit length', () => {
      const longName = 'A'.repeat(150);
      expect(sanitizeCompanyName(longName).length).toBeLessThanOrEqual(100);
    });
  });

  describe('sanitizeContactName', () => {
    it('should sanitize contact names correctly', () => {
      expect(sanitizeContactName('John Smith')).toBe('John Smith');
      expect(sanitizeContactName('Dr. Jane Doe')).toBe('Dr. Jane Doe');
      expect(sanitizeContactName('Test@Name')).toBe('TestName');
      expect(sanitizeContactName('  Test Name  ')).toBe('Test Name');
    });

    it('should handle edge cases', () => {
      expect(sanitizeContactName('')).toBe('');
      expect(sanitizeContactName(null)).toBe('');
      expect(sanitizeContactName(undefined)).toBe('');
    });

    it('should limit length', () => {
      const longName = 'A'.repeat(100);
      expect(sanitizeContactName(longName).length).toBeLessThanOrEqual(50);
    });
  });

  describe('validateFormat', () => {
    it('should validate correct formats', () => {
      expect(validateFormat('md')).toBe(true);
      expect(validateFormat('txt')).toBe(true);
      expect(validateFormat('email')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateFormat('pdf')).toBe(false);
      expect(validateFormat('doc')).toBe(false);
      expect(validateFormat('')).toBe(false);
      expect(validateFormat(null)).toBe(false);
      expect(validateFormat(undefined)).toBe(false);
    });
  });
}); 