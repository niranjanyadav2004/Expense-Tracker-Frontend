# Deployment Guide - Expense Tracker Frontend

## Overview
This frontend application has been configured for easy deployment across different environments (development, staging, production). The backend API URL is centralized and can be easily changed during deployment.

## Project Structure
```
src/
├── config.ts              ← Centralized configuration
├── api/
│   ├── axiosInstance.ts   ← Shared axios instance
│   ├── authApi.ts
│   ├── bankApi.ts
│   ├── expenseApi.ts
│   ├── incomeApi.ts
│   ├── statsApi.ts
│   └── transferApi.ts
├── components/
├── context/
└── ...
```

## Environment Configuration

### 1. Environment Files
The application uses `.env` files for environment-specific configuration:

- `.env.local` - Local development (use default values)
- `.env.production` - Production environment
- `.env.example` - Template for reference

### 2. Available Environment Variables
```
VITE_API_URL         - Backend API base URL (default: http://localhost:8080/api)
VITE_DEBUG          - Enable debug mode (default: false)
```

## Deployment Steps

### For Local Development
```bash
# 1. Install dependencies
npm install

# 2. Setup environment (already configured in .env.local)
# Verify .env.local has correct settings

# 3. Run development server
npm run dev

# Application will be available at http://localhost:5173
```

### For Production Deployment

#### Step 1: Update Backend URL
Edit `.env.production` and update the backend URL:
```
VITE_API_URL=https://your-production-api.com/api
VITE_DEBUG=false
```

#### Step 2: Build the Application
```bash
# Build for production
npm run build

# Output will be in the 'dist' folder
# This creates optimized, minified code ready for deployment
```

#### Step 3: Deploy the dist folder
Upload the contents of the `dist` folder to your hosting service:

**Option A: Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

**Option B: Netlify**
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir=dist
```

**Option C: Traditional Hosting (Apache, Nginx, etc.)**
1. Build the project: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure web server to serve `index.html` for all routes (SPA routing)

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/expense-tracker/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://your-backend-api.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache Configuration Example:**
```apache
<Directory /var/www/expense-tracker/dist>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    
    # SPA routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
</Directory>
```

## Changing Backend URL During Deployment

### Method 1: Direct Environment File Edit (Before Build)
```bash
# Edit the production env file
# .env.production
VITE_API_URL=https://your-api-url.com/api

# Then build and deploy
npm run build
```

### Method 2: Using Build Command
```bash
# Build with environment variable override
VITE_API_URL=https://your-api-url.com/api npm run build
```

### Method 3: Runtime Configuration (Advanced)
If you need to change the URL after deployment:
1. The config is read from `src/config.ts` which uses `import.meta.env.VITE_API_URL`
2. This must be set **before build time** as it's baked into the compiled code
3. Vite replaces these values during the build process

## Build Command Reference

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production  
npm run build           # Build optimized production bundle
npm run preview         # Preview production build locally
```

## Troubleshooting

### CORS Issues
If you get CORS errors:
1. Verify the backend URL in the browser console
2. Ensure backend has proper CORS headers configured
3. Check that the backend is running and accessible

### API Not Responding
Check:
1. Backend URL in `.env.production` is correct
2. Backend server is running
3. Network connectivity between frontend and backend

### Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 14+)
- Check for TypeScript errors: `npm run build`

## Security Considerations

1. **Never commit sensitive data** - Backend URLs with credentials should use environment variables
2. **Enable HTTPS** - Always use HTTPS in production
3. **API Key Management** - If using API keys, store them in environment variables
4. **CORS** - Configure proper CORS on backend to only allow your domain

## Performance Optimization

The production build is already optimized:
- Code minification via Terser
- Tree-shaking of unused code
- CSS minification
- Asset compression

## Monitoring & Debugging

Enable debug mode for troubleshooting:
```
VITE_DEBUG=true
```

This will log:
- API base URL on app startup
- Environment information
- Network requests and responses

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        env:
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}
        run: npm run build
      
      - name: Deploy
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Summary

1. **Backend URL is centralized** in `src/config.ts`
2. **Update via `.env.production`** before building
3. **Run `npm run build`** to create production bundle
4. **Deploy the `dist` folder** to your hosting
5. **Configure web server** for SPA routing
6. **Monitor the application** using browser console and network tab

For any issues, check the browser console for error messages and network requests.
