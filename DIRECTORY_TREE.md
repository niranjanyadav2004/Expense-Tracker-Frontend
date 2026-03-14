# 📊 Complete Directory Tree - Visual Reference

## Frontend Root Directory

```
d:\Niranjan\Expense Tracker Frontend\
│
├── 📚 DOCUMENTATION FILES
│   ├── SETUP_COMPLETE.md ⭐ MAIN OVERVIEW
│   ├── README_DEPLOYMENT.md ⭐ QUICK START (5 MIN)
│   ├── QUICK_REFERENCE.md ⭐ COMMON COMMANDS
│   ├── PROJECT_STRUCTURE.md ⭐ THIS FILE + OVERVIEW
│   ├── BEFORE_AFTER_COMPARISON.md (Why it's better)
│   ├── DEPLOYMENT_UPDATED.md (Complete guide)
│   ├── DEPLOYMENT_EXAMPLES.md (Platform-specific)
│   ├── RUNTIME_CONFIG_GUIDE.md (Deep dive)
│   ├── CONFIG_SUMMARY.md (Architecture)
│   ├── QUICK_DEPLOY.md (Quick ref - old)
│   ├── IMPLEMENTATION_SUMMARY.md (Existing)
│   └── README.md (Existing project readme)
│
├── 🔧 CONFIGURATION (Root Level)
│   ├── .env.example (Environment template)
│   ├── .env.local (Development - update for local dev)
│   ├── .env.production (Production fallback)
│   ├── .env.staging (Staging fallback)
│   ├── .gitignore (NEW - prevents secrets in git)
│   ├── vite.config.ts (Build config - UPDATED)
│   ├── tsconfig.json (TypeScript config)
│   ├── tsconfig.node.json (Node TypeScript config)
│   ├── package.json (Dependencies - UPDATED with build scripts)
│   ├── package-lock.json or yarn.lock
│   ├── index.html (HTML entry point)
│   └── IMPLEMENTATION_SUMMARY.md
│
├── 📂 public/ (Static Files - Served by Web Server)
│   ├── config.json ⭐ RUNTIME CONFIG (CHANGE THIS!)
│   ├── config.production.json (Template)
│   ├── config.staging.json (Template)
│   ├── config.development.json (Template)
│   ├── README.md (Config documentation)
│   └── [other assets]
│
├── 📂 src/ (Source Code)
│   │
│   ├── 🔧 CONFIG & API (NEW CENTRALIZED SYSTEM)
│   │   ├── config.ts ⭐ CENTRALIZED CONFIG
│   │   │   ├── loadRuntimeConfig() - Load config.json at startup
│   │   │   ├── getConfig() - Get current config
│   │   │   ├── updateConfig() - Update config at runtime (dev)
│   │   │   └── Fallback chain explained
│   │   │
│   │   └── api/ (All API Functions)
│   │       ├── axiosInstance.ts ⭐ SHARED HTTP CLIENT (NEW)
│   │       │   ├── Creates axios instance
│   │       │   ├── Request interceptor (JWT token)
│   │       │   ├── Response interceptor (error handling)
│   │       │   └── Loaded from config.api.baseURL
│   │       │
│   │       ├── authApi.ts (UPDATED - uses axiosInstance)
│   │       │   ├── register()
│   │       │   ├── login()
│   │       │   ├── forgotPassword()
│   │       │   ├── refreshToken()
│   │       │   └── logout()
│   │       │
│   │       ├── bankApi.ts (UPDATED - uses axiosInstance)
│   │       │   ├── create()
│   │       │   ├── getAll()
│   │       │   ├── getByBankName()
│   │       │   ├── getByAccountNumber()
│   │       │   ├── update()
│   │       │   └── delete()
│   │       │
│   │       ├── expenseApi.ts (UPDATED - uses axiosInstance)
│   │       │   ├── create()
│   │       │   ├── getAll()
│   │       │   ├── getById()
│   │       │   ├── getByBank()
│   │       │   ├── update()
│   │       │   └── delete()
│   │       │
│   │       ├── incomeApi.ts (UPDATED - uses axiosInstance)
│   │       │   ├── create()
│   │       │   ├── getAll()
│   │       │   ├── getById()
│   │       │   ├── getByBank()
│   │       │   ├── update()
│   │       │   └── delete()
│   │       │
│   │       ├── transferApi.ts (UPDATED - uses axiosInstance)
│   │       │   ├── create()
│   │       │   ├── getByBankName()
│   │       │   ├── getAll()
│   │       │   ├── update()
│   │       │   └── delete()
│   │       │
│   │       └── statsApi.ts (UPDATED - uses axiosInstance)
│   │           ├── getOverallStats()
│   │           └── getBankStats()
│   │
│   ├── 📄 MAIN APP FILES
│   │   ├── main.tsx (UPDATED - calls loadRuntimeConfig())
│   │   ├── App.tsx (Main React component)
│   │   ├── App.test.tsx (Tests)
│   │   ├── index.css (Global styles)
│   │   │
│   │   ├── 🎨 COMPONENTS/ (React UI Components)
│   │   │   ├── ActivityCalendar.tsx / .css
│   │   │   ├── Analytics.tsx / .css
│   │   │   ├── BankManagement.tsx / .css
│   │   │   ├── ConfirmationModal.tsx / .css
│   │   │   ├── Dashboard.tsx / .css
│   │   │   ├── ExpenseForm.tsx / .css
│   │   │   ├── ExpenseList.tsx / .css
│   │   │   ├── ForgotPassword.tsx / .css
│   │   │   ├── IncomeForm.tsx / .css
│   │   │   ├── IncomeList.tsx / .css
│   │   │   ├── Landing.tsx / .css
│   │   │   ├── Login.tsx / .css
│   │   │   ├── Navigation.tsx / .css
│   │   │   ├── Profile.tsx / .css
│   │   │   ├── ProfileModal.tsx / .css
│   │   │   ├── ResetPassword.tsx / .css
│   │   │   ├── Settings.tsx / .css
│   │   │   ├── Signup.tsx / .css
│   │   │   ├── ThemeToggle.tsx / .css
│   │   │   ├── TransferForm.tsx / .css
│   │   │   └── TransferList.tsx / .css
│   │   │
│   │   ├── 🎯 CONTEXT/ (React Context Providers)
│   │   │   └── ThemeContext.tsx (Theme management)
│   │   │
│   │   ├── 🎨 STYLES/
│   │   │   └── theme.css (Theme definitions)
│   │   │
│   │   └── 📋 TYPES/
│   │       └── index.ts (TypeScript type definitions)
│   │
│   └── [Other source files]
│
├── 📂 dist/ (BUILD OUTPUT - Generated by npm run build)
│   ├── config.json ⭐ COPY/UPDATE THIS BEFORE DEPLOYMENT!
│   │   {
│   │     "api": {
│   │       "baseURL": "https://your-backend-api.com/api"
│   │     },
│   │     "environment": "production",
│   │     "debug": false
│   │   }
│   │
│   ├── index.html (SPA entry point - served to all routes)
│   │
│   ├── 📂 assets/ (Bundled & optimized files)
│   │   ├── index.HASH.js (Minified JavaScript)
│   │   ├── index.HASH.css (Minified CSS)
│   │   └── [other optimized assets]
│   │
│   ├── favicon.ico
│   └── [other static files]
│
├── 📂 node_modules/ (Dependencies - in .gitignore)
│   ├── react/
│   ├── axios/
│   ├── recharts/
│   ├── vite/
│   └── [other npm packages]
│
└── 📂 .git/ (Git repository)
    ├── hooks/
    ├── objects/
    ├── refs/
    └── config
```

---

## Key Files Summary

### Must Understand

```
1. public/config.json
   ├─ Runtime configuration
   ├─ Loaded at app startup
   ├─ Change backend URL by editing this
   └─ NO rebuild needed!

2. src/config.ts
   ├─ Loads config.json at runtime
   ├─ Manages configuration state
   ├─ Exports getConfig() and updateConfig()
   └─ Merges build-time & runtime configs

3. src/main.tsx
   ├─ Calls loadRuntimeConfig() before rendering
   ├─ Waits for config to load
   ├─ Renders React app once ready
   └─ Handles errors gracefully

4. api/axiosInstance.ts
   ├─ Single shared HTTP client
   ├─ All API modules use this
   ├─ Configured once
   └─ Updated baseURL from config at runtime

5. dist/config.json (After build)
   ├─ The file you deploy
   ├─ Update before or after deployment
   ├─ Served by web server
   └─ NOT cached (fresh each time)
```

---

## Configuration Cascade

```
Environment Variables (.env files)
  ↓ (At build time)
src/config.ts (BUILD_TIME_API_URL, etc.)
  ↓ (At runtime)
Fetch public/config.json
  ↓
Apply to RUNTIME_CONFIG
  ↓
Check window.appConfig (if exists)
  ↓
Final configuration ready
  ↓
axiosInstance uses config.api.baseURL
  ↓
All API calls use runtime-configured URL
```

---

## Build Output Structure

```
Before Deploy:
npm run build
  ↓
Creates dist/ containing:
├─ config.json (you edit this!)
├─ index.html
└─ assets/
    └─ minified js, css, etc

What to upload to server:
- Everything in dist/ folder

What you can update after upload:
- dist/config.json (just this file!)
```

---

## File Update Map

### Changed/New Files

| File | Status | Reason |
|------|--------|--------|
| src/config.ts | 🆕 New | Centralized config management |
| src/api/axiosInstance.ts | 🆕 New | Shared HTTP client |
| src/main.tsx | ✏️ Updated | Load config before rendering |
| src/api/authApi.ts | ✏️ Updated | Use shared axiosInstance |
| src/api/expenseApi.ts | ✏️ Updated | Use shared axiosInstance |
| src/api/bankApi.ts | ✏️ Updated | Use shared axiosInstance |
| src/api/incomeApi.ts | ✏️ Updated | Use shared axiosInstance |
| src/api/transferApi.ts | ✏️ Updated | Use shared axiosInstance |
| src/api/statsApi.ts | ✏️ Updated | Use shared axiosInstance |
| vite.config.ts | ✏️ Updated | Build optimizations |
| package.json | ✏️ Updated | Build scripts |
| .env.local | ✏️ Updated | Development config |
| .env.production | 🆕 New | Production fallback |
| .env.staging | 🆕 New | Staging fallback |
| .gitignore | 🆕 New | Prevent secrets in git |
| public/config.json | 🆕 New | Runtime configuration |
| public/config.*.json | 🆕 New | Environment templates |

### Unchanged Files

- src/components/* (All components)
- src/types/* (Type definitions)
- src/context/* (Context providers)
- src/styles/* (Stylesheets)
- tsconfig.json (TypeScript config)
- index.html (Entry point)

---

## Deployment Workflow

```
1. npm run build
   └─ Creates dist/

2. Update dist/config.json
   ├─ Set api.baseURL to your backend
   └─ env = production, debug = false

3. Upload dist/ to hosting
   ├─ All files go to web root
   ├─ Includes config.json
   └─ Ensure web server serves it publicly

4. Verify deployment
   ├─ Open app in browser
   ├─ Press F12 → Console
   ├─ Should see config loading message
   └─ Config shows correct backend URL

5. Test API
   ├─ Try login or any API call
   ├─ Check Network tab
   └─ Verify request goes to correct URL

Done! 🎉
```

---

## Common Operations

### Change Backend URL

```
Edit dist/config.json:
{
  "api": {
    "baseURL": "https://new-backend.com/api"  ← Change this
  }
}

Upload to server: Done! No rebuild.
```

### Debug Configuration

```
Browser Console:
> import { getConfig } from './src/config'
> getConfig()
// Shows currently loaded config
```

### Add New Environment

```
1. Create public/config.xyz.json
2. Copy when deploying to XYZ environment
3. Update dist/config.json with env-specific URL
4. Deploy dist/
5. Done!
```

---

## That's Your Complete Frontend! 🎉

With this structure:
- ✅ One build for all environments
- ✅ Runtime-configurable backend URL
- ✅ Enterprise-ready deployment
- ✅ Fast, optimized production build
- ✅ Well-organized code
- ✅ Comprehensive documentation

See **README_DEPLOYMENT.md** to start deploying! 🚀
