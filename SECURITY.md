# Security Policy

## 🔒 Reporting a Vulnerability

If you discover a security vulnerability in Natly, please report it responsibly:

**📧 Email:** security@natly.org

**❌ DO NOT:**
- Create a public GitHub issue
- Disclose the vulnerability publicly before it's fixed
- Exploit the vulnerability

**✅ DO:**
- Provide detailed steps to reproduce the issue
- Include the impact and severity assessment
- Give us reasonable time to fix it before disclosure

We will acknowledge your report within 48 hours and provide a timeline for the fix.

---

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Yes             |
| < 1.0   | ❌ No              |

---

## 🔐 Security Measures

Natly implements the following security practices:

### **Authentication & Authorization**
- ✅ JWT tokens for email confirmation/unsubscribe
- ✅ Token expiration (24 hours for confirmation)
- ✅ Secure token generation (crypto.randomBytes)

### **API Security**
- ✅ Rate limiting (3 requests/hour per IP)
- ✅ Input validation with Zod schemas
- ✅ Honeypot anti-bot protection
- ✅ CORS configured for production domain only

### **Data Protection**
- ✅ Environment variables for all secrets
- ✅ No secrets in Git history
- ✅ Supabase Row Level Security (RLS)
- ✅ Service role key only in Netlify backend

### **Infrastructure**
- ✅ HTTPS only (enforced by Netlify)
- ✅ Serverless functions (isolated execution)
- ✅ Automatic dependency updates (Dependabot)
- ✅ CI/CD with automated testing (97 tests)

### **Code Quality**
- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ 89% test coverage
- ✅ Integration tests for critical paths

---

## 🚨 Known Limitations

- Rate limiting is IP-based (can be bypassed with VPN/proxy)
- Email confirmation links valid for 24 hours
- Newsletter unsubscribe is permanent (no re-subscription flow yet)

---

## 📜 Security Compliance

- **GDPR**: Users can unsubscribe anytime
- **CAN-SPAM**: Unsubscribe link in every email
- **Accessibility**: WCAG 2.1 AA compliant

---

## 🔄 Updates

This security policy was last updated: **[Current Date]**

Check back regularly for updates to our security practices.