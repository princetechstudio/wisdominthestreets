# 🚀 Go Live Guide — Wisdom In The Streets Podcast Website

**Status:** ✅ Production Ready | **Build Size:** ~475 KB (minified)

---

## Quick Start: Deploy in 5 Minutes

### Choose Your Platform

#### **Option A: Vercel** (Recommended - Fastest Setup)
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import GitHub repository
# 4. Set environment variables
# 5. Click "Deploy"
```

#### **Option B: Netlify**
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to https://app.netlify.com/start
# 3. Connect GitHub
# 4. Set build command: npm run build
# 5. Set publish directory: dist
```

#### **Option C: Manual Deployment**
```bash
# Build locally
npm run build

# Upload dist/ folder to your hosting provider
# Point domain DNS to hosting provider
```

---

## Step-by-Step: Deploy to Vercel

### Prerequisites
- GitHub account with repository
- Vercel account (free)
- Custom domain (optional but recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready: optimized build, SEO, deployment configs"
git push origin main
```

### 2. Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Continue with GitHub"
3. Select your repository
4. Configure:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
VITE_SPOTIFY_SHOW_URL=https://open.spotify.com/show/wisdom-in-the-streets
VITE_APPLE_PODCASTS_URL=https://podcasts.apple.com/show/wisdom-in-the-streets
VITE_YOUTUBE_CHANNEL_URL=https://youtube.com/@WITSPodcast
VITE_RSS_FEED_URL=https://witspodcast.com/feed.xml
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
VITE_NEWSLETTER_ACTION=https://YOUR_DC.api.mailchimp.com/3.0/lists/YOUR_LIST_ID
VITE_WHATSAPP_NUMBER=233273996065
VITE_GA_ID=G-XXXXXXXXXX
VITE_PODTRAC_PREFIX=https://dts.podtrac.com/redirect.mp3/
```

### 4. Deploy
Click "Deploy" button → Wait 2-3 minutes → ✅ Live!

Your site is now at: `https://<project-name>.vercel.app`

### 5. Connect Custom Domain
1. Go to Settings → Domains
2. Add domain (e.g., `witspodcast.com`)
3. Update DNS records with Vercel's nameservers
4. Wait 24-48 hours for DNS propagation

---

## Step-by-Step: Deploy to Netlify

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com/start](https://app.netlify.com/start)
2. Click "Connect to Git"
3. Select "GitHub" → Authorize → Choose repository

### 3. Configure Build Settings
- Build Command: `npm run build`
- Publish Directory: `dist`
- Click "Deploy Site"

### 4. Add Environment Variables
1. Site settings → Build & deploy → Environment
2. Add all variables from the "Vercel" section above
3. Redeploy

### 5. Connect Custom Domain
1. Domain settings → Custom domain
2. Add your domain
3. Update DNS records as instructed

---

## Verify Everything Works

### ✅ Immediate Tests (After Deploy)
```bash
# Test homepage loads
curl https://witspodcast.com

# Check robots.txt
curl https://witspodcast.com/robots.txt

# Check sitemap
curl https://witspodcast.com/sitemap.xml
```

### ✅ In-Browser Tests
- [ ] Homepage loads and displays correctly
- [ ] Dark/light theme toggle works
- [ ] Navigation to all pages works
- [ ] Audio player visible and functional
- [ ] Podcast platform links open correctly
- [ ] Contact form submits
- [ ] Newsletter signup works
- [ ] WhatsApp link opens
- [ ] Social links point to correct accounts

### ✅ SEO & Performance
- [ ] Google Search Console - submit sitemap
- [ ] Google Analytics - verify tracking code works
- [ ] PageSpeed Insights - score above 80
- [ ] Meta tags visible in page source
- [ ] Open Graph tags work (test on Twitter/Facebook)

### ✅ Security
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] No console errors
- [ ] No mixed content warnings
- [ ] Security headers present

---

## Production Build Statistics

**Total Size:** 475 KB
- HTML: 6.26 KB
- CSS: 57.52 KB (10.21 KB gzip)
- React Vendor: 166.05 KB (54.38 KB gzip)
- Animation: 123.59 KB (41.28 KB gzip)
- App Code: 130.40 KB (35.27 KB gzip)

**Optimizations Applied:**
- ✅ Tree-shaking enabled
- ✅ Code minification
- ✅ Chunk splitting (vendor, animation, ui)
- ✅ Production source maps disabled
- ✅ Gzip compression enabled
- ✅ Immutable cache headers for assets

---

## Troubleshooting

### Build Fails
1. Run locally: `npm run build`
2. Check for TypeScript errors: `npm run typecheck`
3. Verify `.env` variables are set
4. Check build logs in hosting dashboard

### Site Shows 404
- Ensure `netlify.toml` or `vercel.json` is in root
- Hash routing is configured (URLs like `/#/episodes`)
- Verify `dist` folder is published

### Environment Variables Not Working
- Restart the deployment
- Verify variable names are exact
- Check `VITE_` prefix (required for client-side)
- Redeploy after adding new variables

### Contact Form Not Working
- Verify `VITE_FORM_ENDPOINT` is set
- Test endpoint is reachable
- Check Formspree/API dashboard

### Analytics Not Tracking
- Verify `VITE_GA_ID` is correct
- Check Google Analytics dashboard
- Wait 24 hours for data to appear

---

## Maintenance

### Regular Tasks
- [ ] Monitor analytics weekly
- [ ] Check error logs daily for 1 week post-launch
- [ ] Update dependencies monthly: `npm update`
- [ ] Run security audit: `npm audit`

### Update Content
```bash
# Edit episodes, quotes, etc. in src/data/content.ts
npm run build  # Rebuild
git push       # Deploy automatically
```

### Environment Variable Updates
1. Update in hosting dashboard
2. Redeploy or restart build

---

## Monitoring & Analytics

### Set Up Monitoring
1. **Google Analytics**
   - Create GA4 property
   - Add ID to `.env` as `VITE_GA_ID`
   - Wait 24 hours for data

2. **Error Tracking** (Optional)
   - Set up Sentry.io
   - Add Sentry key to client

3. **Uptime Monitoring** (Optional)
   - Use Statuspage.io or similar
   - Get alerts if site goes down

### Key Metrics to Monitor
- Page views
- Session duration
- Bounce rate
- Conversion rate (contact form submissions)
- Performance metrics (Largest Contentful Paint, etc.)

---

## Rollback Procedure

### If Issues Occur After Deployment

**Vercel:**
1. Go to Deployments tab
2. Find previous stable deployment
3. Click "..." → "Promote to Production"
4. Verify fix locally before redeploying

**Netlify:**
1. Go to Deploys tab
2. Select previous working deploy
3. Click "Publish deploy"

---

## Post-Launch Checklist

After going live:

- [ ] Site loads and works correctly
- [ ] All social media links point to correct accounts
- [ ] Google Search Console connected
- [ ] Analytics tracking verified
- [ ] Contact form sends emails
- [ ] Newsletter signup works
- [ ] Audio player works
- [ ] Share buttons work with correct OG tags
- [ ] Mobile responsive confirmed
- [ ] SSL certificate valid
- [ ] CDN caching working
- [ ] Error monitoring set up

---

## Next Steps

1. **Announce the launch**
   - Social media posts
   - Email to contacts
   - Podcast platforms

2. **Submit to search engines**
   - Google Search Console
   - Bing Webmaster Tools

3. **Optimize for conversion**
   - Monitor analytics
   - A/B test newsletter signup
   - Improve based on user behavior

4. **Maintain regularly**
   - Update podcast episodes
   - Fix any issues quickly
   - Keep dependencies updated

---

## Support

For deployment issues:
1. Check DEPLOYMENT.md
2. Review hosting provider docs
3. Check GitHub Actions workflow status
4. Review build logs in hosting dashboard

**Key Files:**
- [vercel.json](vercel.json) - Vercel configuration
- [netlify.toml](netlify.toml) - Netlify configuration
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - CI/CD pipeline
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide

---

**🎉 Congratulations! Your podcast website is live!**

*Built on the corner — Accra → everywhere.*
