# Cover Letter CLI

A modular Node.js CLI tool for generating professional cover letters with enhanced validation, configuration management, and error handling.

## ✨ Features

- 📝 Interactive command-line interface
- 🎯 Smart defaults and placeholders
- ✅ Comprehensive input validation with sanitization
- 📁 Automatic filename generation with Unicode-safe naming
- 🌍 Multiple export formats (Markdown, Plain Text, Email)
- ⚙️ Configuration management with file and environment variable support
- 🛡️ Robust error handling with user-friendly messages
- 🧪 Comprehensive test suite
- 📊 Performance optimizations

## 🚀 Installation

### Global Installation
```bash
npm install -g .
```

### Local Development
```bash
npm install
```

## 📖 Usage

### Basic Usage
```bash
cover-letter
```

### Interactive Prompts

The CLI will prompt you for the following information:

| Field | Default | Validation |
|-------|---------|------------|
| Full Name | Configurable | Required, trimmed |
| Phone Number | Configurable | 7-15 digits, international format |
| Email Address | Configurable | Email format validation |
| Company Name | - | Sanitized, max 100 chars |
| Contact Name | - | Sanitized, max 50 chars |
| Platform | - | Trimmed |
| Date | Today's date | Configurable format |
| Export Format | md | md/txt/email |
| Output Filename | Auto-generated | Safe filename |

### Export Formats

- **Markdown (md)**: Rich formatting with headers and bold text
- **Plain Text (txt)**: Simple text format for basic editors
- **Email Format (email)**: Optimized for email clients with subject line and signature

## ⚙️ Configuration

### Configuration Files

The application supports multiple configuration sources:

1. **Local config**: `cover-letter.config.json` in current directory
2. **Hidden config**: `.cover-letter.json` in current directory
3. **Global config**: `~/.cover-letter.json` in user home directory

### Example Configuration

```json
{
  "defaults": {
    "fullName": "Your Name",
    "phone": "+1 555 123 4567",
    "email": "your.email@example.com",
    "format": "md"
  },
  "placeholders": {
    "company": "[Company Name]",
    "contactName": "[Hiring Manager Name]",
    "platform": "[Job Platform]",
    "date": "[Date]"
  },
  "validation": {
    "maxCompanyNameLength": 100,
    "maxContactNameLength": 50,
    "maxFilenameLength": 60,
    "minPhoneDigits": 7,
    "maxPhoneDigits": 15
  }
}
```

### Environment Variables

You can also configure defaults using environment variables:

```bash
export COVER_LETTER_NAME="Your Name"
export COVER_LETTER_PHONE="+1 555 123 4567"
export COVER_LETTER_EMAIL="your.email@example.com"
export COVER_LETTER_FORMAT="md"
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Test Format Generation
```bash
npm run test:format
```

## 🏗️ Project Structure

```
cover-letter-cli/
├── package.json                 # Project configuration
├── cover-letter.config.example.json  # Example configuration
├── bin/
│   └── cover-letter.mjs        # CLI entry point
├── src/
│   ├── config.mjs              # Configuration management
│   ├── constants.mjs           # Legacy constants (deprecated)
│   ├── errors.mjs              # Error handling and validation
│   ├── format.mjs              # Date and file formatting utilities
│   ├── validators.mjs          # Input validation functions
│   ├── file.mjs                # File operations and naming
│   ├── template.mjs            # Cover letter template builder
│   └── cli.mjs                 # Interactive CLI interface
├── tests/
│   ├── validators.test.mjs     # Validator unit tests
│   └── template.test.mjs       # Template generation tests
└── test-formats.mjs            # Format testing script
```

## 📚 Module Documentation

### `src/config.mjs`
Configuration management with support for:
- File-based configuration (JSON)
- Environment variables
- Default fallbacks
- Caching for performance

### `src/errors.mjs`
Comprehensive error handling:
- Custom error classes
- User-friendly error messages
- Context-aware error handling
- Input validation utilities

### `src/validators.mjs`
Input validation and sanitization:
- Email validation
- Phone number validation
- String sanitization
- Format validation

### `src/template.mjs`
Template generation with:
- Shared template data builder
- Multiple format support
- Input validation integration
- Backward compatibility

### `src/cli.mjs`
Interactive interface with:
- Enhanced input validation
- Configuration integration
- Error handling
- User feedback

### `src/file.mjs`
File operations with:
- Safe file writing
- Directory creation
- Error handling
- Configuration integration

## 🔧 Development

### Running Locally
```bash
node bin/cover-letter.mjs
```

### Making Executable
```bash
chmod +x bin/cover-letter.mjs
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 🚨 Error Handling

The application provides comprehensive error handling:

- **Validation Errors**: User-friendly messages with field-specific guidance
- **File System Errors**: Permission and disk space error detection
- **Configuration Errors**: Clear feedback on config file issues
- **Graceful Degradation**: Fallbacks for missing or invalid data

## 📊 Performance Improvements

- **Lazy Loading**: Configuration loaded only when needed
- **Caching**: Configuration cached after first load
- **Efficient File Operations**: Optimized directory creation and file writing
- **Memory Management**: Proper cleanup of resources

## 🔒 Security Features

- **Input Sanitization**: Prevents XSS and injection attacks
- **File Path Validation**: Safe filename generation
- **Error Information Control**: Debug info only in development mode

## 📈 Code Quality

- **Test Coverage**: Comprehensive unit tests
- **Error Boundaries**: Graceful error handling throughout
- **Type Safety**: Proper validation and sanitization
- **Modular Design**: Clean separation of concerns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see package.json for details.

## 👨‍💻 Author

Görkem Özkan - developer@ozgorkem.com 