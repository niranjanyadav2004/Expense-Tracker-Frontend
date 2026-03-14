# 📁 Project Structure - Complete Overview

## Root Directory Structure

```
Expense Tracker Frontend/
├── 📖 Documentation Files (New)
│   ├── SETUP_COMPLETE.md              ⭐ Start here - overview of everything
│   ├── README_DEPLOYMENT.md           ⭐ Quick 5-minute deployment guide
│   ├── QUICK_REFERENCE.md             ⭐ Common commands & scenarios
│   ├── DEPLOYMENT_UPDATED.md          Complete deployment guide
│   ├── DEPLOYMENT_EXAMPLES.md         Platform-specific examples
│   ├── RUNTIME_CONFIG_GUIDE.md        Runtime configuration details
│   ├── BEFORE_AFTER_COMPARISON.md    Why this is better
│   ├── CONFIG_SUMMARY.md              Configuration system architecture
│   ├── IMPLEMENTATION_SUMMARY.md      (Existing)
│   ├── README.md                      (Existing)
│   └── QUICK_DEPLOY.md                (Existing)
│
├── 🔧 Configuration Files
│   ├── .env.local                     ← Development config
│   ├── .env.production                ← Production fallback
│   ├── .env.staging                   ← Staging fallback
│   ├── .env.example                   ← Template
│   ├── .gitignore                     ← Prevents committing secrets
│   ├── vite.config.ts                 ← Build configuration (updated)
│   ├── tsconfig.json                  (Existing)
│   ├── tsconfig.node.json             (Existing)
│   ├── package.json                   ← Updated with build scripts
│   └── index.html                     (Existing)
│
├── 📂 public/
│   ├── config.json                    ⭐ Runtime config (loaded at startup)
│   ├── config.production.json         Production template
│   ├── config.staging.json            Staging template
│   ├── config.development.json        Development template
│   └── README.md                      Config file documentation
│
├── 📂 src/
│   ├── 🔌 Configuration & API
│   │   ├── config.ts                  ⭐ Centralized configuration
│   │   ├── api/
│   │   │   ├── axiosInstance.ts       ⭐ Shared HTTP client
│   │   │   ├── authApi.ts             Updated - uses axiosInstance
│   │   │   ├── bankApi.ts             Updated - uses axiosInstance
│   │   │   ├── expenseApi.ts          Updated - uses axiosInstance
│   │   │   ├── incomeApi.ts           Updated - uses axiosInstance
│   │   │   ├── statsApi.ts            Updated - uses axiosInstance
│   │   │   └── transferApi.ts         Updated - uses axiosInstance
│   │   │
│   │   ├── 📄 Core Files
│   │   ├── main.tsx                   Updated - calls loadRuntimeConfig()
│   │   ├── App.tsx                    (Existing)
│   │   ├── App.test.tsx               (Existing)
│   │   ├── index.css                  (Existing)
│   │   │
│   │   ├── 🎨 Components
│   │   ├── components/
│   │   │   ├── ActivityCalendar.tsx   (Existing)
│   │   │   ├── Analytics.tsx          (Existing)
│   │   │   ├── BankManagement.tsx     (Existing)
│   │   │   ├── Dashboard.tsx          (Existing)
│   │   │   ├── ExpenseForm.tsx        (Existing)
│   │   │   ├── ExpenseList.tsx        (Existing)
│   │   │   ├── IncomeForm.tsx         (Existing)
│   │   │   ├── IncomeList.tsx         (Existing)
│   │   │   ├── Login.tsx              (Existing)
│   │   │   ├── Navigation.tsx         (Existing)
│   │   │   ├── TransferForm.tsx       (Existing)
│   │   │   └── ... and more
│   │   │
│   │   ├── 🎨 Styles & Theme
│   │   ├── context/
│   │   │   └── ThemeContext.tsx       (Existing)
│   │   ├── styles/
│   │   │   └── theme.css              (Existing)
│   │   │
│   │   ├── 📋 Type Definitions
│   │   └── types/
│   │       └── index.ts               (Existing)
│   │
│   └── 📦 CSS Files (One per component)
│       ├── components/ActivityCalendar.css
│       ├── components/Analytics.css
│       ├── components/BankManagement.css
│       ├── components/Dashboard.css
│       ├── components/ExpenseForm.css
│       ├── etc...
│
└── 📦 dist/
    ├── config.json                    ← UPDATE THIS to change backend!
    ├── index.html
    ├── assets/
    │   ├── index.HASH.js
    │   ├── index.HASH.css
    │   └── ... minified/compressed files
    └── ... built files
```

## What Changed

### ✨ New Files Created

#### Core Infrastructure
- **`src/config.ts`** - Centralized configuration with `loadRuntimeConfig()` function
- **`src/api/axiosInstance.ts`** - Shared axios instance with interceptors

#### Runtime Configuration
- **`public/config.json`** - Default/loaded at runtime (change this!)
- **`public/config.production.json`** - Production template
- **`public/config.staging.json`** - Staging template
- **`public/config.development.json`** - Development template
- **`public/README.md`** - Config file documentation

#### Environment Files
- **`.env.production`** - Production build fallback
- **`.env.staging`** - Staging build fallback
- **`.gitignore`** - Prevents committing secrets

#### Documentation Files
- **`SETUP_COMPLETE.md`** - Complete overview
- **`README_DEPLOYMENT.md`** - Quick start guide
- **`QUICK_REFERENCE.md`** - Common commands
- **`DEPLOYMENT_UPDATED.md`** - Full deployment guide
- **`DEPLOYMENT_EXAMPLES.md`** - Platform-specific examples
- **`RUNTIME_CONFIG_GUIDE.md`** - Runtime config details
- **`BEFORE_AFTER_COMPARISON.md`** - Why this is better
- **`CONFIG_SUMMARY.md`** - Architecture explanation

### 🔄 Updated Files

#### Configuration System
- **`vite.config.ts`** - Added build optimizations and proxy config
- **`package.json`** - Added build scripts and config settings

#### Main Entry Point
- **`src/main.tsx`** - Calls `loadRuntimeConfig()` before rendering

#### API Modules (All 6 files)
- **`src/api/authApi.ts`** - Now uses `apiClient` from axiosInstance
- **`src/api/expenseApi.ts`** - Now uses `apiClient` from axiosInstance
- **`src/api/bankApi.ts`** - Now uses `apiClient` from axiosInstance
- **`src/api/incomeApi.ts`** - Now uses `apiClient` from axiosInstance
- **`src/api/transferApi.ts`** - Now uses `apiClient` from axiosInstance
- **`src/api/statsApi.ts`** - Now uses `apiClient` from axiosInstance

---

## File Purposes Quick Reference

### Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `.env.local` | Dev environment variables | Running locally with different backend |
| `.env.production` | Production build fallback | Need different fallback for production |
| `.env.staging` | Staging build fallback | Need different fallback for staging |
| `public/config.json` | Runtime config (primary) | Deploying to production |
| `public/config.production.json` | Production template | Creating production config |
| `public/config.staging.json` | Staging template | Creating staging config |

### Code Files

| File | Purpose | Key Change |
|------|---------|-----------|
| `src/config.ts` | Load & manage configuration | New - centralized config |
| `src/main.tsx` | App entry point | Now calls loadRuntimeConfig() |
| `src/api/axiosInstance.ts` | Shared HTTP client | New - single instance for all |
| All `src/api/*.ts` | API calls | Updated to use shared instance |

### Documentation Files

| File | When to Read |
|------|--------------|
| `SETUP_COMPLETE.md` | **Start here** - overview of changes |
| `README_DEPLOYMENT.md` | Want quick 5-minute deployment guide |
| `QUICK_REFERENCE.md` | Need common commands |
| `DEPLOYMENT_UPDATED.md` | Need complete deployment instructions |
| `DEPLOYMENT_EXAMPLES.md` | Need platform-specific examples |
| `RUNTIME_CONFIG_GUIDE.md` | Want deep dive into runtime config |
| `BEFORE_AFTER_COMPARISON.md` | Want to understand why this is better |
| `CONFIG_SUMMARY.md` | Want system architecture details |

---

## Deployment File Locations

### After Build (npm run build)

```
dist/
├── config.json                    ⭐ UPDATE BEFORE/AFTER DEPLOYMENT
│   (This single file controls your backend URL!)
│   {
│     "api": {
│       "baseURL": "https://your-api.com"
│     }
│   }
│
├── index.html                     (SPA entry point)
├── assets/
│   ├── index.HASH.js             (Your compiled app - minified/compressed)
│   └── index.HASH.css            (Your compiled styles - minified/compressed)
│
└── ... other assets
```

---

## Key Directory Functions

### `src/api/`
**Purpose**: All API communication  
**Changes**: Removed duplicate configuration, now uses shared `axiosInstance`  
**Files**: `axiosInstance.ts` (new) + 6 API modules (updated)

### `src/config.ts`
**Purpose**: Centralized configuration management  
**Responsibility**: 
- Load runtime config from `config.json`
- Fallback to build-time env variables
- Allow script injection overrides
- Export `getConfig()` and `updateConfig()`

### `public/`
**Purpose**: Static files served by web server  
**Key File**: `config.json` - This gets loaded at runtime!  
**Rationale**: Separate from bundled code, can be updated anytime

### `public/` Config Templates
**Purpose**: Reference files for different environments  
**How Used**: Copy to `dist/config.json` before deployment  
**Benefit**: Version control templates, don't commit actual configs

---

## Configuration Loading Priority

```
1. Highest Priority: window.appConfig (if set by server)
   ├─ Set via script tag or middleware
   └─ Useful for advanced server injection
   
2. Middle Priority: public/config.json (loaded at runtime)
   ├─ Fetched fresh on each app startup
   ├─ Not cached (cache: 'no-store')
   └─ PRIMARY way to configure
   
3. Lowest Priority: VITE_API_URL (environment variable at build time)
   ├─ From .env.production / .env.staging
   ├─ Built into the app
   └─ Fallback if config.json not found
```

---

## The Most Important File

### `public/config.json`

This is the file you update to change your backend URL:

```json
{
  "api": {
    "baseURL": "https://your-backend-api.com/api"  ← CHANGE THIS
  },
  "environment": "production",
  "debug": false
}
```

**To update it:**
```bash
# Option 1: Direct edit on server
ssh user@server
nano /var/www/config.json

# Option 2: Upload from local machine
scp config.json user@server:/var/www/

# Option 3: Edit via hosting dashboard/console
# AWS S3, Google Cloud Storage, Netlify, Vercel, etc.
```

**When to update:**
- Backend server moves
- API endpoint changes
- Deploying to different environment
- Need to switch to different backend

**After updating:**
- Users see new URL on next page load (within 1-2 seconds)
- No rebuild needed
- No redeploy needed
- No downtime

---

## Reading Guide by Goal

### Goal: Deploy Now
1. Read: `README_DEPLOYMENT.md`
2. Run: `npm run build`
3. Edit: `dist/config.json`
4. Deploy: Your platform

### Goal: Understand Everything
1. Start: `SETUP_COMPLETE.md`
2. Deep dive: `RUNTIME_CONFIG_GUIDE.md`
3. See examples: `DEPLOYMENT_EXAMPLES.md`
4. Compare before/after: `BEFORE_AFTER_COMPARISON.md`

### Goal: Deploy to Specific Platform
1. Read: `DEPLOYMENT_EXAMPLES.md`
2. Find your platform section
3. Follow instructions
4. Don't forget to update `config.json`!

### Goal: Troubleshoot
1. Check: Browser console for config loading messages
2. Verify: `config.json` is accessible and readable
3. See: `DEPLOYMENT_UPDATED.md` troubleshooting section
4. Test: `npm run preview` locally first

---

## Summary: What You Have Now

✅ **One build for all environments** - `npm run build` happens once  
✅ **Runtime configuration** - Update `config.json` anytime  
✅ **No hardcoded URLs** - Backend URL is externalized  
✅ **Enterprise-ready** - Professional deployment setup  
✅ **Well-documented** - 8+ guides covering everything  
✅ **Scalable** - Works for single server to global CDN  
✅ **Fast deployment** - No rebuild needed after initial build  

---

## Next Steps

1. **Build**: `npm run build`
2. **Configure**: Edit `dist/config.json` with your backend URL
3. **Verify**: Check `dist/config.json` has correct format
4. **Deploy**: Upload `dist/` folder to your hosting
5. **Test**: Open app and check browser console
6. **Monitor**: Watch for errors/API calls

**You're ready to deploy!** 🚀

---

See **README_DEPLOYMENT.md** or **QUICK_REFERENCE.md** for next steps.
