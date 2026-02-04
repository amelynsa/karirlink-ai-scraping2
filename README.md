# Karirlink AI Scraping

An intelligent web scraping tool powered by Google Gemini AI that extracts job listings from websites with automatic data cleaning, validation, and export capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Email Integration](#email-integration)
- [Development](#development)

---

## Overview

**Karirlink AI Scraping** is a sophisticated job listing scraper that uses Puppeteer for web automation and Google Gemini 2.5 Flash for intelligent content extraction. It processes job listings from target websites, validates the data, performs automated data cleaning, and exports results in multiple formats (JSON, CSV).

**Key Technologies:**

- **Web Browser Automation:** Puppeteer
- **AI Processing:** Google Gemini 2.5 Flash API
- **Data Validation:** Zod
- **Export Formats:** JSON, CSV, XLSX
- **Email Distribution:** Nodemailer
- **Runtime:** TypeScript with tsx

---

## Features

- 🤖 **AI-Powered Extraction:** Uses Google Gemini to intelligently parse and extract job data from HTML
- 🔍 **Smart Filtering:** Automatically filters active job listings and excludes expired positions
- 📊 **Multi-Format Export:** Exports data to JSON, CSV, and XLSX formats
- 🧹 **Automatic Data Cleaning:** Removes duplicates and standardizes data
- 📧 **Email Integration:** Sends results directly to specified email addresses
- 📈 **Usage Analytics:** Tracks API usage and request metrics
- ⚙️ **CLI Support:** Command-line arguments for customizable scraping parameters
- 🌐 **Dynamic Pagination:** Automatically detects and navigates pagination using AI-determined selectors
- 📝 **Structured Validation:** Zod schemas for data validation
- 🔧 **Lazy Loading Support:** Handles pages with lazy-loaded content

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│             CLI & Configuration Layer                │
│  (argv parsing, environment setup, options)         │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│          Web Scraping Layer (Puppeteer)              │
│  - Browser automation                               │
│  - Page navigation & interaction                    │
│  - DOM extraction                                   │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│          AI Processing Layer (Gemini AI)            │
│  - Data extraction from raw HTML                    │
│  - Selector detection for pagination               │
│  - Job listing validation & filtering              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│       Data Cleaning & Validation Layer              │
│  - Schema validation with Zod                       │
│  - Duplicate removal                               │
│  - Data standardization                            │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│          Export & Distribution Layer                │
│  - CSV/JSON/XLSX generation                        │
│  - Email delivery                                  │
│  - File storage                                    │
└─────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Python 3.14+ (required for data cleaning)
- Google Gemini API key
- (Optional) Google Sheets API credentials
- (Optional) Email account credentials (for sending results)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rizaldinur/karirlink-ai-scraping.git
   cd karirlink-ai-scraping
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root (or copy from `.env.example`):

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here

   # GOOGLE SHEET
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_google_service_account_email_here
   GOOGLE_PRIVATE_KEY=your_google_private_key_here
   GOOGLE_SHEET_ID=your_google_sheet_id_here

   # NODEMAILER
   EMAIL_USER=your_email_user_here
   EMAIL_PASS=your_email_password_here
   ```

4. **Set up Python environment:**
   The project includes a Python cleaning script that requires dependencies.

   **Option A: Using Virtual Environment (Recommended)**

   ```bash
   # Create virtual environment with Python 3.14
   python3.14 -m venv .venv

   # Activate virtual environment
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate

   # Install Python dependencies
   pip install -r requirements.txt
   ```

   **Option B: Using System Python**

   **Important:** Python 3.14+ is required. Older versions may fail to install dependencies like pandas 3.0.0 and numpy 2.4.1, which have strict Python version requirements.

   ```bash
   pip install -r requirements.txt
   ```

   **Python Dependencies:**
   - `numpy==2.4.1` - Numerical computing
   - `pandas==3.0.0` - Data manipulation and analysis
   - `python-dateutil==2.9.0.post0` - Date utilities
   - `six==1.17.0` - Python 2 and 3 compatibility
   - `tzdata==2025.3` - Timezone database

5. **Build TypeScript (optional):**
   ```bash
   npm run build
   ```

---

## Configuration

### Command-Line Arguments

```bash
npm run dev -- [options]
```

**Available Options:**

| Flag                | Description                       | Type    | Example              |
| ------------------- | --------------------------------- | ------- | -------------------- |
| `-I, --industry`    | Target industry/company to scrape | string  | `"Bank BRI"`         |
| `-P, --page`        | Number of pages to scrape         | number  | `5`                  |
| `-D, --detail`      | Detail depth level                | number  | `1`                  |
| `--mailto`          | Email address to send results     | string  | `"user@example.com"` |
| `--dontClean`       | Skip data cleaning process        | boolean | N/A                  |
| `--useGoogleSheets` | Read sources from Google Sheets   | boolean | N/A                  |

**Example Usage:**

```bash
npm run dev -- -I "Bank BRI" -P 1 -D 1 --mailto "rizaldinurnaufal25@gmail.com"
```

---

## Usage

### Basic Scraping

```bash
# Scrape Bank BRI job listings, 1 page, send to email
npm run dev -- -I "Bank BRI" -P 1 --mailto "user@example.com"
```

### Advanced Usage

```bash
# Scrape with multiple pages, with detail extraction
npm run dev -- -I "Tech Company" -P 5 -D 2 --mailto "admin@company.com"
```

### With Data Cleaning

```bash
# Scrape and clean the output
npm run dev -- -I "Target Company" -P 3
```

### Using Google Sheets

```bash
# Read company names from Google Sheets
npm run dev -- --useGoogleSheets -P 2 --mailto "results@company.com"
```

---

## Project Structure

```
karirlink-ai-scraping/
├── ai/                              # AI Integration Module
│   ├── ai.ts                       # Gemini API interaction
│   ├── aiconfig.ts                 # AI configuration
│   ├── extractPageDetailData.ts    # Detail page data extraction
│   └── getPageDetailSelector.ts    # Detail page selector detection
│
├── helpers/                        # Utility Functions
│   ├── clickToPageDetail.ts       # Navigate to detail pages
│   ├── extractedDataToCSVRow.ts   # JSON to CSV conversion
│   ├── extracted-data-csv-config.ts # CSV stream configuration
│   ├── gotoNextPage.ts            # Pagination handling
│   ├── handleScrapingError.ts     # Error logging
│   ├── handleScrapingSuccess.ts   # Success logging
│   ├── helpers.ts                 # General utility functions
│   ├── isResponseObjectValuesEmpty.ts # Validation helper
│   ├── lazyLoadPage.ts            # Lazy load handling
│   ├── run-scraper-argv.ts        # CLI argument parser
│   ├── runCleanerScript.ts        # Data cleaning orchestration
│   └── summarizeRunResult.ts      # Result summary generation
│
├── cleaning/                       # Data Cleaning Scripts
│   └── test.py                    # Python cleaning utilities
│
├── kirim-email/                    # Email Module
│   └── send-email.ts              # Email delivery
│
├── schema/                         # Data Schemas & Validation
│   ├── jobSchema.ts               # Job listing schema (Zod)
│   ├── pageDetailSelectorSchema.ts # Detail selector schema
│   └── schema.ts                  # General schemas
│
├── types/                          # TypeScript Interfaces
│   ├── interface.ts               # Core interfaces
│   ├── ScraperOptions.ts          # Configuration interface
│   └── ScraperErrorClass.ts       # Error class definition
│
├── utils/                          # General Utilities
│   ├── __dirname.ts               # Directory resolution
│   ├── getDOMBody.ts              # DOM extraction
│   └── readSourcesFromGoogleSheet.ts # Google Sheets integration
│
├── storage/                        # Output Directory
│   └── *.csv                      # Generated CSV files
│
├── logs/                           # Logging Directory
│   ├── usage-log.json             # JSON formatted logs
│   └── usage-log.jsonl            # JSONL formatted logs
│
├── index.ts                        # Main entry point
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## Core Components

### 1. AI Module (`ai/`)

**Purpose:** Handles all interactions with Google Gemini API

**Key Functions:**

#### `extractData(rawData: string): Promise<ResponseData>`

Extracts job listings from raw HTML using Gemini with structured output.

**Parameters:**

- `rawData`: Raw HTML content to extract job listings from

**Returns:** ResponseData containing:

- `success`: boolean
- `message`: string
- `data.content`: Extracted JSON string (array of job listings)
- `data.usage`: API usage metrics

**Example:**

```typescript
const response = await extractData(htmlContent);
if (response.success) {
  const jobs = JSON.parse(response.data.content);
}
```

#### `getNextButton(rawData: string, initialSelector?: string): Promise<ResponseData>`

Detects and validates pagination button selectors.

**Parameters:**

- `rawData`: Raw HTML content
- `initialSelector`: Optional CSS selector to validate

**Returns:** ResponseData with selector string or empty string

### 2. Schema Module (`schema/`)

**Job Schema (Zod Validation):**

```typescript
{
  title: string;              // Job position name
  company: string;            // Company name
  jobCategory: JobCategory;   // From predefined categories
  location: string;           // Job location
  salary: SalaryInfo;         // Structured or range
  description: string;        // Full job description
  requirements: string[];     // Required qualifications
  benefits: string[];         // Offered benefits
  jobType: JobType;          // Full-time, Part-time, etc.
  sourceUrl: string;         // Original listing URL
  postedDate: string;        // Date posted
  expiryDate: string;        // Expiration date (if available)
}
```

**Salary Types:**

```typescript
// Fixed amount
{ type: "hourly" | "daily" | "monthly" | "yearly" | "fixed", amount: number }

// Range
{ type: "range", min: number, max: number }

// Not provided
""
```

### 3. Scraper Main Logic (`index.ts`)

**Workflow:**

1. Initialize Puppeteer browser
2. Navigate to target URL
3. Iterate through pages:
   - Extract raw HTML
   - Call AI for data extraction
   - Parse and validate results
   - Store in memory
   - Navigate to next page
4. Click into detail pages (if enabled)
5. Clean extracted data using Python script
6. Export to CSV/JSON
7. Send email if configured
8. Log metrics and usage

### 4. Python Cleaning Module (`cleaning/test.py`)

**Purpose:** Post-processing data cleaning and deduplication using Pandas

**Invocation:**

```bash
python cleaning/test.py <input_csv_filename>
```

**Process:**

1. Reads CSV file from `storage/` directory
2. Filters out entries where `success=false`
3. Removes duplicate entries based on: `title`, `location`, `jobDescription`
4. Keeps first occurrence of duplicates
5. Outputs cleaned data to console as JSON with status

**Integration with TypeScript:**
The `runCleanerScript()` helper in `helpers/runCleanerScript.ts` automatically:

- Invokes Python script with the generated CSV filename
- Passes output through Pandas for data standardization
- Returns cleaned data as JSON

**Key Functions:**

- **CSV Reading:** Uses `pd.read_csv()` with UTF-8 encoding
- **Success Filter:** Filters boolean `success` column
- **Deduplication:** Uses Pandas `drop_duplicates()` on key columns
- **Error Handling:** Returns JSON error responses to stderr

---

## Data Flow

### Detailed Data Processing Pipeline

```
┌──────────────────┐
│  Start Scraping  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Initialize Puppeteer & Navigate      │
│ to Target URL                        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ For Each Page:                       │
│ 1. Lazy Load Content                 │
│ 2. Extract DOM Body                  │
│ 3. Check for Next Button Selector    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Send Raw HTML to Gemini AI           │
│ Extract Job Listings                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Validate Against Job Schema (Zod)    │
│ Filter Active Jobs Only              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Store Results in Memory              │
│ Log API Usage Metrics                │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Click Detail Pages (if enabled)      │
│ Extract Additional Data              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Run Python Cleaning Script           │
│ Remove Duplicates & Standardize      │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Export Results:                      │
│ - CSV File (Timestamped)            │
│ - JSON File                          │
│ - Optional: XLSX                     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Send Email with Attachments          │
│ (if mailto provided)                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Generate Summary Report              │
│ Log Session Metrics                  │
└──────────────────────────────────────┘
```

---

## API Reference

### Main Scraper Function

Located in `index.ts`, this is the orchestrator that coordinates all components.

**Input (CLI Arguments):**

```typescript
interface ScraperOptions {
  industry: string; // -I, --industry
  pages: number; // -P, --page
  detailDepth: number; // -D, --detail
  mailto?: string; // --mailto
  dontClean?: boolean; // --dontClean
  useGoogleSheets?: boolean; // --useGoogleSheets
}
```

**Output Files:**

- `storage/RESULT-{TIMESTAMP}_CLEANED_FINAL_V2.csv` - Cleaned CSV data
- `logs/usage-log.jsonl` - API usage logs
- Email attachment (if configured)

### Helper Functions

#### `lazyLoadPage(page: Page): Promise<void>`

Scrolls and waits for lazy-loaded content to render.

#### `getDOMBody(page: Page): Promise<string>`

Extracts and returns the full DOM body as HTML string.

#### `isElementDisabled(element: any): boolean`

Checks if a pagination button is disabled.

#### `gotoNextPage(page: Page, selector: string): Promise<void>`

Navigates to the next page using provided selector.

#### `clickToPageDetail(page: Page): Promise<void>`

Clicks into detail pages to extract additional information.

#### `handleScrapingError(error: ScraperError): void`

Logs errors with context and continues execution.

#### `summarizeRunResult(data: any[], usage: any[], sources: number): void`

Generates final summary report with statistics.

---

## Error Handling

### Error Types

**ScraperError Class:**

```typescript
class ScraperError extends Error {
  type: "navigation" | "extraction" | "validation" | "email" | "unknown";
  context?: Record<string, any>;
  timestamp: Date;
}
```

### Error Recovery

- **Navigation Errors:** Retries page navigation up to 3 times
- **Extraction Errors:** Logs error but continues with next page
- **Validation Errors:** Excludes invalid entries but continues processing
- **Email Errors:** Logs error but doesn't halt scraping

### Graceful Shutdown

Process handles `SIGINT` (Ctrl+C) gracefully:

- Finalizes current page
- Generates summary report
- Closes browser
- Exits cleanly

---

## Email Integration

### Configuration

Set these environment variables in `.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

For Gmail, you may need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### Usage

```bash
npm run dev -- -I "Company" -P 5 --mailto "recipient@example.com"
```

### Behavior

- Automatically attaches the generated CSV file
- Includes run summary in email body
- Supports multiple recipient addresses (comma-separated)
- Handles SMTP errors gracefully

---

## Development

### Node.js Setup

#### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` directory.

#### Development Mode

```bash
npm run dev
```

Runs TypeScript directly with hot-reload via `tsx`.

### Python Setup

#### Activating Virtual Environment

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

#### Deactivating Virtual Environment

```bash
deactivate
```

#### Managing Python Dependencies

**Install all dependencies:**

```bash
pip install -r requirements.txt
```

**Add new Python package:**

```bash
pip install <package_name>
pip freeze > requirements.txt
```

**Update specific package:**

```bash
pip install --upgrade <package_name>
```

### Debugging

#### TypeScript Debugging

Enable verbose logging by modifying environment:

```bash
DEBUG=* npm run dev
```

#### Python Debugging

Run Python script directly to test:

```bash
python cleaning/test.py test-result.csv
```

Check for errors in stderr output.

### Testing

Currently uses manual testing. For unit tests, configure a test runner (Jest/Vitest).

### Code Quality

- **Type Safety:** Full TypeScript with strict mode
- **Validation:** Zod schemas for runtime validation
- **Error Handling:** Comprehensive try-catch with context
- **Logging:** Detailed JSONL logs for debugging
- **Python Standards:** PEP 8 compliance in cleaning scripts

---

## Key Algorithms

### Job Status Filtering Algorithm

1. Check for explicit status indicators: "active", "open", "available", "expired", "closed"
2. If found, use explicit status
3. If no explicit status, check expiration date:
   - If expiration date exists and is in past, mark as inactive
   - If expiration date exists and is in future, mark as active
   - If no expiration date, default to active
4. Exclude all inactive jobs from results

### Pagination Detection Algorithm

1. Extract current page HTML
2. Send to Gemini AI with initial selector (if provided)
3. AI validates initial selector or finds new one
4. Return most reliable CSS selector for next button
5. Use selector to click next button
6. Check if disabled or removed → end pagination

### Duplicate Detection Algorithm

Python script in `cleaning/test.py`:

1. Normalize job data (lowercase, trim whitespace)
2. Hash job title + company + location
3. Keep first occurrence, flag duplicates
4. Remove duplicate entries
5. Maintain extracted data integrity

---

## Performance Considerations

- **Lazy Loading:** Page waits up to 3 seconds for content to load
- **API Rate Limiting:** Respects Gemini API quotas
- **Memory Management:** Streams CSV writing to avoid memory overflow
- **Pagination Limit:** Configurable page limit to prevent long runs
- **Timeout Handling:** 30-second timeout per page navigation

---

## Troubleshooting

### Common Issues

**Issue:** "Gemini API Key not found"

- **Solution:** Ensure `.env` file has `GEMINI_API_KEY` set

**Issue:** Email not sending

- **Solution:** Verify SMTP credentials and enable "Less secure apps" on Gmail

**Issue:** No job listings extracted

- **Solution:** Check if website structure matches expected HTML patterns

**Issue:** Pagination not working

- **Solution:** Verify website pagination uses standard button/link elements

---

## Future Enhancements

- [ ] Support for multiple concurrent pages
- [ ] Custom CSS selector training for websites
- [ ] Database integration for job storage
- [ ] Web dashboard for results
- [ ] Scheduled scraping with cron jobs
- [ ] Proxy rotation for large-scale scraping
- [ ] Webhook integration for real-time notifications

---

## License

ISC License - See LICENSE file for details

---

## Author

Rzl (rizaldinur)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.
