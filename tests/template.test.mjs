import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildLetter, buildMarkdownLetter, buildPlainTextLetter, buildEmailLetter } from '../src/template.mjs';

vi.mock('../src/config.mjs', () => ({
  getConfig: vi.fn().mockResolvedValue({
    defaults: {
      fullName: 'Test User',
      phone: '+1 555 123 4567',
      email: 'test@example.com',
      get dateDisplay() {
        return 'January 1, 2024';
      },
      format: 'md'
    },
    placeholders: {
      company: '[Company Name]',
      contactName: '[Contact Name]',
      platform: '[Platform]',
      date: '[Date]'
    }
  })
}));

describe('Template Generation', () => {
  const sampleData = {
    fullName: 'John Doe',
    phone: '+1 555 123 4567',
    email: 'john.doe@example.com',
    company: 'TechCorp Inc',
    contactName: 'Jane Smith',
    platform: 'LinkedIn',
    dateDisplay: 'January 15, 2024',
    format: 'md'
  };

  describe('buildLetter', () => {
    it('should generate markdown format by default', async () => {
      const result = await buildLetter(sampleData);
      
      expect(result).toContain('# Cover Letter');
      expect(result).toContain('**John Doe**');
      expect(result).toContain('Dear Jane Smith');
      expect(result).toContain('TechCorp Inc');
      expect(result).toContain('LinkedIn');
    });

    it('should generate plain text format', async () => {
      const data = { ...sampleData, format: 'txt' };
      const result = await buildLetter(data);
      
      expect(result).toContain('COVER LETTER');
      expect(result).not.toContain('# Cover Letter');
      expect(result).toContain('John Doe');
      expect(result).toContain('Dear Jane Smith');
    });

    it('should generate email format', async () => {
      const data = { ...sampleData, format: 'email' };
      const result = await buildLetter(data);
      
      expect(result).toContain('Subject: Application for Position - TechCorp Inc');
      expect(result).toContain('Dear Jane Smith');
      expect(result).toContain('Best regards,');
      expect(result).toContain('---');
    });

    it('should use placeholders for missing data', async () => {
      const incompleteData = {
        fullName: 'John Doe',
        phone: '+1 555 123 4567',
        email: 'john.doe@example.com',
        format: 'md'
      };
      
      const result = await buildLetter(incompleteData);
      
      expect(result).toContain('[Company Name]');
      expect(result).toContain('[Contact Name]');
      expect(result).toContain('[Platform]');
    });

    it('should handle empty company name', async () => {
      const data = { ...sampleData, company: '' };
      const result = await buildLetter(data);
      
      expect(result).toContain('[Company Name]');
    });

    it('should handle empty contact name', async () => {
      const data = { ...sampleData, contactName: '' };
      const result = await buildLetter(data);
      
      expect(result).toContain('[Contact Name]');
    });
  });

  describe('buildMarkdownLetter', () => {
    it('should generate proper markdown format', async () => {
      const result = await buildMarkdownLetter(sampleData);
      
      expect(result).toContain('# Cover Letter');
      expect(result).toContain('**John Doe**');
      expect(result).toContain('---');
      expect(result).toContain('**Kind regards,**');
    });
  });

  describe('buildPlainTextLetter', () => {
    it('should generate proper plain text format', async () => {
      const result = await buildPlainTextLetter(sampleData);
      
      expect(result).toContain('COVER LETTER');
      expect(result).not.toContain('#');
      expect(result).not.toContain('**');
      expect(result).toContain('Kind regards,');
    });
  });

  describe('buildEmailLetter', () => {
    it('should generate proper email format', async () => {
      const result = await buildEmailLetter(sampleData);
      
      expect(result).toContain('Subject: Application for Position - TechCorp Inc');
      expect(result).toContain('Best regards,');
      expect(result).toContain('---');
      expect(result).toContain('John Doe');
      expect(result).toContain('+1 555 123 4567');
      expect(result).toContain('john.doe@example.com');
    });
  });

  describe('Input validation', () => {
    it('should validate required fields', async () => {
      const invalidData = {
        fullName: '',
        phone: 'invalid',
        email: 'invalid-email',
        format: 'invalid'
      };

      await expect(buildLetter(invalidData)).rejects.toThrow();
    });

    it('should sanitize company names', async () => {
      const data = { ...sampleData, company: 'Test@Company<script>' };
      const result = await buildLetter(data);
      
      expect(result).toContain('TestCompany');
      expect(result).not.toContain('Test@Company<script>');
      expect(result).not.toContain('<script>');
    });

    it('should sanitize contact names', async () => {
      const data = { ...sampleData, contactName: 'Test@Name<script>' };
      const result = await buildLetter(data);
      
      expect(result).toContain('TestName');
      expect(result).not.toContain('Test@Name<script>');
      expect(result).not.toContain('<script>');
    });
  });

  describe('Content structure', () => {
    it('should include all required sections', async () => {
      const result = await buildLetter(sampleData);
      
      expect(result).toContain('John Doe');
      expect(result).toContain('+1 555 123 4567');
      expect(result).toContain('john.doe@example.com');
      
      expect(result).toContain('January 15, 2024');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('TechCorp Inc');
      
      expect(result).toContain('I am writing to express my interest');
      expect(result).toContain('LinkedIn');
      
      expect(result).toContain('John Doe');
    });
  });
}); 