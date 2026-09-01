# Deployment Guide — Wisdom In The Streets Podcast Website

This guide covers deploying the website to production.

## Pre-Deployment Checklist

- [ ] All environment variables set in `.env`
- [ ] Run `npm run typecheck` to verify TypeScript
- [ ] Run `npm run build` to verify build succeeds
- [ ] Test locally with `npm run preview`
- [ ] All links point to correct URLs
- [ ] Analytics ID configured
- [ ] Contact form endpoint configured (Formspree/custom API)
- [ ] Newsletter endpoint configured (Mailchimp/ConvertKit)

## Option 1: Deploy to Vercel (Recommended)

### Setup
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import the GitHub repository
4. Framework: Select "Vite"
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
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

### Custom Domain
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `witspodcast.com`)
3. Update DNS records with Vercel's nameservers

## Option 2: Deploy to Netlify

### Setup
1. Go to [netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Deploy

### Environment Variables
In Netlify Dashboard → Site settings → Build & deploy → Environment:
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

### Custom Domain
1. Go to Domain settings → Custom domain
2. Add your domain and follow DNS setup

## Option 3: Deploy to GitHub Pages

### Setup
1. Add to `package.json`:
```json
"homepage": "https://username.github.io/repo-name"
```

2. Add deployment script:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Run: `npm run deploy`

*Note: Use hash routing (already configured) for GitHub Pages.*

## Post-Deployment

1. **Test the live site** — navigate all pages, check links
2. **Verify analytics** — check GA4 dashboard
3. **Test contact form** — submit a test message
4. **Verify podcast links** — click through to all platforms
5. **Check SEO** — verify meta tags in DevTools
6. **Performance** — run through Google PageSpeed Insights
7. **Security** — check SSL/HTTPS is enabled (automatic on Vercel/Netlify)

## Production Performance Tips

- Static assets cached for 1 year
- HTML cached for 1 hour
- API responses not cached
- CSS/JS minified and tree-shaken by Vite
- Images optimized in Tailwind

## Rollback

If issues occur:
- **Vercel**: Click "Deployments" tab, select previous version, click "Promote to Production"
- **Netlify**: Go to "Deploys" tab, select previous deploy, click "Publish deploy"

## Monitoring

- Check error logs in hosting dashboard
- Monitor performance in analytics
- Set up alerts for build failures
- Regular security updates for dependencies

## Support

For deployment issues:
- Check the README.md
- Review `.env.example` for all required variables
- Verify build succeeds locally: `npm run build`
- Check hosting provider's documentation

---

*Built on the corner — Accra → everywhere.*
