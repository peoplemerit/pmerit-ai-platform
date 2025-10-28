# Content Security Policy (CSP) for Avatar Assets

This document describes the Content Security Policy requirements for loading avatar assets and related resources.

## Current CSP Configuration

The PMERIT platform serves avatar assets from the same origin by default, requiring minimal CSP changes.

## Required CSP Directives

### For Self-Hosted Assets (Default)

When assets are served from `/assets/avatars/` on the same domain:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' data:;
  media-src 'self';
  connect-src 'self';
```

**No additional changes needed** - `'self'` covers same-origin avatar GLB files.

### For External CDN (Optional)

If you host avatars on an external CDN (e.g., `cdn.pmerit.com` or `cdn.example.com`):

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' data: https://cdn.pmerit.com;
  media-src 'self' https://cdn.pmerit.com;
  connect-src 'self' https://cdn.pmerit.com;
```

**Key directives:**
- `img-src`: Allows loading textures embedded in GLB
- `media-src`: Allows loading GLB binary data
- `connect-src`: Allows XHR/fetch requests to CDN

## Implementation Methods

### Method 1: Meta Tag (Current)

Add to `<head>` in HTML files:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; ...">
```

**Pros:** Simple, no server configuration  
**Cons:** Less flexible, repeated in every HTML file

### Method 2: HTTP Headers (Recommended)

Configure in web server or Cloudflare Pages.

#### Cloudflare Pages (_headers file)

Create `_headers` file in project root:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://cdn.pmerit.com; media-src 'self' https://cdn.pmerit.com; connect-src 'self' https://cdn.pmerit.com
```

**Pros:** Centralized, applies to all pages  
**Cons:** Requires redeployment to change

#### Cloudflare Workers

Create `functions/_middleware.js`:

```javascript
export async function onRequest(context) {
  const response = await context.next();
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; ..."
  );
  
  return response;
}
```

**Pros:** Dynamic, can be environment-specific  
**Cons:** Adds processing overhead

### Method 3: Cloudflare Dashboard

Set headers in Cloudflare dashboard:
1. Go to Cloudflare Dashboard
2. Select your site
3. Rules → Transform Rules → Modify Response Header
4. Add `Content-Security-Policy` header

**Pros:** No code changes  
**Cons:** Not versioned, easy to forget

## External Dependencies

The avatar system uses these external CDNs:

### Three.js (Required)

```html
<script 
  src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
  integrity="sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer">
</script>
```

**Required CSP:** `script-src https://cdnjs.cloudflare.com`

### GLTFLoader (Optional, for GLB models)

If loading GLTFLoader from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
```

**Required CSP:** `script-src https://cdn.jsdelivr.net`

**Recommendation:** Bundle GLTFLoader locally to avoid extra CSP directive.

## Testing CSP

### Browser DevTools

1. Open DevTools (F12)
2. Go to Console tab
3. Look for CSP violation warnings:
   ```
   Refused to load ... because it violates the following Content Security Policy directive: "..."
   ```

### CSP Evaluator

Use Google's CSP Evaluator: https://csp-evaluator.withgoogle.com/

Paste your CSP policy to check for issues.

### Report-Only Mode (Testing)

Test CSP without blocking:

```http
Content-Security-Policy-Report-Only: default-src 'self'; ...
```

Violations will be logged but not enforced.

## Common Issues

### Issue: GLB Model Fails to Load

**Error:** `Refused to connect to 'https://cdn.example.com/avatar.glb'`

**Fix:** Add CDN domain to `connect-src` and `media-src`:

```http
connect-src 'self' https://cdn.example.com;
media-src 'self' https://cdn.example.com;
```

### Issue: Three.js Script Blocked

**Error:** `Refused to load script from 'https://cdnjs.cloudflare.com/...'`

**Fix:** Add to `script-src`:

```http
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
```

### Issue: Textures Not Loading

**Error:** `Refused to load image`

**Fix:** Add to `img-src`:

```http
img-src 'self' data: blob: https://your-cdn.com;
```

Note: `data:` and `blob:` may be needed for texture data URLs.

## Security Best Practices

1. **Avoid `'unsafe-inline'`** for scripts (requires code refactoring)
2. **Use SRI** (Subresource Integrity) for CDN scripts
3. **Use `'nonce-'`** for inline scripts instead of `'unsafe-inline'`
4. **Minimize CDN domains** - bundle dependencies locally when possible
5. **Test in report-only mode** before enforcing strict CSP

## Environment-Specific CSP

### Development (localhost)

```http
Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
```

Relaxed for debugging.

### Staging (Cloudflare Pages Preview)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' *.pages.dev;
```

Allow preview domains.

### Production (pmerit.com)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self';
```

Strict, minimal directives.

## Recommended CSP for PMERIT (Phase 5)

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' data: blob:;
  media-src 'self' blob:;
  connect-src 'self' https://*.openai.azure.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Notes:**
- `unsafe-inline` for styles: Required by current inline styles (Phase 6 can remove)
- `blob:`: Needed for Three.js internal texture handling
- `openai.azure.com`: For AI chat API
- `frame-ancestors 'none'`: Prevent clickjacking
- `form-action 'self'`: Restrict form submissions

## Future Improvements (Phase 6+)

1. Remove `'unsafe-inline'` from `script-src` by using nonces
2. Remove `'unsafe-inline'` from `style-src` by externalizing styles
3. Implement CSP reporting endpoint
4. Add `upgrade-insecure-requests` directive
5. Consider `require-trusted-types-for 'script'` for XSS protection

## Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/platform/headers/)
- [CSP Quick Reference](https://content-security-policy.com/)

---

**Last Updated:** Phase 5 Implementation (October 2025)
