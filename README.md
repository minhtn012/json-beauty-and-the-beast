# JSON Parser Beauty and the Beast

A beautiful and intuitive web-based tool for parsing, formatting, and comparing JSON data.

## Features

### JSON Viewer
- **Parse and Format JSON**: Paste any JSON data and get a beautifully formatted output
- **Syntax Highlighting**: Easy-to-read formatted JSON with proper indentation
- **Copy to Clipboard**: One-click copy of formatted JSON
- **Export to File**: Download formatted JSON as a file
- **Clear Input**: Quick clear button for input textarea
- **Synchronized Scrolling**: Optional sync scroll between input and output panels
- **Fullscreen Mode**: Toggle fullscreen for better focus

### JSON Diff
- **Compare Two JSONs**: Compare JSON A (Original) with JSON B (Compare)
- **Side-by-Side View**: View both parsed JSONs side by side
- **Detailed Diff Output**: Get a comprehensive comparison result showing differences
- **Individual Actions**: Copy or export each parsed JSON separately
- **Synchronized Scrolling**: Separate sync scroll options for inputs and outputs
- **Fullscreen Support**: Toggle fullscreen for input and output sections independently

## Usage

### JSON Viewer Tab
1. Paste your JSON data into the input textarea
2. Click "Parse JSON" button
3. View the formatted result in the output panel
4. Use the copy or export buttons to save your formatted JSON

### JSON Diff Tab
1. Paste your original JSON into "JSON A (Original)" textarea
2. Paste the comparison JSON into "JSON B (Compare)" textarea
3. Click "Compare A and B" button
4. View both parsed JSONs and the detailed comparison result
5. Use copy/export buttons for individual outputs

## Technical Details

### File Structure
```
json-beauty-and-the-beats/
├── parse.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # CSS styling
└── publics/
    ├── logo.png
    └── favicon/        # Favicon files
```

### Features Implementation
- **Tab Switching**: Easy navigation between JSON Viewer and JSON Diff modes
- **Error Handling**: User-friendly error messages for invalid JSON
- **Responsive Design**: Works on various screen sizes
- **Material Icons**: Clean and modern UI with Material Design icons

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- Material Icons

## Browser Support
Works on all modern browsers that support ES6+ JavaScript features.

## License
This project is open source and available for personal and commercial use.

## Author
minhnt.uit@gmail.com
