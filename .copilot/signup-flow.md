Implement a modular, governance-compliant homepage experience for PMERIT.com that:

Applies canonical header, footer, and uniform design tokens across the platform.

Routes users based on authentication status:

Unauthenticated users: Clicking Start Learning opens the sign-up/sign-in modal.

Authenticated users: Clicking Start Learning redirects to the Learner Portal (formerly “Dashboard”).

📁 Files Involved
index.html (homepage)

header.html, footer.html (canonical layout components)

style.css (design tokens: colors, fonts, buttons)

script.js (routing logic)

signup_sign.txt (reference for sign-in/sign-up UI and logic)

dashboard.html → rename to learner-portal.html

🧩 Tasks
1. Apply Canonical Header/Footer
Replace inline header/footer in index.html with:

html
<div id="header-container"></div>
<div id="footer-container"></div>
Load header.html and footer.html via JavaScript or server-side includes.

Ensure accessibility roles (role="banner", role="contentinfo") are preserved.

2. Enforce Uniform Design
Use shared CSS variables from style.css:

--primary, --text, --background, --border-radius, etc.

Apply consistent button styles:

css
.btn-primary {
  background: var(--primary);
  color: white;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.25rem;
  font-weight: 600;
}
3. Implement “Start Learning” Logic
Add button to homepage:

html
<button id="startLearningBtn" class="btn-primary">Start Learning</button>
In script.js, implement logic:

js
document.getElementById('startLearningBtn').addEventListener('click', async () => {
  const response = await fetch('/api/auth/me', { credentials: 'include' });
  if (response.ok) {
    window.location.href = '/learner-portal.html';
  } else {
    window.location.href = '/signup.html'; // or open modal
  }
});
4. Rename Dashboard to Learner Portal
Rename dashboard.html to learner-portal.html.

Update all internal links and redirects accordingly.

I want you to work with to complete user journey design. I build and design the platform. Anyone accessing/visiting PMERIT.com will be able to use the AI model "PMERIT AI", powered by phi-3, will be able to collaborate and chat with it the same way I'm using you now; they will be able to use the career paths and offers an assessment; and the Pmerit AI CSR to ask all kind of questions about the platform services. The model is used to power the career paths and offers an assessment, and Also used as a receptionist (CSR) on the front page. The Pmerit AI CSR will escalate issues it cannot handle to human. The Platform is accessible globally to anyone. However, the launching grounds are the USA and Nigeria. The primary audience are willing individual around the world, especially in the regions where education is inaccessible or too expensive to pursue due to political corruption or instabilities; this is aim to provide education and remote career opportunities. The main objective for these primary audience is to design and develop remote career curriculum that enables graduands to seek remote job opportunities around world and link them to employers around the world. The secondary objective is to provide an alternative educational system from Early Childhood Education (0-5 years old), Elementary Education (6-11 years old), High school (14-18 years old), and Postsecondary Education (18 years old and onward).
Visiting users can use all the services on the front page without being a registered users or sign up. However, their activities are saved locally. Registered users will have the copy of their activities saved within their "Learner Portal". What kind of information can be obtained when users decide to sign up, using USA information collection standard?
In the US, platforms like Pmerit.com that collect user data are governed by federal laws such as COPPA and state-level laws like CCPA. Compliance requires adhering to principles including providing clear notice, obtaining consent, and enabling user data control. Information collected can include basic identity, contact, login, demographics, academic, career, interests, goals, assessment, user-generated content, platform usage, interaction, geolocation, and persistent identifiers like cookies and IP addresses. Key legal considerations include COPPA requirements for children under 13, general data protection principles, and compliance with various state-specific privacy laws. More details are available on various data privacy and legal information sites.


1. https://www.instructure.com/resources/blog/13-lms-features-benefit-student-learning
2. https://elearningindustry.com/effective-learning-portal-7-key-points-consider
3. https://www.knack.com/blog/create-a-student-portal/


graph TD
    A[User visits PMERIT.com and clicks "Sign Up"] --> B{Are you a parent, guardian,<br>teacher, or adult learner?};
    B -- Yes --> C{Are you 18 or older?};
    B -- No --> D{Are you signing up for<br>a child (under 18)?};

    C -- Yes --> E[Redirect to Adult/General Sign-Up Form];
    C -- No --> F[Redirect to Minor Sign-Up Form];

    D -- Yes --> G[Display Adult/Parent Sign-Up Form];
    G --> H[Parent completes registration<br>and provides consent for child];
    H --> I[Child account is created<br>with parent oversight];
    D -- No --> F;

    E --> J[Collect required Adult/General Info];
    J --> K[Account created.<br>Welcome to your Learner Portal.];

    F --> L[Display Age Verification];
    L --> M{Are you 13 or older?};
    M -- Yes --> N[Redirect to Teen Sign-Up Form];
    M -- No --> O[Prompt for Parent/Teacher email<br>for COPPA consent];
    N --> P[Collect required Teen Info<br>with less data];
    O --> Q[Send parent/teacher a link<br>to approve the account];
    P --> K;
    Q --> K;



Sign-up page sketches for different user types
The visual design for each page should follow best practices for accessibility and usability.
1. Adult and general sign-up form
This form is for all users over 18, including independent adult learners, parents, and teachers.
Form sections:
Create Your Account:
Full Name
Email Address
Password (with strength indicator)
Country (for regional offerings and data processing)
Identity & Role:
"Are you signing up as a student, parent, or teacher?" (Radio buttons)
If "Parent" or "Teacher," prompt to add a child's account later within the portal.
Privacy & Consent:
Checkbox 1: I have read and agree to the PMERIT.com Terms of Service.
Checkbox 2: I have read and agree to the PMERIT.com Privacy Policy.
Optional Checkbox: I would like to receive marketing communications and product updates.
2. Minor (13–17) sign-up form
This form is for teenagers who have verified their age. It collects less personal information than the adult form.
Form sections:
Create Your Account:
Username
Email Address (used for login and communication with parents, if applicable)
Password
Privacy & Consent:
Consent Checkbox: I have read and agree to the PMERIT.com Terms of Service and Privacy Policy.
Required Field: Parent/Guardian email address.
Button: Send for Parental Consent
Note: The account is created but not fully active until the parent or guardian provides verifiable consent.
3. Child (0–12) sign-up form
This is an entry point, and the child's account creation is completed by a parent or teacher.
Form sections:
Account Creation for Your Child:
Child's First Name
Child's Date of Birth (for age-specific learning plans)
Parent's or Teacher's Email Address (to send the consent request)
Button: Continue (to send the email)
Other elements of a compliant sign-up page
Clear Headings and Labels: Every field should have a descriptive label. Avoid using placeholder text as the only label.
Progressive Disclosure: To avoid overwhelming users, consider using a multi-step form, where more specific information (like career goals) is collected later within the Learner Portal.


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sign in to PMERIT - Access your personalized learning dashboard and courses">
  <meta name="keywords" content="PMERIT sign in, login, student portal, learning platform">
  <meta name="author" content="PMERIT AI Platform">
  <meta name="theme-color" content="#4F46E5">
  
  <title>Sign In - PMERIT AI Platform</title>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QkAfRGJA+Ysg==" crossorigin="anonymous" referrerpolicy="no-referrer">
  
  <!-- Base CSS - Design System -->
  <link rel="stylesheet" href="/assets/base.css">
  
  <!-- Sign In specific styles -->
  <style>
    /* Sign In Container */
    .signin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
      align-items: start;
    }
    
    /* Welcome Section */
    .welcome-section {
      padding: 2rem 0;
    }
    
    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 1rem;
    }
    
    .welcome-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    /* Benefits List */
    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .benefit-icon {
      width: 50px;
      height: 50px;
      border-radius: var(--border-radius);
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    .benefit-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    
    .benefit-content p {
      color: var(--text-secondary);
      line-height: 1.5;
    }
    
    /* Sign In Form */
    .signin-form-container {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: var(--border-radius);
      padding: 2rem;
      box-shadow: var(--shadow);
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    
    .form-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    /* Form Elements */
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--border-radius);
      font-family: var(--font-family);
      font-size: 1rem;
      transition: border-color 0.2s;
      background: var(--background);
      color: var(--text);
    }
    
    .form-input:focus {
      border-color: var(--primary);
      outline: none;
    }
    
    .form-input.error {
      border-color: var(--error);
    }
    
    .form-error {
      color: var(--error);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: none;
    }
    
    .form-error.show {
      display: block;
    }
    
    /* Form Options */
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }
    
    .remember-me label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .forgot-password {
      color: var(--primary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .forgot-password:hover {
      text-decoration: underline;
    }
    
    /* Submit Button */
    .submit-btn {
      width: 100%;
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 1.5rem;
    }
    
    .submit-btn:hover {
      background: var(--primary-dark);
    }
    
    .submit-btn:disabled {
      background: var(--border);
      cursor: not-allowed;
    }
    
    .submit-btn.loading {
      position: relative;
      color: transparent;
    }
    
    .submit-btn.loading:after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Divider */
    .divider {
      position: relative;
      text-align: center;
      margin: 1.5rem 0;
    }
    
    .divider:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border);
    }
    
    .divider span {
      background: var(--background);
      padding: 0 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    /* Social Login */
    .social-login {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--border-radius);
      background: var(--background);
      color: var(--text);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .social-btn:hover {
      border-color: var(--primary);
      background: var(--surface);
    }
    
    .social-btn i {
      font-size: 1.125rem;
    }
    
    /* Sign Up Link */
    .signup-link {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .signup-link a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }
    
    .signup-link a:hover {
      text-decoration: underline;
    }
    
    /* Alert Messages */
    .alert {
      padding: 1rem;
      border-radius: var(--border-radius);
      margin-bottom: 1.5rem;
      display: none;
    }
    
    .alert.show {
      display: block;
    }
    
    .alert-success {
      background: var(--success-light);
      color: var(--success-dark);
      border: 1px solid var(--success);
    }
    
    .alert-error {
      background: var(--error-light);
      color: var(--error-dark);
      border: 1px solid var(--error);
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      .signin-container {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 1rem;
      }
      
      .welcome-title {
        font-size: 2rem;
      }
      
      .signin-form-container {
        padding: 1.5rem;
      }
    }
  </style>
</head>

<body class="app-layout">
  <!-- Skip Navigation Link for Accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <!-- Header Container -->
  <div id="header-container" role="banner"></div>

  <!-- Main Application Layout -->
  <div class="estate">
    <!-- Left Navigation Sidebar -->
    <div id="nav-container" role="navigation" aria-label="Main navigation"></div>

    <!-- Main Content Area -->
    <main id="main-content" role="main" tabindex="-1">
      <div class="signin-container">
        
        <!-- Welcome Section -->
        <section class="welcome-section">
          <h1 class="welcome-title">Welcome Back to PMERIT</h1>
          <p class="welcome-subtitle">
            Continue your learning journey with personalized courses, AI-powered career guidance, 
            and access to global opportunities in technology and beyond.
          </p>
          
          <!-- Benefits List -->
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-graduation-cap" aria-hidden="true"></i>
              </div>
              <div class="benefit-content">
                <h3>Personal Dashboard</h3>
                <p>Track your progress, manage courses, and view achievements all in one place.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-robot" aria-hidden="true"></i>
              </div>
              <div class="benefit-content">
                <h3>AI Career Guidance</h3>
                <p>Get personalized career recommendations based on your skills and interests.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-globe" aria-hidden="true"></i>
              </div>
              <div class="benefit-content">
                <h3>Global Opportunities</h3>
                <p>Access job markets in the US, Nigeria, and other countries worldwide.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-certificate" aria-hidden="true"></i>
              </div>
              <div class="benefit-content">
                <h3>Recognized Certificates</h3>
                <p>Earn industry-recognized certificates that boost your career prospects.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Sign In Form -->
        <section class="signin-form-container">
          <div class="form-header">
            <h2 class="form-title">Sign In</h2>
            <p class="form-subtitle">Enter your credentials to access your account</p>
          </div>
          
          <!-- Alert Messages -->
          <div id="alertMessage" class="alert">
            <span id="alertText"></span>
          </div>
          
          <!-- Sign In Form -->
          <form id="signinForm" novalidate>
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
                autocomplete="email"
              >
              <div class="form-error" id="emailError">Please enter a valid email address</div>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                class="form-input" 
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              >
              <div class="form-error" id="passwordError">Password is required</div>
            </div>
            
            <div class="form-options">
              <div class="remember-me">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <label for="rememberMe">Remember me</label>
              </div>
              <a href="/forgot-password.html" class="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" class="submit-btn" id="submitBtn">
              Sign In
            </button>
          </form>
          
          <!-- Social Login -->
          <div class="divider">
            <span>Or continue with</span>
          </div>
          
          <div class="social-login">
            <a href="/auth/google" class="social-btn">
              <i class="fab fa-google" aria-hidden="true"></i>
              Continue with Google
            </a>
            <a href="/auth/microsoft" class="social-btn">
              <i class="fab fa-microsoft" aria-hidden="true"></i>
              Continue with Microsoft
            </a>
          </div>
          
          <!-- Sign Up Link -->
          <div class="signup-link">
            Don't have an account? <a href="/register.html">Create one here</a>
          </div>
        </section>
      </div>
    </main>

    <!-- Right Panel - Help & Support -->
    <aside id="right-panel" role="complementary" aria-label="Help and support">
      
      <!-- Help Section -->
      <section class="help-section">
        <h4>
          <i class="fas fa-question-circle" aria-hidden="true"></i>
          Need Help?
        </h4>
        <div class="help-content">
          <div class="help-item">
            <h5>Forgot Your Password?</h5>
            <p>Click "Forgot Password?" above or contact support for assistance.</p>
          </div>
          
          <div class="help-item">
            <h5>New to PMERIT?</h5>
            <p>Create a free account to start your learning journey today.</p>
            <a href="/register.html" class="btn btn-sm btn-outline">Sign Up Now</a>
          </div>
          
          <div class="help-item">
            <h5>Having Issues?</h5>
            <p>Our support team is here to help you get back to learning.</p>
            <a href="/contact.html" class="btn btn-sm btn-outline">Contact Support</a>
          </div>
        </div>
      </section>

      <!-- Security Info -->
      <section class="security-section">
        <h4>
          <i class="fas fa-shield-alt" aria-hidden="true"></i>
          Secure Sign In
        </h4>
        <div class="security-content">
          <div class="security-item">
            <i class="fas fa-lock" aria-hidden="true"></i>
            <span>256-bit SSL encryption</span>
          </div>
          <div class="security-item">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
            <span>Privacy protected</span>
          </div>
          <div class="security-item">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <span>Secure authentication</span>
          </div>
        </div>
      </section>

    </aside>
  </div>

  <!-- Footer Container -->
  <div id="footer-container" role="contentinfo"></div>

  <!-- Sign In JavaScript -->
  <script>
    /**
     * PMERIT Sign In Handler
     */
    class PMERITSignIn {
      constructor() {
        this.form = document.getElementById('signinForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.initialized = false;
        
        // Wait for boot system to complete
        window.addEventListener('pmerit:initialized', () => {
          this.initialize();
        });
        
        // Fallback initialization
        setTimeout(() => {
          if (!this.initialized) {
            this.initialize();
          }
        }, 2000);
      }

      initialize() {
        if (this.initialized) return;
        
        console.log('[PMERIT] Initializing sign in...');
        
        this.setupFormValidation();
        this.setupFormSubmission();
        this.checkRedirectParams();
        this.checkExistingSession();
        
        this.initialized = true;
        console.log('[PMERIT] ✅ Sign in initialized');
      }

      setupFormValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        // Real-time validation
        emailInput.addEventListener('blur', () => this.validateEmail());
        passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Clear errors on input
        emailInput.addEventListener('input', () => this.clearError('email'));
        passwordInput.addEventListener('input', () => this.clearError('password'));
      }

      setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleSignIn();
        });
      }

      validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
          this.showFieldError('email', 'Email is required');
          return false;
        }
        
        if (!emailRegex.test(email)) {
          this.showFieldError('email', 'Please enter a valid email address');
          return false;
        }
        
        this.clearError('email');
        return true;
      }

      validatePassword() {
        const password = document.getElementById('password').value;
        
        if (!password) {
          this.showFieldError('password', 'Password is required');
          return false;
        }
        
        if (password.length < 6) {
          this.showFieldError('password', 'Password must be at least 6 characters');
          return false;
        }
        
        this.clearError('password');
        return true;
      }

      showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const error = document.getElementById(fieldName + 'Error');
        
        input.classList.add('error');
        error.textContent = message;
        error.classList.add('show');
      }

      clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const error = document.getElementById(fieldName + 'Error');
        
        input.classList.remove('error');
        error.classList.remove('show');
      }

      async handleSignIn() {
        // Validate form
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        
        if (!emailValid || !passwordValid) {
          return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';
        
        try {
          this.setLoading(true);
          
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              email,
              password,
              remember: rememberMe
            })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            this.showAlert('success', 'Welcome back! Redirecting to your dashboard...');
            
            // Redirect after success
            setTimeout(() => {
              const redirectUrl = this.getRedirectUrl() || '/dashboard.html';
              window.location.href = redirectUrl;
            }, 1500);
            
          } else {
            this.showAlert('error', data.message || 'Invalid email or password. Please try again.');
          }
          
        } catch (error) {
          console.error('[PMERIT] Sign in error:', error);
          this.showAlert('error', 'Connection error. Please check your internet and try again.');
        } finally {
          this.setLoading(false);
        }
      }

      setLoading(loading) {
        if (loading) {
          this.submitBtn.disabled = true;
          this.submitBtn.classList.add('loading');
        } else {
          this.submitBtn.disabled = false;
          this.submitBtn.classList.remove('loading');
        }
      }

      showAlert(type, message) {
        const alert = document.getElementById('alertMessage');
        const alertText = document.getElementById('alertText');
        
        alert.className = `alert alert-${type} show`;
        alertText.textContent = message;
        
        // Auto-hide success messages
        if (type === 'success') {
          setTimeout(() => {
            alert.classList.remove('show');
          }, 5000);
        }
      }

      checkRedirectParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        
        if (message === 'session-expired') {
          this.showAlert('error', 'Your session has expired. Please sign in again.');
        } else if (message === 'signup-success') {
          this.showAlert('success', 'Account created successfully! Please sign in.');
        }
      }

      async checkExistingSession() {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });
          
          if (response.ok) {
            // User is already signed in
            const redirectUrl = this.getRedirectUrl() || '/dashboard.html';
            window.location.href = redirectUrl;
          }
        } catch (error) {
          // User not signed in, continue normally
          console.log('[PMERIT] No existing session found');
        }
      }

      getRedirectUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        // Validate redirect URL for security
        if (redirect && redirect.startsWith('/')) {
          return redirect;
        }
        
        return null;
      }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        new PMERITSignIn();
      });
    } else {
      new PMERITSignIn();
    }
  </script>

  <!-- Core JavaScript - Shared Assets -->
  <script src="/assets/nav-config.js"></script>
  <script src="/assets/boot-includes.js"></script>
</body>
</html>
