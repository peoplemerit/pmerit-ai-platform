# PMERIT AI - Cloudflare Email Routing Configuration

## 📧 Email Routing Setup

### Required Cloudflare Email Routes:
1. **Employee Onboarding**: `onboard@pmerit-ai-platform.pages.dev`
   - Forward to: Your admin email for notifications
   - Used for: Employee invitation confirmations

2. **System Notifications**: `noreply@pmerit-ai-platform.pages.dev`
   - Forward to: Your admin email
   - Used for: System-generated emails

3. **Support**: `support@pmerit-ai-platform.pages.dev`
   - Forward to: Your support email
   - Used for: Student and employee support

### Cloudflare Dashboard Setup Steps:

#### Step 1: Access Email Routing
1. Go to Cloudflare Dashboard
2. Select your domain: `pmerit-ai-platform.pages.dev`
3. Navigate to "Email Routing" in the sidebar

#### Step 2: Enable Email Routing
1. Click "Enable Email Routing"
2. Add destination email addresses
3. Verify destination emails

#### Step 3: Create Email Routes
1. Add route: `onboard@pmerit-ai-platform.pages.dev`
2. Add route: `noreply@pmerit-ai-platform.pages.dev`
3. Add route: `support@pmerit-ai-platform.pages.dev`

#### Step 4: DNS Records (Auto-configured)
Cloudflare will automatically add:
- MX records for email routing
- SPF records for authentication
- DKIM records for security

### Integration with PMERIT API
The API will send emails using:
- From: `noreply@pmerit-ai-platform.pages.dev`
- Reply-To: `support@pmerit-ai-platform.pages.dev`
- Notifications to: `onboard@pmerit-ai-platform.pages.dev`
