# Deployment Guide

## 🚀 Deploying Trust Skin Hub with Mystery Box Integration

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrated (if using single Supabase)
- [ ] Build succeeds without errors
- [ ] Performance metrics validated
- [ ] SEO tags verified

---

## Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Preview production build locally
npm run preview
```

Build output: `dist/`

---

## Deployment Options

### Option 1: Lovable Cloud (Recommended)

**Automatic Deployment**:
1. Push to GitHub main branch
2. Lovable automatically builds and deploys
3. Configure environment variables in Lovable dashboard

**Manual Deployment via Lovable**:
1. Go to [Lovable Project](https://lovable.dev)
2. Connect GitHub repository
3. Click "Share" → "Publish"
4. Configure domain and environment

**Environment Variables in Lovable**:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY

# Deploy to production
vercel --prod
```

**Or via Vercel Dashboard**:
1. Import GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Add environment variables
4. Deploy

### Option 3: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Or connect via Netlify dashboard
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 4: Custom Server

```bash
# Build
npm run build

# Serve with any static file server
npx serve dist -p 3000

# Or use nginx, Apache, Caddy, etc.
```

---

## Environment Configuration

### Development

```env
# .env (local development)
VITE_SUPABASE_PROJECT_ID=aclxqriujtkpqceqtesg
VITE_SUPABASE_URL=https://aclxqriujtkpqceqtesg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production

**Same variables**, but configured in deployment platform:
- Lovable Cloud: Project Settings → Environment
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment

---

## Database Setup for Production

### Before First Deployment

**If Using Single Supabase** (Recommended):
1. Migrate mystery box tables to Trust Skin Hub Supabase
2. Update `src/hooks/useUnifiedBoxData.ts` to use main client
3. Verify all data imported correctly

**If Using Dual Supabase** (Temporary):
- Mystery boxes will continue using RillaBox Supabase
- Works immediately without migration
- Higher operational costs

### Migration Steps

See `docs/DATABASE_SETUP.md` for complete migration guide:

```bash
# Quick migration
1. Run SQL in Trust Skin Hub Supabase (create tables)
2. Export data from RillaBox Supabase
3. Import to Trust Skin Hub Supabase
4. Update useUnifiedBoxData.ts
5. Test locally
6. Deploy
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check homepage
curl https://your-domain.com

# Check mystery boxes
curl https://your-domain.com/mystery-boxes

# Check operators
curl https://your-domain.com/operators
```

### 2. Test Functionality

- [ ] Homepage loads
- [ ] Operators page loads
- [ ] Mystery Box Hub loads
- [ ] Filtering works
- [ ] Search works
- [ ] Images load
- [ ] Admin panel accessible (requires auth)

### 3. Performance Check

Use Google PageSpeed Insights or Lighthouse:
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### 4. SEO Verification

- [ ] Meta tags present
- [ ] sitemap.xml accessible
- [ ] robots.txt configured
- [ ] Canonical tags set

---

## Monitoring

### Supabase Dashboard

Monitor database performance:
- Query performance
- Row counts
- Storage usage
- API requests

**Link**: https://supabase.com/dashboard/project/aclxqriujtkpqceqtesg

### Application Monitoring

Consider adding:
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)
- Vercel Analytics (if using Vercel)

---

## Rollback Procedure

### If Deployment Fails

**Lovable**:
1. Go to deployment history
2. Click previous successful deployment
3. Click "Redeploy"

**Vercel/Netlify**:
1. Go to deployments
2. Find last working version
3. Click "Redeploy"

**Git**:
```bash
git revert HEAD
git push origin main
```

### If Database Issues

```bash
# Restore from backup
psql "postgresql://..." < backup_YYYYMMDD.sql
```

---

## Domain Setup

### Custom Domain

**Lovable**:
1. Project Settings → Domains
2. Click "Connect Domain"
3. Add your domain
4. Follow DNS configuration instructions

**Vercel/Netlify**:
1. Project Settings → Domains
2. Add domain
3. Configure DNS records

### DNS Configuration

```
Type: CNAME
Name: www (or @)
Value: [provided by platform]
```

---

## SSL/HTTPS

All platforms provide automatic SSL certificates:
- Lovable: Automatic
- Vercel: Automatic
- Netlify: Automatic

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --mode production

# Check for large dependencies
npx vite-bundle-visualizer
```

### Image Optimization

- Use WebP format when possible
- Compress images before upload
- Implement lazy loading (already done)
- Use appropriate image sizes

### Caching

Add cache headers for static assets:

```
# Vercel (vercel.json)
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changing .env
- Verify variable names match exactly

### Database Connection Errors

- Check Supabase project status
- Verify credentials in environment
- Test with Supabase SQL Editor

---

## Continuous Deployment

### GitHub Actions (Example)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Scaling Considerations

### Database

- Monitor query performance
- Add indexes for slow queries
- Consider read replicas for high traffic
- Upgrade Supabase plan if needed

### Frontend

- Implement CDN for static assets
- Use edge functions for API routes
- Consider ISR (Incremental Static Regeneration)

---

**Last Updated**: October 2, 2025


