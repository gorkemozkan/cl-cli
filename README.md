# Cover Letter Generator

A simple CLI tool for generating cover letters in multiple formats.

## Features

- Generate cover letters in Markdown, Plain Text, or Email format
- Interactive CLI with sensible defaults
- Automatic filename generation
- Input validation and sanitization

## Installation

```bash
npm install
```

## Usage

Run the generator:

```bash
npm start
# or
node src/main.mjs
```

The tool will prompt you for:
- Full Name (defaults to your name)
- Phone Number (defaults to your phone)
- Email Address (defaults to your email)
- Company Name
- Contact Name
- Platform (e.g., LinkedIn, Indeed)
- Date
- Export Format (md/txt/email)
- Output Filename

## Output Formats

- **Markdown (.md)**: Formatted with headers and bold text
- **Plain Text (.txt)**: Simple text format
- **Email (.txt)**: Optimized for email clients with subject line

## Example Output

The generated cover letter includes:
- Your contact information
- Date
- Company and contact details
- Professional cover letter content
- Proper formatting for the chosen format

## File Structure

```
cover-letter/
├── src/
│   └── main.mjs              # Main application (single file)
├── package.json
└── README.md
```

That's it! The entire application is now contained in a single file with no unnecessary abstractions. 