# Deployment Examples - Different Hosting Platforms

## Build Once, Deploy Everywhere

```bash
# Step 1: Build (only once!)
npm run build

# Now you have dist/ folder ready for any environment
# Just change dist/config.json for each deployment
```

---

## Netlify Deployment

### Option 1: Automatic Deployment (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Connect your repository
netlify init

# Configure netlify.toml
cat > netlify.toml <<EOF
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Don't cache config.json
[[headers]]
  for = "/config.json"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
EOF

# Deploy
netlify deploy --prod --dir=dist
```

### Option 2: Manual Deployment

```bash
# Build
npm run build

# Prepare config
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Deploy
netlify deploy --prod --dir=dist

# Update backend URL later (no rebuild!)
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF
netlify deploy --prod --dir=dist
```

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Create vercel.json for configuration
cat > vercel.json <<EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/config.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
EOF

# Update backend URL
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.example.com/api"
  }
}
EOF
vercel --prod
```

---

## Traditional Server (Apache/Nginx)

### Nginx Setup

```bash
# 1. Build
npm run build

# 2. Update config
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# 3. Deploy to server
scp -r dist/* user@server:/var/www/app/

# 4. Create Nginx config
cat > /etc/nginx/sites-available/app <<'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name app.example.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    root /var/www/app;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Don't cache config.json
    location /config.json {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Expires "0";
        add_header Pragma "no-cache";
    }

    # don't cache index.html
    location /index.html {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA routing - serve index.html for all 404s
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass https://api.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 5. Enable site
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Update Backend URL (Later, No Rebuild)

```bash
# SSH to server
ssh user@server

# Update config only
cat > /var/www/app/config.json <<EOF
{
  "api": {
    "baseURL": "https://new-api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Done! Users see new URL immediately
# No server restart needed
```

### Apache Setup

```bash
# 1. Deploy
scp -r dist/* user@server:/var/www/app/

# 2. Create Apache config
cat > /etc/apache2/sites-available/app.conf <<'EOF'
<VirtualHost *:80>
    ServerName app.example.com
    DocumentRoot /var/www/app

    # Redirect HTTP to HTTPS
    Redirect permanent / https://app.example.com/

    <Directory /var/www/app>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [QSA,L]
    </Directory>
</VirtualHost>

<VirtualHost *:443>
    ServerName app.example.com
    DocumentRoot /var/www/app

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/app.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/app.example.com/privkey.pem

    <Directory /var/www/app>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [QSA,L]

        # Don't cache config.json
        <FilesMatch "^config\.json$">
            Header set Cache-Control "no-cache, no-store, must-revalidate"
            Header set Expires "0"
        </FilesMatch>

        # Cache everything else
        <FilesMatch "\.(js|css|jpg|jpeg|png|gif|svg)$">
            Header set Cache-Control "public, max-age=31536000"
        </FilesMatch>
    </Directory>

    ProxyPass /api http://api.example.com
    ProxyPassReverse /api http://api.example.com
</VirtualHost>
EOF

# 3. Enable and start
sudo a2ensite app.conf
sudo a2enmod rewrite
sudo a2enmod proxy
sudo systemctl restart apache2
```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Create config for production
RUN cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# Serve stage
FROM nginx:alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf for Docker

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Don't cache config.json
    location /config.json {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Expires "0";
    }

    # Cache assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - API_URL=https://api.example.com/api
    volumes:
      - ./dist/config.json:/usr/share/nginx/html/config.json
```

### Docker Commands

```bash
# Build image
docker build -t expense-tracker-frontend .

# Run container
docker run -p 80:80 expense-tracker-frontend

# Run with specific backend URL
docker run \
  -p 80:80 \
  -v $(pwd)/dist/config.json:/usr/share/nginx/html/config.json \
  expense-tracker-frontend

# Push to registry
docker tag expense-tracker-frontend myregistry/expense-tracker-frontend:latest
docker push myregistry/expense-tracker-frontend:latest
```

---

## AWS S3 + CloudFront

```bash
# 1. Build
npm run build

# 2. Update config
cat > dist/config.json <<EOF
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
EOF

# 3. Sync to S3 (with caching headers)
aws s3 sync dist/ s3://my-bucket/ \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "*.html" \
  --exclude "config.json"

# 3a. Upload HTML and config with no-cache
aws s3 cp dist/*.html s3://my-bucket/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

aws s3 cp dist/config.json s3://my-bucket/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "application/json"

# 4. Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Later: Update backend URL (NO REBUILD!)
aws s3 cp config.json s3://my-bucket/config.json \
  --cache-control "no-cache, no-store, must-revalidate"

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/config.json"
```

---

## GitHub Pages

```bash
# 1. Build
npm run build

# 2. Create deployment script
cat > deploy.sh <<'EOF'
#!/bin/bash
npm run build

# Update config for GitHub Pages
cat > dist/config.json <<'CONFIG'
{
  "api": {
    "baseURL": "https://api.example.com/api"
  },
  "environment": "production",
  "debug": false
}
CONFIG

# Deploy to GitHub Pages
git add dist/
git commit -m "Deploy to GitHub Pages"
git push origin main
EOF

chmod +x deploy.sh
./deploy.sh
```

---

## Google Cloud Run

```bash
# Dockerfile for Cloud Run
FROM node:18-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Deploy to Cloud Run
gcloud run deploy expense-tracker-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1
```

---

## GitHub Actions - Automated Deployment

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Create production config
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

      - name: Notify Slack
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -d '{"text":"Frontend deployed successfully!"}'
```

---

## Multi-Environment CI/CD

```yaml
name: Deploy to Multiple Environments

on:
  push:
    branches:
      - main    # Production
      - staging # Staging
      - dev     # Development

jobs:
  deploy:
    runs-on: ubuntu-latest

    env:
      NODE_VERSION: 18

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install and Build
        run: |
          npm ci
          npm run build

      - name: Determine environment
        id: env
        run: |
          if [[ $GITHUB_REF == 'refs/heads/main' ]]; then
            echo "ENVIRONMENT=production" >> $GITHUB_OUTPUT
            echo "API_URL=${{ secrets.PRODUCTION_API_URL }}" >> $GITHUB_OUTPUT
            echo "SITE_ID=${{ secrets.NETLIFY_PROD_SITE_ID }}" >> $GITHUB_OUTPUT
          elif [[ $GITHUB_REF == 'refs/heads/staging' ]]; then
            echo "ENVIRONMENT=staging" >> $GITHUB_OUTPUT
            echo "API_URL=${{ secrets.STAGING_API_URL }}" >> $GITHUB_OUTPUT
            echo "SITE_ID=${{ secrets.NETLIFY_STAGING_SITE_ID }}" >> $GITHUB_OUTPUT
          else
            echo "ENVIRONMENT=development" >> $GITHUB_OUTPUT
            echo "API_URL=${{ secrets.DEV_API_URL }}" >> $GITHUB_OUTPUT
            echo "SITE_ID=${{ secrets.NETLIFY_DEV_SITE_ID }}" >> $GITHUB_OUTPUT
          fi

      - name: Create config.json
        run: |
          cat > dist/config.json <<EOF
          {
            "api": {
              "baseURL": "${{ steps.env.outputs.API_URL }}"
            },
            "environment": "${{ steps.env.outputs.ENVIRONMENT }}",
            "debug": $([[ "${{ steps.env.outputs.ENVIRONMENT }}" == "production" ]] && echo "false" || echo "true")
          }
          EOF

      - name: Deploy
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ steps.env.outputs.SITE_ID }}

      - name: Notify Deployment
        run: echo "✓ Deployed ${{ steps.env.outputs.ENVIRONMENT }} with API: ${{ steps.env.outputs.API_URL }}"
```

---

## Summary Commands

| Platform | Deploy Command |
|----------|---|
| Netlify | `netlify deploy --prod --dir=dist` |
| Vercel | `vercel --prod --buildDir=dist` |
| AWS S3 | `aws s3 sync dist/ s3://bucket/` |
| Docker | `docker build -t app . && docker run app` |
| Server SSH | `scp -r dist/* user@server:/var/www/` |
| GitHub Pages | `git push origin main` (with GitHub Actions) |

**Key Point**: No matter which platform, just update `dist/config.json` to change the backend URL!
