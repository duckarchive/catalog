# TypeScript Node PDF/A Text Extraction

This project is a TypeScript-based Node.js application that extracts text from PDF/A files. It demonstrates how to read PDF/A files from a specified assets folder and extract their text content using a PDF parsing library.

## Project Structure

```
typescript-node-parser
├── src
│   ├── index.ts          # Entry point of the application
│   ├── parser.ts         # Contains the text extraction logic
│   └── assets
│       └── example.pdf   # Sample PDF/A file for testing
├── package.json          # NPM configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd typescript-node-parser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile TypeScript files:**
   ```bash
   npx tsc
   ```

4. **Run the application:**
   ```bash
   node dist/index.js
   ```

## Usage

The application will read the `example.pdf` file located in the `src/assets` folder and extract the text content. You can modify the `src/assets` folder to include your own PDF/A files for testing.

## Dependencies

- TypeScript
- A PDF parsing library (e.g., pdf-lib or pdf-parse)

## License

This project is licensed under the MIT License.