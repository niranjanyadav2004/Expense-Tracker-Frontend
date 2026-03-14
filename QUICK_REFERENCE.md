# Deployment Quick Reference - Runtime Configuration

## Key Point: Backend URL is Now Externalizable! 

You can **change the backend URL without rebuilding** by just updating `config.json`.

---

## One-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Build application (do this once, reuse for all environments)
npm run build
```

---

## Deploy to Environment

### Production Deploy (First Time)

```bash
# Copy production config
cp public/config.production.json dist/config.json

# Edit to your production backend URL
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.yourdomain.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Upload dist/ folder to hosting
# Example commands for different platforms:

# Netlify:
netlify deploy --prod --dir=dist

# Vercel:
vercel --prod --buildDir=dist

# Traditional server (SCP):
scp -r dist/* user@server:/var/www/html/

# AWS S3:
aws s3 sync dist/ s3://my-bucket/ --delete

# Google Cloud:
gsutil -m cp -r dist/* gs://my-bucket/
```

### Staging Deploy

```bash
# Same build, just different config
cp public/config.staging.json dist/config.json

cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://staging-api.yourdomain.com/api"
  },
  "environment": "staging",
  "debug": true
}
EOF

# Deploy to staging server/CDN
```

---

## Change Backend URL (Without Rebuild!)

### Quick Update

```bash
# Just update the config file - NO rebuild needed!
cat > /var/www/expense-tracker/config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api-server.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Or for cloud storage:
aws s3 cp config.json s3://my-bucket/config.json

# Done! Users get new backend URL on next page load
```

### Rollback if Something Goes Wrong

```bash
# Simply upload previous config.json
aws s3 cp config.old.json s3://my-bucket/config.json

# Or restart with ENV variable:
VITE_API_URL=https://fallback-api.com/api npm start
```

---

## Common Deployment Scenarios

### Scenario: Backend Server Migration

```bash
# Old Server: https://old-api.com/api
# New Server: https://new-api.com/api

# Step 1: Test new server
# In browser console on staging:
#   import { updateConfig } from './src/config'
#   updateConfig({ api: { baseURL: 'https://new-api.com/api' } })
# Test that app works

# Step 2: Update production config
cat > config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Step 3: Deploy to production
scp config.json user@prod:/var/www/

# Step 4: Monitor in browser console for errors
# Done!
```

### Scenario: Multi-Region Deployment

```bash
# US Production
cp public/config.production.json dist/config.us.json
sed -i 's|api.yourdomain.com|us-api.yourdomain.com|g' dist/config.us.json
upload dist/config.us.json to us-region

# EU Production
cp public/config.production.json dist/config.eu.json
sed -i 's|api.yourdomain.com|eu-api.yourdomain.com|g' dist/config.eu.json
upload dist/config.eu.json to eu-region

# Asia Production
cp public/config.production.json dist/config.asia.json
sed -i 's|api.yourdomain.com|asia-api.yourdomain.com|g' dist/config.asia.json
upload dist/config.asia.json to asia-region
```

### Scenario: Feature Branch with Different Backend

```bash
# Testing a feature connected to a different backend
cp public/config.staging.json dist/config.feature.json

cat > dist/config.feature.json <<EOF
{
  "api": {
    "baseURL": "https://feature-api.yourdomain.com/api"
  },
  "environment": "staging",
  "debug": true
}
EOF

# Deploy to feature preview URL
# Users can test with feature backend
```

---

## File Reference

### During Development
- Use `.env.local` to set backend URL
- `npm run dev` loads this automatically

### During Deployment
- Use `dist/config.json` (after build)
- Contains the actual runtime URL
- Loaded by app on startup

### Environment Files (Build-time fallback)
- `.env.production` - Used by npm run build
- `.env.staging` - Alternative build config
- `.env.example` - Template reference

### Public Config Templates
- `public/config.json` - Default development
- `public/config.production.json` - Template for prod
- `public/config.staging.json` - Template for staging

---

## After Deployment: Testing

```bash
# 1. Open application in browser
# 2. Press F12 to open Developer Tools
# 3. Go to Console tab
# 4. Should see one of these messages:

# ✓ Success:
# [CONFIG] Loaded runtime configuration from /config.json
# [CONFIG] Environment: production
# [CONFIG] API Base URL: https://api.yourdomain.com/api

# ✓ Fallback (config.json not found):
# [CONFIG] Using build-time configuration as fallback
# [CONFIG] Environment: production
# [CONFIG] API Base URL: https://fallback-url.com/api

# 5. Test by making an API call
# Check Network tab in DevTools
# Verify requests go to correct backend URL
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend URL not changing | Hard refresh: `Ctrl+Shift+R`, check that config.json is uploaded |
| config.json returns 404 | Ensure file is in web root, check deployment completed |
| Old URL still being used | Clear browser cache, disable caching in DevTools Network tab |
| App not loading at all | Check browser console for errors, verify fallback backend works |
| API 401/403 errors | Check auth token working, verify backend CORS headers |

---

## File Size & Performance

```bash
# After build, typical sizes:
- index.html: ~3KB
- config.json: ~0.2KB
- JavaScript bundle: ~150KB (minified, gzipped)
- Total: ~170KB

# config.json is separate, not bundled
# Can update independently without affecting other files
```

---

## Security Best Practices

✓ Use HTTPS for all production URLs  
✓ Don't put secrets in config.json (backend handles auth)  
✓ Configure CORS properly on backend  
✓ Use environment variables on backend for sensitive data  
✓ Monitor config.json changes  
✓ Implement rate limiting on backend  

---

## One-Liner Deployment Commands

```bash
# Netlify
npm run build && cp public/config.production.json dist/config.json && netlify deploy --prod

# Vercel
npm run build && cp public/config.production.json dist/config.json && vercel --prod

# S3 + CloudFront
npm run build && cp public/config.production.json dist/config.json && aws s3 sync dist/ s3://bucket/

# SCP to server
npm run build && cp public/config.production.json dist/config.json && scp -r dist/* user@server:/var/www/
```

---

## Ultra-Quick API URL Update (No Rebuild)

```bash
# Already deployed? Just update config.json:
curl -X PUT https://your-server/config.json \
  -H "Content-Type: application/json" \
  -d '{
    "api": {"baseURL": "https://new-api.com/api"},
    "environment": "production",
    "debug": false
  }'

# Or simple file update:
echo '{"api":{"baseURL":"https://new-api.com/api"},"environment":"production","debug":false}' \
  | scp - user@server:/var/www/config.json

# That's it! No npm, no build, no deploy tool. Just API URL change.
```

---

## What's Actually Deployed

```
dist/
├── config.json              ← UPDATE THIS to change backend URL
├── index.html              ← SPA entry point
├── assets/
│   ├── index.*.js          ← All application JavaScript
│   ├── index.*.css         ← All compiled CSS
│   └── [other assets]
└── [other files]

Static files served by web server
config.json is fetched fresh on each page load (no cache)
```

---

## Summary

| Task | Command |
|------|---------|
| Build once | `npm run build` |
| Update backend URL | Edit `dist/config.json` |
| Deploy to production | `scp -r dist/* server:/var/www/` |
| Change backend (no rebuild) | Update just `config.json` file |
| Verify deployment | Check browser console for config messages |
| Enable debugging | Set `"debug": true` in `config.json` |

**Key Benefit**: One build, infinite deployments to different environments with different backend URLs! 🚀
