import { promises as fs } from 'fs';
import { dirname } from 'path';
import { safeFilePart, todayISO } from './format.mjs';
import { EXPORT_FORMATS } from './constants.mjs';

export function suggestFilename(company, format = 'md') {
  const safeCompany = safeFilePart(company || 'unknown');
  const date = todayISO();
  const extension = EXPORT_FORMATS[format]?.extension || '.md';
  return `cover-letter_${safeCompany}_${date}${extension}`;
}

export async function ensureDirAndWrite(filepath, content) {
  const dir = dirname(filepath);
  
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  await fs.writeFile(filepath, content, 'utf8');
} 