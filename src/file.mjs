import { promises as fs } from 'fs';
import { dirname } from 'path';
import { safeFilePart, todayISO } from './format.mjs';
import { getConfig } from './config.mjs';
import { FileSystemError } from './errors.mjs';

export async function suggestFilename(company, format = 'md') {
  const config = await getConfig();
  const exportFormats = config.exportFormats;
  const validation = config.validation;
  
  const safeCompany = safeFilePart(company || 'unknown', validation.maxFilenameLength);
  const date = todayISO();
  const extension = exportFormats[format]?.extension || '.md';
  return `cover-letter_${safeCompany}_${date}${extension}`;
}

export async function ensureDirAndWrite(filepath, content) {
  try {
    const dir = dirname(filepath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filepath, content, 'utf8');
  } catch (error) {
    throw new FileSystemError(
      `Failed to write file: ${error.message}`,
      filepath
    );
  }
}

export async function checkFileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

export async function readFileSafely(filepath) {
  try {
    return await fs.readFile(filepath, 'utf8');
  } catch (error) {
    throw new FileSystemError(
      `Failed to read file: ${error.message}`,
      filepath
    );
  }
} 