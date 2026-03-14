# Runtime Externalized Configuration

This directory contains environment-specific configuration files that are loaded **at runtime** (after deployment).

## Files

- `config.json` - Default/fallback configuration
- `config.production.json` - Production environment
- `config.staging.json` - Staging environment
- `config.development.json` - Development environment

## How It Works

1. **Build Time**: Application is built once with embedded defaults from environment variables
2. **Deployment Time**: Deploy the appropriate config file as `config.json`
3. **Runtime**: Application fetches `config.json` on startup and uses those settings

## Deployment Strategies

### Strategy 1: Rename During Deployment
```bash
# For production deployment
cp config.production.json config.json
# Deploy the entire public/ folder
```

### Strategy 2: Use Different Builds
```bash
# Build for production
npm run build

# Before deploying, replace config.json
cp public/config.production.json dist/config.json

# Deploy the dist/ folder
```

### Strategy 3: CDN/Server Injection
```bash
# Deploy with all config files
# Configure your server to serve different files based on domain/path
# Example: serve config.production.json for api.domain.com
```

## Configuration Schema

```json
{
  "api": {
    "baseURL": "https://api.example.com/api"  // Backend API URL
  },
  "environment": "production",                  // dev/staging/production
  "debug": false                                // Enable debug logging
}
```

## Updating Backend URL After Deployment

### Option 1: Replace config.json Only
```bash
# No rebuild needed! Just update the config.json file
echo '{"api":{"baseURL":"https://new-api.com/api"},"environment":"production","debug":false}' > config.json

# Upload to your server/CDN
# Users will pick up new URL on next app refresh
```

### Option 2: Direct Server Injection (Advanced)
```html
<!-- In index.html or via middleware -->
<script>
  window.appConfig = {
    api: {
      baseURL: "https://api.example.com/api"
    },
    environment: "production",
    debug: false
  };
</script>
```

### Option 3: Environment Variable in Build
```bash
# Still has the build-time fallback
VITE_API_URL=https://api.example.com/api npm run build
```

## Examples

### Change Production Backend URL
```bash
# Update the production config
cat > config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api-server.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Upload config.json to your server
scp config.json user@server:/var/www/expense-tracker/public/

# Users will see new URL on next refresh (within 1 second)
```

### Migrate to New Backend
```bash
# Old backend: https://old-api.com/api
# New backend: https://new-api.com/api

# 1. Update config.json
{
  "api": {
    "baseURL": "https://new-api.com/api"
  },
  "environment": "production",
  "debug": false
}

# 2. Deploy updated config.json
# 3. No rebuild needed!
# 4. All users get new backend URL on next page load
```

## Fallback Behavior

If `config.json` cannot be loaded:
- Application uses build-time defaults from environment variables
- Check browser console for warnings
- No errors - app continues to work

## Advantages

✅ Change backend URL without rebuilding  
✅ Quick deployment to different environments  
✅ Easy rollback (just change config.json back)  
✅ No secrets in buildable code  
✅ Flexible deployment strategies  
✅ Runtime configuration per deployment  

## Browser Caching

The config.json is fetched with `cache: no-store` header to prevent stale configs. If users still see old URLs:
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Or wait for localStorage cache to expire

## Testing

```bash
# Start development server
npm run dev

# Open browser console, should see:
# [CONFIG] Loaded runtime configuration from /config.json
# [CONFIG] Environment: development
# [CONFIG] API Base URL: http://localhost:8080/api
```
