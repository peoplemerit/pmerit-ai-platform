# Placeholder for QA screenshots
# Screenshots captured during testing will be saved here

## Directory Structure

```
/admin/qa-screenshots/issue-14/
├── browser-tests/
│   ├── chrome/
│   ├── firefox/
│   ├── safari/
│   └── edge/
├── mobile-tests/
│   ├── ios/
│   └── android/
├── accessibility/
├── performance/
└── bugs/
    ├── P0/
    ├── P1/
    ├── P2/
    └── P3/
```

## Usage

1. Take screenshots during testing
2. Organize by category (browser, mobile, accessibility, bugs)
3. Name descriptively with browser/device and issue
4. Reference in bug reports and TEST_REPORT.md

## Naming Convention

```
[category]-[browser/device]-[description]-[date].png
```

Examples:
- `browser-chrome-assessment-entry-2025-11-09.png`
- `bug-P1-safari-chart-not-rendering-2025-11-09.png`
- `mobile-ios-keyboard-overlap-2025-11-09.png`
- `accessibility-focus-indicator-missing-2025-11-09.png`

## Screenshot Guidelines

- Capture entire browser window (include URL bar)
- Include console if showing errors
- Highlight issues with arrows or annotations
- Use high resolution (actual size, not scaled)
- Include timestamp or date in filename
