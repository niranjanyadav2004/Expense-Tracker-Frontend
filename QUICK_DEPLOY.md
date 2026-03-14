# Quick Deployment Reference

## Changing Backend Base URL

The backend base URL is managed centrally and can be easily updated for different environments.

### Files to Understand
- `src/config.ts` - Main configuration file that reads VITE_API_URL
- `src/api/axiosInstance.ts` - Centralized axios instance using the config
- All API files in `src/api/` - Use the centralized axiosInstance
- `.env.local` - Development environment
- `.env.production` - Production environment  
- `.env.staging` - Staging environment
- `.env.example` - Template reference

### Quick Deployment Steps

#### 1. Local Development (No changes needed)
```bash
npm install
npm run dev
# Uses .env.local automatically with http://localhost:8080/api
```

#### 2. For Staging Deployment
```bash
# Update backend URL
echo "VITE_API_URL=https://staging-api.yourdomain.com/api" > .env.staging

# Build
npm run build

# Deploy the dist folder to staging server
```

#### 3. For Production Deployment
```bash
# Update backend URL
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Build with production URL
npm run build

# Deploy the dist folder to production server
```

### One-Line Deploy Commands

```bash
# Production build with custom URL
VITE_API_URL=https://prod-api.com/api npm run build

# Staging build with custom URL
VITE_API_URL=https://staging-api.com/api npm run build

# Then deploy the dist/ folder
```

### Environment Variable Priority
1. `.env.production` - Highest priority for production builds
2. `.env.staging` - For staging builds
3. `.env.local` - For development
4. `.env.example` - Template reference

### Testing Before Deployment
```bash
# Preview the built application locally
npm run preview

# Check browser console to verify backend URL is correct
# Should see: [CONFIG] API Base URL: https://your-backend-url.com/api
```

### Important Notes
- Backend URL is embedded during build time, not runtime
- Always rebuild when changing the backend URL
- Use HTTPS for production
- Test API connectivity after deployment

See DEPLOYMENT.md for detailed deployment instructions.
