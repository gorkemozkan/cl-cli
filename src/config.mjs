import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// Default configuration
const DEFAULT_CONFIG = {
  defaults: {
    fullName: 'Görkem Özkan',
    phone: '+90 0542 353 73 35',
    email: 'developer@ozgorkem.com',
    format: 'md'
  },
  placeholders: {
    company: '[Company Name]',
    contactName: '[Name of the person concerned / Human Resources Officer]',
    platform: '[Platform]',
    date: '[Date]'
  },
  exportFormats: {
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
  },
  validation: {
    maxCompanyNameLength: 100,
    maxContactNameLength: 50,
    maxFilenameLength: 60,
    minPhoneDigits: 7,
    maxPhoneDigits: 15
  }
};

// Load configuration from file if it exists
async function loadConfigFile() {
  const configPaths = [
    join(process.cwd(), 'cover-letter.config.json'),
    join(process.cwd(), '.cover-letter.json'),
    join(process.env.HOME || process.env.USERPROFILE || '', '.cover-letter.json')
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const configContent = await readFile(configPath, 'utf8');
        return JSON.parse(configContent);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not load config from ${configPath}: ${error.message}`);
      }
    }
  }
  
  return {};
}

// Merge environment variables with config
function mergeEnvVars(config) {
  const envConfig = {};
  
  if (process.env.COVER_LETTER_NAME) {
    envConfig.defaults = { ...envConfig.defaults, fullName: process.env.COVER_LETTER_NAME };
  }
  if (process.env.COVER_LETTER_PHONE) {
    envConfig.defaults = { ...envConfig.defaults, phone: process.env.COVER_LETTER_PHONE };
  }
  if (process.env.COVER_LETTER_EMAIL) {
    envConfig.defaults = { ...envConfig.defaults, email: process.env.COVER_LETTER_EMAIL };
  }
  if (process.env.COVER_LETTER_FORMAT) {
    envConfig.defaults = { ...envConfig.defaults, format: process.env.COVER_LETTER_FORMAT };
  }
  
  return envConfig;
}

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Load and merge configuration
let cachedConfig = null;

export async function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }
  
  const fileConfig = await loadConfigFile();
  const envConfig = mergeEnvVars(fileConfig);
  
  cachedConfig = deepMerge(DEFAULT_CONFIG, deepMerge(fileConfig, envConfig));
  
  // Add computed properties
  cachedConfig.defaults.get dateDisplay() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return cachedConfig;
}

// Export individual config sections for backward compatibility
export async function getDefaults() {
  const config = await getConfig();
  return config.defaults;
}

export async function getPlaceholders() {
  const config = await getConfig();
  return config.placeholders;
}

export async function getExportFormats() {
  const config = await getConfig();
  return config.exportFormats;
}

export async function getValidationRules() {
  const config = await getConfig();
  return config.validation;
} 