# Configuration System - Summary of Changes

## Overview
The Expense Tracker Frontend has been refactored to use a **centralized configuration system** that makes deployment across different environments simple and maintainable.

## What Changed

### 1. New Files Created

#### Core Configuration
- **`src/config.ts`** - Main configuration file that exports API settings
  - Reads `VITE_API_URL` environment variable
  - Exports configuration object used by all API modules
  - Logs environment info on startup

- **`src/api/axiosInstance.ts`** - Centralized HTTP client
  - Single axios instance shared by all API modules
  - Configured with interceptors for auth and error handling
  - No more duplicate configuration in each API file

#### Environment Files
- **`.env.local`** - Development environment (already existed, now updated)
- **`.env.production`** - Production environment configuration
- **`.env.staging`** - Staging environment configuration
- **`.env.example`** - Template showing available variables

#### Documentation
- **`DEPLOYMENT.md`** - Comprehensive deployment guide
- **`QUICK_DEPLOY.md`** - Quick reference for common deployment tasks
- **`.gitignore`** - Prevents environment files from being committed

### 2. Updated Files

#### API Modules (All 6 files)
- **`src/api/authApi.ts`**
- **`src/api/expenseApi.ts`**
- **`src/api/bankApi.ts`**
- **`src/api/incomeApi.ts`**
- **`src/api/transferApi.ts`**
- **`src/api/statsApi.ts`**

**Changes:**
- Removed duplicate axios instance creation
- Removed duplicate interceptor configuration
- Now import centralized `apiClient` from `axiosInstance.ts`
- All API calls use the same client with consistent configuration

#### Build Configuration
- **`vite.config.ts`** - Enhanced with:
  - Environment variable handling
  - Development proxy configuration
  - Production build optimizations

#### Package Configuration
- **`package.json`** - Added deployment helper scripts:
  - `build:prod` - Build for production
  - `build:staging` - Build for staging

## How It Works

### Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│          Environment Files                      │
│  .env.local / .env.production / .env.staging    │
│                    ↓                            │
│            src/config.ts                        │
│  (Reads VITE_API_URL & exports config)         │
│                    ↓                            │
│         src/api/axiosInstance.ts                │
│  (Creates shared axios with interceptors)      │
│                    ↓                            │
│  All API Modules (authApi, expenseApi, etc)    │
│       (Import & use centralized client)        │
│                    ↓                            │
│        Components & React Components            │
│       (Call API methods from modules)           │
└─────────────────────────────────────────────────┘
```

### Request Flow
```
React Component
    ↓
API Module (e.g., expenseApi.get())
    ↓
apiClient (axios instance)
    ↓
Request Interceptor (adds JWT token)
    ↓
Backend API Server
    ↓
Response Interceptor (handles errors)
    ↓
React Component (receives data)
```

## Environment Variables

### `VITE_API_URL`
- **Purpose**: Backend API base URL
- **Format**: Full URL including protocol and /api path
- **Examples**:
  - Development: `http://localhost:8080/api`
  - Production: `https://api.yourdomain.com/api`
  - Staging: `https://staging-api.yourdomain.com/api`

### `VITE_DEBUG`
- **Purpose**: Enable debug logging
- **Values**: `true` or `false`
- **Default**: `false` (recommend `true` for development)

## Deployment Workflow

### Step 1: Prepare Environment
```bash
# Check your environment file has correct backend URL
cat .env.production
# Output should show your production backend URL
```

### Step 2: Build
```bash
npm run build
# Creates optimized dist/ folder with embedded config
```

### Step 3: Deploy
```bash
# Upload dist/ folder contents to your hosting
# Example: Upload to Netlify, Vercel, or traditional hosting
```

## Code Examples

### Before Changes (Duplicate across 6 files)
```typescript
// Each API file had this code
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, ...);

// ... more interceptor code ...
```

### After Changes (Now Centralized)
```typescript
// Each API file now just imports
import { apiClient } from './axiosInstance';

// And uses it
export const expenseApi = {
  getAll: (): Promise<Expense[]> =>
    apiClient.get('/expense/all'),
  // ... more methods
};
```

## Benefits

1. **Single Source of Truth** - Backend URL configured in one place
2. **Easier Maintenance** - Changes to HTTP config only need to be made once
3. **Better Testing** - Mock requests more easily with centralized client
4. **Scalability** - Adding new API modules is now simpler
5. **Consistency** - All requests use identical configuration
6. **Environment Management** - Easy switching between dev/staging/prod
7. **Build-Time Configuration** - Secure, no runtime secrets exposed

## Common Tasks

### Change Production Backend URL
```bash
# Edit .env.production
VITE_API_URL=https://your-new-api.com/api

# Rebuild
npm run build

# Deploy the new dist/ folder
```

### Add New API Module
```typescript
// src/api/myApi.ts
import { apiClient } from './axiosInstance';

export const myApi = {
  getItems: () => apiClient.get('/my-endpoint'),
  createItem: (data) => apiClient.post('/my-endpoint', data),
};
```

### Debug Configuration Issues
```bash
# Open browser console, should see on app startup:
# [CONFIG] Environment: production
# [CONFIG] API Base URL: https://api.yourdomain.com/api
# [CONFIG] Debug Mode: false
```

## File Organization Summary

```
Expense Tracker Frontend/
├── src/
│   ├── config.ts                    ← Configuration
│   ├── api/
│   │   ├── axiosInstance.ts        ← Shared HTTP client
│   │   ├── authApi.ts              ← Updated
│   │   ├── bankApi.ts              ← Updated
│   │   ├── expenseApi.ts           ← Updated
│   │   ├── incomeApi.ts            ← Updated
│   │   ├── transferApi.ts          ← Updated
│   │   └── statsApi.ts             ← Updated
│   ├── components/
│   ├── context/
│   └── ...
├── .env.example                      ← Template
├── .env.local                        ← Development (checked in, no secrets)
├── .env.production                   ← Production
├── .env.staging                      ← Staging
├── .gitignore                        ← Prevents env files with secrets
├── vite.config.ts                    ← Updated
├── package.json                      ← Updated with deploy scripts
├── DEPLOYMENT.md                     ← Complete deployment guide
├── QUICK_DEPLOY.md                   ← Quick reference
└── CONFIG_SUMMARY.md                 ← This file
```

## Next Steps

1. **Customize Environment Files**: Update backend URLs in each `.env.*` file
2. **Git Setup**: Commit `.env.example` but not `.env.local` (already in .gitignore)
3. **Build & Test**: Run `npm run build` and `npm run preview` to test
4. **Deploy**: Follow DEPLOYMENT.md for your hosting platform
5. **Monitor**: Check browser console for configuration logs

## Troubleshooting

### Backend URL Not Changing
- Backend URL is set at **build time**, not runtime
- Must rebuild after changing `.env.*` files
- Check: `npm run build` before deploying

### API Calls Still Failing
- Verify backend URL in browser console on startup
- Check browser Network tab for actual API URLs being called
- Ensure backend server is running and accessible

### Build Fails
- Clear dependencies: `rm -rf node_modules && npm install`
- Check Node version: >= 14 required
- TypeScript errors: run `npm run build` to see details

## Support

For deployment assistance, see:
- `DEPLOYMENT.md` - Detailed deployment guide
- `QUICK_DEPLOY.md` - Common deployment commands
- Configuration logging - Check browser console for debug info
