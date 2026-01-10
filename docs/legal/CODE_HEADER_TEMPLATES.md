# PMERIT Code Header Templates

Use these headers at the top of all source files to establish copyright protection.

---

## JavaScript / TypeScript Files

```javascript
/**
 * PMERIT Platform
 * Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
 *
 * This file is part of the PMERIT Platform and is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 *
 * For licensing inquiries: legal@pmerit.com
 */
```

## JavaScript (Minified/Production)

```javascript
/*! PMERIT Platform | (c) 2024-2025 PMERIT Holdings LLC | All Rights Reserved */
```

---

## HTML Files

```html
<!--
  PMERIT Platform
  Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.

  This file is proprietary and confidential.
  Unauthorized copying, modification, distribution, or use is strictly prohibited.
-->
```

---

## CSS Files

```css
/**
 * PMERIT Platform
 * Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
 *
 * Proprietary and confidential. Unauthorized use prohibited.
 */
```

---

## SQL / Migration Files

```sql
-- PMERIT Platform
-- Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
--
-- This file is proprietary and confidential.
-- Unauthorized copying, modification, distribution, or use is strictly prohibited.
```

---

## JSON Files (as comment block at top or in package.json)

For `package.json`, add:

```json
{
  "name": "pmerit-platform",
  "author": "PMERIT Holdings LLC",
  "license": "SEE LICENSE IN LICENSE",
  "private": true,
  ...
}
```

---

## Markdown Documentation

```markdown
<!--
PMERIT Platform Documentation
Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
Confidential and proprietary.
-->
```

---

## Python Files (if applicable)

```python
"""
PMERIT Platform
Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.

This file is part of the PMERIT Platform and is proprietary and confidential.
Unauthorized copying, modification, distribution, or use is strictly prohibited.

For licensing inquiries: legal@pmerit.com
"""
```

---

## Shell Scripts

```bash
#!/bin/bash
#
# PMERIT Platform
# Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
#
# This file is proprietary and confidential.
# Unauthorized copying, modification, distribution, or use is strictly prohibited.
#
```

---

## Configuration Files (YAML, TOML, etc.)

```yaml
# PMERIT Platform
# Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.
# Proprietary and confidential.
```

---

## Implementation Notes

### Priority Files to Add Headers

1. **Critical (Add First)**
   - `assets/js/AvatarManager.js` - Core IP
   - `assets/js/LipSyncVisemes.js` - Trade secret
   - `assets/js/assessment-*.js` - Core IP
   - `src/index.ts` - Main backend
   - `src/algorithms/*.ts` - Trade secrets

2. **High Priority**
   - All files in `assets/js/`
   - All files in `src/routes/`
   - All migration files

3. **Medium Priority**
   - CSS files
   - HTML files
   - Configuration files

### Automated Header Addition

You can use a script to add headers automatically:

```bash
# Example: Add header to all JS files
for file in assets/js/*.js; do
  if ! grep -q "PMERIT Holdings LLC" "$file"; then
    echo "Adding header to $file"
    # Add header logic here
  fi
done
```

### Verification

After adding headers, verify with:

```bash
# Check all JS files have copyright
grep -L "PMERIT Holdings LLC" assets/js/*.js
```

---

## Footer for Web Pages

Add to HTML before closing `</body>`:

```html
<footer>
  <p>&copy; 2024-2025 PMERIT Holdings LLC. All Rights Reserved.</p>
</footer>
```

Or in JavaScript console message:

```javascript
console.log('%c PMERIT Platform %c Copyright (c) 2024-2025 PMERIT Holdings LLC. All Rights Reserved.',
  'background: #2A5B8C; color: white; padding: 2px 4px;',
  'color: #666;');
```

---

*Last Updated: December 2025*
