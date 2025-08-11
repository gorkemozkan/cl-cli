# Cover Letter CLI

A modular Node.js CLI tool for generating professional cover letters in markdown format.

## Features

- 📝 Interactive command-line interface
- 🎯 Smart defaults and placeholders
- ✅ Input validation with fallbacks
- 📁 Automatic filename generation
- 🌍 Unicode-safe file naming
- 📄 Markdown output format

## Installation

### Global Installation
```bash
npm install -g .
```

### Local Development
```bash
npm install
```

## Usage

### Run the CLI
```bash
cover-letter
```

### Interactive Prompts

The CLI will prompt you for the following information:

| Field | Default | Description |
|-------|---------|-------------|
| Full Name | Görkem Özkan | Your full name |
| Phone Number | +90 0542 353 73 35 | Your contact number |
| Email Address | developer@ozgorkem.com | Your email (validated) |
| Company Name | - | Target company name |
| Contact Name | - | Hiring manager/HR contact |
| Platform | - | Job platform (LinkedIn, Indeed, etc.) |
| Date | Today's date | Letter date |
| Export Format | md | Output format (md/txt/email) |
| Output Filename | Auto-generated | Output file name |

### Export Formats

The CLI supports three export formats:

- **Markdown (md)**: Rich formatting with headers and bold text
- **Plain Text (txt)**: Simple text format for basic editors
- **Email Format (email)**: Optimized for email clients with subject line and signature

### Smart Features

- **Email Validation**: Invalid emails trigger a warning and fall back to default
- **Placeholder Fallbacks**: Empty fields use meaningful placeholders:
  - Company: `[Company Name]`
  - Contact: `[Name of the person concerned / Human Resources Officer]`
  - Platform: `[Platform]`
  - Date: `[Date]`
- **Auto-filename**: Generates `cover-letter_<company>_<YYYY-MM-DD>.<extension>`
- **Safe Naming**: Unicode-safe, 60-character limit, special character handling
- **Multiple Formats**: Support for .md, .txt, and email-optimized formats

## Project Structure

```
cover-letter-cli/
├── package.json          # ESM configuration and metadata
├── bin/
│   └── cover-letter.mjs  # CLI entry point
└── src/
    ├── constants.mjs     # Defaults and placeholders
    ├── format.mjs        # Date and file formatting utilities
    ├── validators.mjs    # Input validation functions
    ├── file.mjs          # File operations and naming
    ├── template.mjs      # Cover letter template builder
    └── cli.mjs           # Interactive CLI interface
```

## Module Documentation

### `bin/cover-letter.mjs`
Tiny orchestrator that coordinates the CLI flow:
- Runs interactive prompts
- Builds the cover letter
- Handles file writing
- Error handling and exit codes

### `src/constants.mjs`
Centralized configuration:
- `DEFAULTS`: Default values for all fields
- `PLACEHOLDERS`: Fallback text for empty inputs

### `src/format.mjs`
Utility functions:
- `todayISO()`: Returns current date in YYYY-MM-DD format
- `safeFilePart(text, maxLength)`: Creates safe filenames from text

### `src/validators.mjs`
Input validation utilities:
- `nonEmptyOr(value, fallback)`: Returns value or fallback
- `optionalString(value)`: Safely extracts string values
- `isEmailLike(email)`: Validates email format

### `src/file.mjs`
File system operations:
- `suggestFilename(company)`: Generates filename with company and date
- `ensureDirAndWrite(filepath, content)`: Creates directories and writes files

### `src/template.mjs`
Cover letter generation:
- `buildLetter(answers)`: Creates cover letter in selected format from user inputs
- Supports markdown, plain text, and email formats
- Handles all placeholder substitutions
- Maintains consistent formatting across formats

### `src/cli.mjs`
Interactive interface:
- `runCLI()`: Main CLI function with readline prompts
- Format selection with validation
- Input validation and user feedback
- Graceful error handling

## Output Format

The generated cover letter follows this markdown structure:

```markdown
# Cover Letter

**Your Name**  
Phone Number  
Email Address

---

Date

Contact Name  
Company Name

Dear Contact Name,

[Cover letter content...]

**Kind regards,**

Your Name
```

## Requirements

- Node.js >= 18
- ESM modules support

## Development

### Running Locally
```bash
node bin/cover-letter.mjs
```

### Making Executable
```bash
chmod +x bin/cover-letter.mjs
```

## License

MIT License - see package.json for details.

## Author

Görkem Özkan - developer@ozgorkem.com 