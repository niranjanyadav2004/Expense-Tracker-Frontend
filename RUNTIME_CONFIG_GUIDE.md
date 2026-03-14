# Runtime Configuration - How to Externalize Backend URL

## What Changed?

The backend URL can now be changed **at runtime** (after deployment) **without rebuilding**!

## How It Works

### Before (Build-Time Only)
```
Edit .env.production → npm run build → Deploy dist/
Backend URL is fixed in the compiled code
```

### Now (Build-Time + Runtime)
```
npm run build → Deploy dist/ + public/config.json
Backend URL can be changed by updating config.json only
```

## Architecture

```
┌─────────────────────────────────────┐
│  App Startup (main.tsx)             │
│  Calls: loadRuntimeConfig()         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Fetch public/config.json (runtime) │
│  └─ Merge with build-time defaults  │
│  └─ Allow window.appConfig override │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  config.ts - Configuration Ready    │
│  axiosInstance.ts - Uses runtime    │
│  All API calls use updated URL      │
└─────────────────────────────────────┘
```

## Three Levels of Configuration

### Level 1: Build-Time (Fallback)
```typescript
// From environment variables during build
VITE_API_URL=https://build-default.com/api

// Compiled into the app
```

### Level 2: Runtime (Primary)
```json
// From public/config.json loaded at startup
// This is what actually gets used
{
  "api": {
    "baseURL": "https://production-api.com/api"
  }
}
```

### Level 3: Script Injection (Override)
```html
<!-- Via window object if needed -->
<script>
  window.appConfig = {
    api: { baseURL: "https://injected-api.com/api" }
  };
</script>
```

## Common Deployment Scenarios

### Scenario 1: Deploy Once, Use for All Environments

```bash
# Build once
npm run build

# Deploy to production with production config
cp public/config.production.json dist/config.json
upload dist/* to production

# Later: Deploy to staging (same build, different config)
cp public/config.staging.json dist/config.json
upload dist/* to staging

# Later: Deploy to another region
cp public/config.production-us-west.json dist/config.json
upload dist/* to us-west
```

### Scenario 2: Change Backend URL Without Rebuilding

```bash
# Backend migrated to new server
# Old URL: https://old-api.com/api
# New URL: https://new-api.com/api

# Just update config.json
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Upload to server
scp dist/config.json user@server:/var/www/

# Done! No rebuild needed.
# Users see new URL on next page load
```

### Scenario 3: A/B Testing Different Backends

```bash
# Serve different configs to different users
# Backend 1: /config.json → points to v1 API
# Backend 2: /config.alt.json → points to v2 API

# User requests config based on query param
# location.href = '/?backend=v2' loads config.alt.json
```

## File Structure

```
dist/
├── config.json          ← Loaded at runtime
├── index.html
└── assets/
    └── ...javascript files
```

## Update Backend URL Live

### Method 1: Simple File Update
```bash
# SSH to server
ssh user@production-server

# Update the config
cat > /var/www/expense-tracker/config.json <<EOF
{
  "api": {
    "baseURL": "https://new-backend.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Done! Users see new URL after refresh
```

### Method 2: CDN or Cloud Storage
```bash
# Upload to S3, CloudFlare, or your CDN
aws s3 cp config.json s3://my-bucket/config.json

# URL: https://cdn.example.com/config.json
# Served to production users
```

### Method 3: Container/Docker
```dockerfile
FROM node:18
COPY dist /app/public
COPY config.production.json /app/public/config.json
EXPOSE 80
CMD ["npm", "start"]
```

```bash
# Change backend for different containers
docker run -v ./config.staging.json:/app/public/config.json expense-tracker
```

## Configuration File Format

```json
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false,
  "custom": {}  // Add any additional config here
}
```

## Testing Runtime Config

### During Development
```bash
# Start dev server
npm run dev

# Browser console shows:
# [CONFIG] Loaded runtime configuration from /config.json
# [CONFIG] Environment: development
# [CONFIG] API Base URL: http://localhost:8080/api
```

### After Production Build
```bash
# Build
npm run build

# Preview locally (simulates production)
npm run preview

# Open http://localhost:4173
# Console shows production config being loaded
```

## Debugging Configuration

### Check Loaded Config
```javascript
// In browser console
import { getConfig } from './src/config'
getConfig()
// Shows current runtime config
```

### Update Config at Runtime (Dev)
```javascript
// In browser console (development only)
import { updateConfig } from './src/config'
updateConfig({
  api: {
    baseURL: "https://different-api.com/api"
  }
})
// Subsequent API calls use new URL
```

### Check What Was Loaded
```bash
# Open browser DevTools
# Network tab → find config.json request
# Check Response tab to see what was loaded

# Or check Console for messages:
# [CONFIG] Loaded runtime configuration from /config.json
# [CONFIG] Environment: ...
# [CONFIG] API Base URL: ...
```

## Fallback Behavior

If `config.json` is missing or fails to load:
- App uses build-time defaults from `VITE_API_URL`
- Console shows warning: `[CONFIG] Using build-time configuration as fallback`
- App continues to work normally

## Security Notes

1. **No Secrets in config.json** - Backend URL is public, not a secret
2. **Use HTTPS URLs** - For production environment
3. **Version Your Configs** - Keep history of config changes
4. **Monitor config.json** - Log when it's loaded in production

## Advantages of Runtime Configuration

✅ **No Rebuild Required** - Change URL anytime  
✅ **Quick Rollback** - Revert config instantly  
✅ **Environment Flexibility** - One build for many environments  
✅ **Deployment Freedom** - Deploy to any server without rebuilding  
✅ **A/B Testing** - Serve different configs to users  
✅ **Easy Migration** - Switch backends without downtime  
✅ **Faster CI/CD** - Build once, test everywhere  

## Troubleshooting

### Config Not Loading
```
Q: I uploaded config.json but it's not loading
A: Make sure config.json is in the same directory as index.html
   File path should be: /public/config.json or dist/config.json
   URL when loaded: https://yourdomain.com/config.json
```

### Old URL Still Being Used
```
Q: I updated config.json but old URL is still being used
A: Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   Or clear browser cache and reload
```

### config.json Returns 404
```
Q: Browser console shows config.json 404 error
A: Check file exists: ls -la public/config.json
   Check web server serves public folder
   Fallback to build-time config (should still work)
```

## Examples

### Complete Production Deployment

```bash
#!/bin/bash
# production_deploy.sh

# 1. Build the application
npm run build

# 2. Prepare production config
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.prod.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# 3. Upload to production
scp -r dist/* user@prod-server:/var/www/html/

# 4. Restart web server (if needed)
ssh user@prod-server 'systemctl restart nginx'

echo "✓ Production deployment complete"
```

### Quick Hotfix - Change Backend URL

```bash
#!/bin/bash
# hotfix_backend.sh - Change backend URL without rebuilding

NEW_API_URL="$1"

cat > /var/www/html/config.json <<EOF
{
  "api": {
    "baseURL": "$NEW_API_URL"
  },
  "environment": "production",
  "debug": false
}
EOF

echo "✓ Backend URL updated to: $NEW_API_URL"
echo "✓ Users will see new URL after refresh"

# Usage: ./hotfix_backend.sh "https://new-api.example.com/api"
```

## Next Steps

1. **Build the app**: `npm run build`
2. **Test runtime config**: `npm run preview` and check console
3. **Deploy dist/ folder** to your hosting
4. **Update config.json** anytime the backend URL changes
5. **Monitor loading** via browser console

For more details, see `public/README.md`
