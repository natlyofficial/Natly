# Supabase Keep-Alive System

## 📋 Overview

Automated system that prevents Supabase (free tier) from pausing after 7 days of inactivity. Executes a simple ping every 6 days via GitHub Actions.

---

## 🏗️ Architecture

### Components:

1. **Netlify Function** (`netlify/functions/ping.ts`)
   - Endpoint: `https://api-natly.netlify.app/.netlify/functions/ping`
   - Method: `GET`
   - Authentication: Bearer token
   - Action: Simple query to Supabase

2. **GitHub Actions Workflow** (`.github/workflows/keep-supabase-alive.yml`)
   - Trigger: Cron (every 6 days at 3:00 AM UTC)
   - Manual trigger: `workflow_dispatch`
   - Action: Calls ping endpoint with authentication

3. **Environment Variables**
   - `PING_SECRET`: Shared token between GitHub and Netlify

---

## ⚙️ Initial Setup

### 1. Generate Secret

```bash
# Generate a secure random token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (e.g., `a1b2c3d4e5f6...`)

---

### 2. Configure GitHub Secret

1. Go to: `https://github.com/natlyofficial/Natly/settings/secrets/actions`
2. Click **"New repository secret"**
3. Configure:
    Name: PING_SECRET
    Secret: [pega el token generado]

4. Click **"Add secret"**

---

### 3. Configure Netlify Environment Variable

1. Go to: `https://app.netlify.com/sites/api-natly/configuration/deploys#environment-variables`
2. Click **"Add variable"**
3. Configure:
    Name: PING_SECRET
    Secret: [pega el token generado]
4. Click **"Save"**

---

### 4. Deploy

```bash
git add .github/workflows/keep-supabase-alive.yml netlify/functions/ping.ts
git commit -m "feat: add Supabase keep-alive system"
git push origin main
```

Wait 1-2 minutes for Netlify to deploy the function.

---

## 🧪 Testing

### Option 1: Manual Trigger in GitHub Actions (RECOMMENDED)

1. Go to: `https://github.com/natlyofficial/Natly/actions/workflows/keep-supabase-alive.yml`
2. Click **"Run workflow"** (right button)
3. Select branch: **main**
4. Click **"Run workflow"** (green button)
5. Wait 10-20 seconds
6. Check the result:
   - ✅ **Green** = Working correctly
   - ❌ **Red** = Error (check logs)

**To view detailed logs:**
- Click on the executed workflow
- Click on the "ping" job
- Expand each step to see output

---

### Option 2: Test with cURL (Local)

```bash
# Replace YOUR_SECRET with your PING_SECRET
curl -H "Authorization: Bearer YOUR_SECRET" \
  https://api-natly.netlify.app/.netlify/functions/ping
```

**Expected response (success):**

```json
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "timestamp": "2026-05-06T18:30:45.123Z"
}
```

**Error responses:**

```json
// Missing/incorrect authentication
{
  "error": "Unauthorized"
}

// Supabase error
{
  "success": false,
  "error": "Database query failed",
  "details": "..."
}
```

---

### Option 3: Verify in Netlify Function Logs

1. Go to: `https://app.netlify.com/sites/api-natly/functions/ping`
2. Check **"Function log"**
3. Look for entries like:
    Keep Supabase Alive
    Keep Supabase Alive #1: Manually run by natlyofficial
    main	
    Today at 6:00 PM
    9s

---

## 📅 Automatic Schedule

### Current Configuration:

```yaml
schedule:
  - cron: '0 3 */6 * *'  # Every 6 days at 3:00 AM UTC
```

### Next Executions (from May 6, 2026):

| Date | Time (UTC) | Time (Michigan ET) |
|------|------------|---------------------|
| May 12 | 03:00 | 23:00 (May 11) |
| May 18 | 03:00 | 23:00 (May 17) |
| May 24 | 03:00 | 23:00 (May 23) |
| May 30 | 03:00 | 23:00 (May 29) |

**Note:** Supabase pauses after **7 days** of inactivity. Pinging every **6 days** ensures it never pauses.

---

## 🔍 Monitoring

### Check System Status:

1. **GitHub Actions History:**
   - `https://github.com/natlyofficial/Natly/actions/workflows/keep-supabase-alive.yml`
   - You should see executions every 6 days with ✅

2. **Netlify Function Analytics:**
   - `https://app.netlify.com/sites/api-natly/functions`
   - Look for `ping` invocations

3. **Supabase Dashboard:**
   - `https://supabase.com/dashboard/project/etutawclisojjdxtuctk`
   - Should not show pause message

---

## 🔒 Security

### Implemented Protections:

- ✅ **Authentication required:** Bearer token in Authorization header
- ✅ **Shared secret:** Same value in GitHub and Netlify
- ✅ **CORS configured:** Only accepts authorized requests
- ✅ **Secure service role key:** Only in Netlify env vars (never in git)
- ✅ **Monitored logs:** All calls are logged

### Secret Rotation (Recommended annually):

```bash
# 1. Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Update in GitHub Secrets
# 3. Update in Netlify Environment Variables
# 4. Manual trigger to validate
```

---

## 🐛 Troubleshooting

### Error: "Unauthorized"

**Cause:** `PING_SECRET` doesn't match or is missing.

**Solution:**
1. Verify both secrets are **exactly the same**
2. No leading/trailing spaces
3. Redeploy Netlify if you updated the env var

---

### Error: "Database query failed"

**Cause:** Supabase is paused or connection issue.

**Solution:**
1. Go to Supabase Dashboard
2. Reactivate project if paused
3. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

---

### Workflow doesn't run automatically

**Cause:** GitHub Actions requires recent repo activity.

**Solution:**
- Scheduled workflows deactivate if repo has no commits for 60 days
- Make a commit every ~50 days or occasional manual trigger

---

## 📊 Success Metrics

### KPIs:

- ✅ **Supabase uptime:** 100% (no pauses)
- ✅ **Successful executions:** >95% (last month)
- ✅ **Ping response time:** <500ms average
- ✅ **Authentication errors:** 0

### Monthly Monitoring:

1. Review GitHub Actions history
2. Verify Netlify function logs
3. Confirm Supabase never paused

---

## 🔄 Maintenance

### Monthly:
- ✅ Review GitHub Actions logs
- ✅ Verify no accumulated errors

### Quarterly:
- ✅ Validate workflow is still active
- ✅ Review Netlify Functions metrics

### Annually:
- ✅ Rotate `PING_SECRET`
- ✅ Update dependencies (`@supabase/supabase-js`, `@netlify/functions`)
- ✅ Review Supabase logs for patterns

---

## 📝 Changelog

### v1.0.0 - 2026-05-06
- ✅ Initial implementation
- ✅ GitHub Actions workflow (cron every 6 days)
- ✅ Netlify ping function
- ✅ Authentication with PING_SECRET
- ✅ Comprehensive logging
- ✅ Manual trigger support

---

## 🔗 References

- **Supabase Pausing Policy:** https://supabase.com/docs/guides/platform/going-into-production
- **GitHub Actions Cron Syntax:** https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
- **Netlify Functions Docs:** https://docs.netlify.com/functions/overview/

---

## 📧 Contact

For issues or questions about this system:
- GitHub Issues: `https://github.com/natlyofficial/Natly/issues`
- Email: `contact@natly.org`

---

**Last updated:** May 6, 2026  
**Maintained by:** Olaff (natlyofficial)