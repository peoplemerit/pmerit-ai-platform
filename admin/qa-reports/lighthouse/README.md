# Placeholder for Lighthouse test reports
# Reports will be saved here during testing

## Directory Structure

```
/admin/qa-reports/lighthouse/
├── YYYY-MM-DD/
│   ├── assessment-entry-desktop.html
│   ├── assessment-entry-desktop.json
│   ├── assessment-entry-mobile.html
│   ├── assessment-entry-mobile.json
│   ├── assessment-questions-desktop.html
│   ├── assessment-questions-mobile.html
│   └── ...
└── summary.md
```

## Usage

1. Run Lighthouse audits following `/admin/testing/lighthouse-test.html`
2. Save HTML/JSON reports in dated subdirectories
3. Create summary.md with overview of all test results
4. Reference reports in main TEST_REPORT.md

## Naming Convention

```
[page-name]-[device]-[date].html
```

Examples:
- `assessment-entry-desktop-2025-11-09.html`
- `assessment-questions-mobile-2025-11-09.html`
- `classroom-desktop-2025-11-09.json`
