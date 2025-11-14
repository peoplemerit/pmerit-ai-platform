# PMERIT AI Disclaimer

**For In-App Display**  
**Version:** 1.0  
**Last Updated:** November 13, 2025

---

## 🤖 About PMERIT AI

Before you start chatting with our AI assistant, please read this important information.

---

## ⚠️ What You Should Know

### AI-Generated Responses
- All responses are **automatically generated** by AI (Meta's Llama 3.1)
- AI may make **mistakes** or provide **outdated information**
- **Always verify** important information independently

### Not Professional Advice
PMERIT AI is **NOT** a substitute for:
- ❌ Medical advice or diagnosis
- ❌ Legal counsel or representation  
- ❌ Financial or investment advice
- ❌ Professional career counseling
- ❌ Emergency services

### Your Responsibility
- ✓ You are **fully responsible** for decisions based on AI responses
- ✓ Use AI guidance as **informational only**
- ✓ Verify critical information with professionals
- ✓ Understand AI has limitations and biases

---

## 🔒 Your Privacy

### What We Collect
- Your messages and conversation context
- Usage data (anonymized)
- Session information

### What We DON'T Do
- ✗ Use your data to train AI models
- ✗ Share conversations with third parties
- ✗ Sell your data
- ✗ Store conversations after your session ends

**Full details:** See our [AI Privacy Policy](/docs/legal/AI_PRIVACY_POLICY.md)

---

## 📋 Terms of Use

By clicking "I Accept" or using PMERIT AI:

1. ✓ You agree to our [AI Terms of Service](/docs/legal/AI_TERMS_OF_SERVICE.md)
2. ✓ You confirm you are **13 years or older**
3. ✓ You understand AI limitations and potential errors
4. ✓ You accept **full responsibility** for your decisions

---

## 💡 Best Practices

To get the most from PMERIT AI:

- ✅ **Be specific** in your questions
- ✅ **Ask follow-ups** for clarification
- ✅ **Fact-check** important information
- ✅ **Use responsibly** for educational purposes
- ❌ **Don't share** sensitive personal information
- ❌ **Don't rely solely** on AI for critical decisions

---

## 🎯 Our AI Features

**PMERIT Assistant** - General platform guidance  
**PMERIT Support** - Customer service help  
**Professor Merit** - Virtual tutoring  
**PMERIT Insight** - Personality assessments  
**PMERIT Pathfinder** - Career recommendations

---

## 📞 Need Help?

- **Support:** support@pmerit.com
- **Privacy:** privacy@pmerit.com
- **Website:** https://pmerit.com/support

---

## ✅ Acceptance Required

**By using PMERIT AI, you acknowledge:**

- I have read and understood this disclaimer
- I agree to the AI Terms of Service
- I understand AI may make errors
- I will verify important information
- I accept responsibility for my decisions
- I am 13 years or older

---

## 📱 Modal Implementation

### Frontend Display Requirements

**When to Show:**
- First time user interacts with any AI feature
- Once per user (store acceptance in localStorage)
- Show again if terms are updated

**Modal Design:**
\\\
┌─────────────────────────────────────────┐
│  ⚠️  Important: About PMERIT AI          │
├─────────────────────────────────────────┤
│                                         │
│  [Scrollable content from above]        │
│                                         │
│  • AI may make mistakes                 │
│  • Not professional advice              │
│  • You are responsible for decisions    │
│  • We protect your privacy              │
│                                         │
├─────────────────────────────────────────┤
│  [ ] I am 13 years or older             │
│  [ ] I accept the AI Terms of Service   │
│                                         │
│  [Cancel]  [I Accept and Continue]      │
└─────────────────────────────────────────┘
\\\

**Button State:**
- "I Accept" button **disabled** until both checkboxes checked
- Store acceptance: \localStorage.setItem('pmerit_ai_disclaimer_accepted', 'v1.0')\
- Check on load: \localStorage.getItem('pmerit_ai_disclaimer_accepted') === 'v1.0'\

**Links:**
- Link "AI Terms of Service" to full document
- Link "AI Privacy Policy" to full document
- Open links in new tab/modal

---

## 🔄 Version Control

**Current Version:** 1.0  
**Version History:**
- v1.0 (Nov 13, 2025) - Initial release

**When to Update:**
- New AI features added
- Terms of Service changes
- Privacy policy updates
- Regulatory requirements change

**How to Update:**
1. Increment version number
2. Update localStorage key (\1.1\, \1.2\, etc.)
3. Force re-acceptance for existing users
4. Notify via email if material changes

---

*Last Updated: November 13, 2025*  
*Version: 1.0*