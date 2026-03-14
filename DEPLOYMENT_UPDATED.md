# Updated Deployment Guide - With Runtime Configuration

## TL;DR - Quick Start

```bash
# 1. Build (once, for all environments)
npm run build

# 2. Choose config for your environment
cp public/config.production.json dist/config.json

# 3. Deploy entire dist/ folder
# Done! ✓

# To change backend URL later:
# Just update config.json file - NO rebuild needed!
```

## What's New?

This deployment is now **two-tier**:
1. **Build-time** - Code is compiled with fallback defaults
2. **Runtime** - `config.json` is loaded on app startup for actual settings

**Benefit**: Change backend URL without rebuilding!

## One Build for Multiple Environments

```bash
# Build application once
npm run build

# Deploy to production with production config
cp public/config.production.json dist/config.json
deploy dist/ to production

# Deploy to staging with staging config (same build!)
cp public/config.staging.json dist/config.json
deploy dist/ to staging

# Deploy to another region with regional config
cp public/config.regional.json dist/config.json
deploy dist/ to that region
```

## Step-by-Step Deployment

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Application
```bash
# Build produces: dist/ folder with compiled application
npm run build

# Optional: Test the build locally
npm run preview
# Open http://localhost:4173
# Check console for config loading messages
```

### Step 3: Prepare Configuration

**For Production:**
```bash
# Copy production config
cp public/config.production.json dist/config.json

# Update the backend URL
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.yourdomain.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF
```

**For Staging:**
```bash
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://staging-api.yourdomain.com/api"
  },
  "environment": "staging",
  "debug": true
}
EOF
```

### Step 4: Deploy to Hosting

**Option A: Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod --build-dir=dist
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option C: Traditional Hosting (Apache, Nginx)**

1. Upload `dist/` folder contents to server
2. Ensure web server serves `index.html` for all 404s (SPA routing)
3. Verify `dist/config.json` is accessible

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/expense-tracker/dist;

    # Cache control for files
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache config.json (load fresh each time)
    location /config.json {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Serve index.html for all routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API to backend
    location /api {
        proxy_pass https://your-backend-server.com;
    }
}
```

**Apache Config:**
```apache
<Directory /var/www/expense-tracker/dist>
    # SPA routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>

    # Cache control
    <FilesMatch "\.js$">
        Header set Cache-Control "public, max-age=31536000"
    </FilesMatch>

    <FilesMatch "config\.json$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Expires "0"
        Header set Pragma "no-cache"
    </FilesMatch>
</Directory>
```

**Docker:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build Docker image
docker build -t expense-tracker-frontend .

# Run with different config
docker run -e API_URL="https://api.example.com/api" expense-tracker-frontend
```

**Platform-Specific Hosting:**

- **AWS S3 + CloudFront**: Upload dist/ to S3, configure CloudFront
- **AWS Amplify**: `amplify publish`
- **Google Cloud Storage**: Upload dist/ to GCS bucket
- **Firebase Hosting**: `firebase deploy`
- **DigitalOcean App Platform**: Connect GitHub repo for auto-deploy
- **Heroku**: Use buildpack for Node.js apps

### Step 5: Verify Deployment

```bash
# 1. Open app in browser
# https://yourdomain.com

# 2. Check browser console (F12 → Console)
# Should see:
# [CONFIG] Loaded runtime configuration from /config.json
# [CONFIG] Environment: production
# [CONFIG] API Base URL: https://api.yourdomain.com/api

# 3. Test API call
# Open any page that makes an API call
# Check Network tab → should see requests to correct API URL

# 4. Verify config is accessible
# Open: https://yourdomain.com/config.json
# Should return JSON with your configuration
```

## Changing Backend URL After Deployment

### Method 1: Update config.json Only (Easiest)

```bash
# No rebuild needed! Just update the file

cat > config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api-server.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Upload to server
scp config.json user@server:/var/www/expense-tracker/

# Users see new URL after refresh
```

### Method 2: Via Your Hosting Platform

**Netlify:**
```bash
# Update config file in Netlify UI or via CLI
netlify deploy --prod --dir=dist
```

**Vercel:**
- Upload new config.json via Dashboard
- Or use Vercel CLI: `vercel env set`

**AWS S3:**
```bash
aws s3 cp config.json s3://my-bucket/config.json
```

### Method 3: Rollback to Previous Config

```bash
git log --oneline dist/config.json
git checkout <commit-hash> -- dist/config.json
deploy dist/config.json
```

## Configuration Files Reference

### public/config.json (Development / Default)
- Location in final build: `dist/config.json`
- Loaded at app startup
- Contains your backend URL

### public/config.production.json
- Template for production deployments
- Update backend URL in this file

### public/config.staging.json
- Template for staging deployments
- Usually has debug enabled

### public/config.development.json
- Template for development deployments

## Environment Fallback Chain

```
1. Try to load: /config.json (runtime)
   ↓ if not found
2. Use: VITE_API_URL (build-time, from .env)
   ↓ if not set
3. Use: http://localhost:8080/api (hardcoded default)
```

So deployment always works, with graceful fallback.

## Multiple Backend Versions

To support multiple backends simultaneously:

```bash
# Create multiple config files
dist/config.v1.json     # Points to v1 API
dist/config.v2.json     # Points to v2 API
dist/config.legacy.json # Points to legacy API

# Serve based on URL param or user preference
# JavaScript: load different config based on logic
```

## Continuous Integration / Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Production Config
        run: |
          cat > dist/config.json <<EOF
          {
            "api": {
              "baseURL": "${{ secrets.PRODUCTION_API_URL }}"
            },
            "environment": "production",
            "debug": false
          }
          EOF

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Issue: Backend URL Not Changing
**Solution**: 
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check `dist/config.json` exists and has correct URL
- Check Network tab → config.json response

### Issue: config.json Returns 404
**Solution**:
- Ensure file is deployed to correct location
- For Nginx: file should be in root directory served by nginx
- For S3: ensure file has public read permissions
- Fallback will use build-time config automatically

### Issue: Old Config Still Showing
**Solution**:
- Check cache headers: `Cache-Control: no-cache`
- Clear browser cache: `Ctrl+Shift+Delete`
- Hard refresh: `Ctrl+Shift+R`
- Check deployment actually uploaded new file

### Issue: API Calls Still Failing After URL Update
**Solution**:
- Verify new backend server is running
- Check new backend URL is correct in config.json
- Check CORS headers on backend
- Open browser Network tab → verify correct API URL

## Performance Optimization

The production build includes:
- ✓ Code minification
- ✓ Tree-shaking (unused code removed)
- ✓ CSS minification
- ✓ Asset compression
- ✓ Source maps disabled (for production)
- ✓ Terser compression

## Security Considerations

1. **Use HTTPS**: All production URLs should use HTTPS
2. **No Secrets**: Backend URL is public, not a secret
3. **CORS**: Configure backend CORS for your domain
4. **Environment Variables**: Sensitive data goes in backend, not frontend
5. **Content Security Policy**: Configure on web server

## Monitoring & Debugging

### Enable Debug Mode
```json
{
  "api": {
    "baseURL": "https://api.yourdomain.com/api"
  },
  "environment": "production",
  "debug": true
}
```

Console will show:
- All API requests/responses
- Configuration loading
- Environment information

### Check What's Loading
```javascript
// In browser console
localStorage.getItem('jwtToken')          // Check auth token
document.querySelector('meta[name="environment"]')  // Check environment
```

## Next Steps

1. Build: `npm run build`
2. Copy config: `cp public/config.production.json dist/config.json`
3. Update backend URL in dist/config.json
4. Deploy dist/ folder to your hosting
5. Test and verify in browser console

**For more details**, see:
- `RUNTIME_CONFIG_GUIDE.md` - Runtime configuration details
- `public/README.md` - Config file examples
- `QUICK_DEPLOY.md` - Quick reference

You now have a **single build for any environment** with **easy backend URL management**! 🚀
