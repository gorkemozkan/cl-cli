export class CoverLetterError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'CoverLetterError';
    this.code = code;
  }
}

export class ValidationError extends CoverLetterError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class FileSystemError extends CoverLetterError {
  constructor(message, filepath) {
    super(message, 'FILE_SYSTEM_ERROR');
    this.name = 'FileSystemError';
    this.filepath = filepath;
  }
}

export class ConfigurationError extends CoverLetterError {
  constructor(message, configPath) {
    super(message, 'CONFIGURATION_ERROR');
    this.name = 'ConfigurationError';
    this.configPath = configPath;
  }
}

export const ERROR_MESSAGES = {
  VALIDATION: {
    INVALID_EMAIL: 'Invalid email format. Please provide a valid email address.',
    INVALID_PHONE: 'Invalid phone number. Please provide a valid phone number.',
    EMPTY_COMPANY: 'Company name cannot be empty.',
    EMPTY_CONTACT: 'Contact name cannot be empty.',
    INVALID_FORMAT: 'Invalid export format. Please choose from: md, txt, email.'
  },
  FILE_SYSTEM: {
    WRITE_FAILED: 'Failed to write file. Please check permissions and disk space.',
    CREATE_DIR_FAILED: 'Failed to create directory. Please check permissions.',
    FILE_EXISTS: 'File already exists. Please choose a different filename.'
  },
  CONFIGURATION: {
    INVALID_CONFIG: 'Invalid configuration file format.',
    MISSING_CONFIG: 'Configuration file not found.',
    PARSE_ERROR: 'Failed to parse configuration file.'
  },
  CLI: {
    INTERRUPTED: 'Operation cancelled by user.',
    INVALID_INPUT: 'Invalid input provided.'
  }
};

export function handleError(error, context = {}) {
  let userMessage = 'An unexpected error occurred.';
  let shouldExit = true;
  let exitCode = 1;

  switch (error.code) {
    case 'VALIDATION_ERROR':
      userMessage = error.message;
      shouldExit = false;
      break;
      
    case 'FILE_SYSTEM_ERROR':
      if (error.message.includes('EACCES')) {
        userMessage = 'Permission denied. Please check file permissions.';
      } else if (error.message.includes('ENOSPC')) {
        userMessage = 'No disk space available. Please free up some space.';
      } else {
        userMessage = ERROR_MESSAGES.FILE_SYSTEM.WRITE_FAILED;
      }
      break;
      
    case 'CONFIGURATION_ERROR':
      userMessage = `Configuration error: ${error.message}`;
      shouldExit = false;
      break;
      
    case 'CLI_INTERRUPTED':
      userMessage = 'Operation cancelled.';
      exitCode = 0;
      break;
      
    default:
      if (error.message) {
        userMessage = error.message;
      }
      break;
  }

  if (context.filepath) {
    userMessage += `\nFile: ${context.filepath}`;
  }
  if (context.field) {
    userMessage += `\nField: ${context.field}`;
  }

  return {
    message: userMessage,
    shouldExit,
    exitCode,
    originalError: error
  };
}

export function displayError(error, context = {}) {
  const errorInfo = handleError(error, context);
  
  console.error(`Error: ${errorInfo.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('\nDebug information:');
    console.error(`Error: ${error.name}: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  }
  
  return errorInfo;
}

export function validateInput(value, type, field) {
  switch (type) {
    case 'email':
      if (!value || typeof value !== 'string') {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, field);
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, field);
      }
      break;
      
    case 'phone':
      if (!value || typeof value !== 'string') {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PHONE, field);
      }
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PHONE, field);
      }
      break;
      
    case 'required':
      if (!value || !value.trim()) {
        throw new ValidationError(`Field '${field}' is required.`, field);
      }
      break;
      
    case 'format':
      const validFormats = ['md', 'txt', 'email'];
      if (!validFormats.includes(value)) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_FORMAT, field);
      }
      break;
  }
  
  return value.trim();
} 