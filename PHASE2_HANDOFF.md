# Phase 2 Handoff Documentation

## Overview

Phase 1 implemented a **mock authentication system** that runs entirely in the browser. This document outlines the steps needed to transition to a real backend API in Phase 2.

## Current Phase 1 Implementation

### Architecture
- **Frontend-only**: All authentication logic runs in the browser
- **No backend**: No API calls are made
- **localStorage**: User data and tokens stored in browser localStorage
- **Mock validation**: Password must be ≥6 characters, any email accepted

### Key Files
- `assets/js/config.js` - Environment configuration
- `assets/js/auth.js` - Mock authentication module
- `assets/js/auth-check.js` - Route guard for protected pages
- `signin.html` - Sign-in page with form
- `learner-portal.html` - Protected learner portal page
- `classroom.html` - Protected classroom page

## Phase 2 Backend Integration Checklist

### 1. Set Up Backend API

#### Authentication Endpoints Needed
```
POST /api/auth/signin
- Request: { email, password }
- Response: { success, message, token, user: { id, email, firstName, lastName } }

POST /api/auth/signup
- Request: { email, password, firstName, lastName }
- Response: { success, message, token, user: { id, email, firstName, lastName } }

POST /api/auth/logout
- Headers: Authorization: Bearer <token>
- Response: { success, message }

GET /api/auth/verify
- Headers: Authorization: Bearer <token>
- Response: { success, user: { id, email, firstName, lastName } }

POST /api/auth/refresh
- Request: { refreshToken }
- Response: { success, token }
```

### 2. Update config.js

**Current:**
```javascript
API_BASE_URL: '/api'
```

**Update to:**
```javascript
API_BASE_URL: 'https://api.pmerit.com' // or your actual API URL
```

Consider environment-specific URLs:
```javascript
API_BASE_URL: config.ENV === 'production' 
  ? 'https://api.pmerit.com'
  : config.ENV === 'staging'
  ? 'https://staging-api.pmerit.com'
  : 'http://localhost:3000/api'
```

### 3. Update auth.js

All functions in `auth.js` have `TODO (Phase 2):` comments with example API implementations.

#### signin() Function

**Replace mock implementation with:**
```javascript
signin: async function (email, password) {
  try {
    const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies for httpOnly tokens
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token (consider using httpOnly cookies instead)
      localStorage.setItem('pmerit_token', data.token);
      localStorage.setItem('pmerit_user', JSON.stringify(data.user));
      
      return {
        success: true,
        message: 'Signed in successfully',
        user: data.user
      };
    } else {
      return {
        success: false,
        message: data.message || 'Sign in failed'
      };
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
}
```

#### signup() Function

**Replace mock implementation with:**
```javascript
signup: async function (email, password, firstName, lastName) {
  try {
    const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('pmerit_token', data.token);
      localStorage.setItem('pmerit_user', JSON.stringify(data.user));
      
      return {
        success: true,
        message: 'Account created successfully',
        user: data.user
      };
    } else {
      return {
        success: false,
        message: data.message || 'Sign up failed'
      };
    }
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
}
```

#### logout() Function

**Replace mock implementation with:**
```javascript
logout: async function () {
  const token = localStorage.getItem('pmerit_token');
  
  try {
    // Call backend to invalidate token
    await fetch(`${window.CONFIG.API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local data regardless of API response
    localStorage.removeItem('pmerit_token');
    localStorage.removeItem('pmerit_user');
    
    window.location.href = '/signin.html';
  }
}
```

#### isAuthenticated() Function

**Replace mock implementation with:**
```javascript
isAuthenticated: async function () {
  const token = localStorage.getItem('pmerit_token');
  
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}
```

**Note:** Since this is now async, you'll need to update `auth-check.js` to use `await`:
```javascript
(async function () {
  'use strict';
  
  if (typeof window.AUTH === 'undefined') {
    console.error('auth-check.js: AUTH module not loaded');
    return;
  }
  
  const isAuth = await window.AUTH.isAuthenticated();
  
  if (!isAuth) {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('redirect_after_login', currentUrl);
    window.location.href = '/signin.html';
  }
})();
```

### 4. Security Enhancements

#### Switch to httpOnly Cookies (Recommended)
Instead of storing tokens in localStorage, use httpOnly cookies set by the backend:

**Backend Response:**
```javascript
Set-Cookie: pmerit_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
```

**Frontend Changes:**
- Remove `localStorage.setItem('pmerit_token', ...)` calls
- Remove `localStorage.getItem('pmerit_token')` calls
- Use `credentials: 'include'` in all fetch calls
- Backend will automatically include cookie in requests

#### CSRF Protection
- Implement CSRF tokens for state-changing requests
- Add CSRF token to all POST/PUT/DELETE requests:
```javascript
headers: {
  'X-CSRF-Token': getCsrfToken()
}
```

#### Token Refresh
Implement automatic token refresh:
```javascript
async function refreshToken() {
  const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('pmerit_token', data.token);
    return true;
  }
  
  return false;
}
```

### 5. Error Handling

Add comprehensive error handling:
```javascript
async function handleApiError(response) {
  if (response.status === 401) {
    // Unauthorized - try to refresh token
    const refreshed = await refreshToken();
    if (!refreshed) {
      // Refresh failed, redirect to login
      window.location.href = '/signin.html';
    }
  } else if (response.status === 429) {
    // Rate limited
    return {
      success: false,
      message: 'Too many attempts. Please try again later.'
    };
  } else if (response.status >= 500) {
    // Server error
    return {
      success: false,
      message: 'Server error. Please try again later.'
    };
  }
  
  const data = await response.json();
  return {
    success: false,
    message: data.message || 'An error occurred'
  };
}
```

### 6. Additional Features to Consider

#### Email Verification
- Add email verification after signup
- Implement resend verification email functionality

#### Password Reset
- Implement "Forgot password?" functionality
- Add reset password page and flow

#### Two-Factor Authentication (2FA)
- Add optional 2FA setup in user profile
- Implement 2FA verification during login

#### Session Management
- Display active sessions in user profile
- Allow users to revoke sessions

### 7. Testing Checklist

Before deploying Phase 2:

- [ ] Test successful sign-in with valid credentials
- [ ] Test sign-in with invalid credentials
- [ ] Test sign-up with new user
- [ ] Test sign-up with existing email
- [ ] Test password validation on backend
- [ ] Test email format validation on backend
- [ ] Test logout functionality
- [ ] Test token expiration and refresh
- [ ] Test protected routes with valid token
- [ ] Test protected routes with invalid/expired token
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test concurrent sessions
- [ ] Test on mobile devices
- [ ] Test with slow network (throttling)
- [ ] Test error messages are user-friendly
- [ ] Test accessibility (screen readers, keyboard navigation)

### 8. Migration Strategy

#### Gradual Rollout
1. Deploy backend API to staging environment
2. Test thoroughly on staging
3. Update Phase 1 code to use real API on staging
4. Run parallel testing (some users on mock, some on real API)
5. Monitor for issues
6. Deploy to production once stable

#### Rollback Plan
- Keep Phase 1 mock implementation in a separate branch
- Be ready to roll back to mock if critical issues arise
- Have database backups before migration

### 9. Monitoring and Logging

Implement monitoring for:
- Authentication success/failure rates
- API response times
- Token expiration rates
- Error rates by type
- Failed login attempts (security)

## Questions?

For questions about Phase 2 implementation, contact the backend team or review the TODO comments in:
- `assets/js/auth.js`
- `assets/js/config.js`

## References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [MDN Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
