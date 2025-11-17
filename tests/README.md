# Playwright E2E Tests

This directory contains end-to-end tests for the Lama Pet Care Frontend application.

## Setup

1. Install dependencies (from project root):
```bash
npm install
# or
pnpm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

**Note:** The tests will automatically start the dev server (`npm run dev`) before running, so you don't need to start it manually.

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run a specific test file
```bash
npx playwright test tests/reserve-history.spec.ts
```

## Test Structure

### Reserve History Tests (`reserve-history.spec.ts`)

Tests the Reserve History page functionality:

- ✅ **Petowner can see their services but cannot change status**
  - Verifies services are displayed
  - Verifies status is shown as static text (not clickable)
  - Verifies no status dropdown buttons exist

- ✅ **Caretaker can see services and can change status**
  - Verifies services are displayed
  - Verifies status dropdown button is visible and clickable
  - Verifies status can be changed

- ✅ **Doctor can see services and can change status**
  - Verifies services are displayed
  - Verifies status dropdown button is visible and clickable
  - Verifies status can be changed

- ✅ **Status dropdown shows all three options: ongoing, wait, finish**
  - Verifies all status options are available in the dropdown

- ✅ **Petowner cannot see status dropdown button**
  - Verifies no status buttons exist for pet owners
  - Verifies status is displayed as static text

## Test Configuration

Tests are configured in `playwright.config.ts`. The configuration:
- Runs tests in parallel
- Uses Chromium, Firefox, and WebKit browsers
- Automatically starts the dev server before tests
- Generates HTML reports

## Viewing Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Notes

- Tests use mocked API responses to avoid dependency on backend
- Authentication is simulated via localStorage
- Tests run against `http://localhost:3000` (dev server)

