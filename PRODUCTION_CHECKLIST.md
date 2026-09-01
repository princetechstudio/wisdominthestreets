# Production Checklist — Wisdom In The Streets

Before deploying to production, verify all items below:

## Code Quality
- [ ] TypeScript compilation passes: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] No console warnings or errors
- [ ] No TODO/FIXME comments left in code
- [ ] All dependencies are up-to-date

## Environment & Configuration
- [ ] `.env` file created with all required variables
- [ ] All API endpoints configured correctly
- [ ] Form endpoint (Formspree/custom) configured
- [ ] Newsletter service (Mailchimp/ConvertKit) configured
- [ ] Google Analytics ID added
- [ ] Podcast tracking (Podtrac/Chartable) configured if needed

## SEO & Performance
- [ ] Meta tags verified (title, description, OG tags)
- [ ] Sitemap.xml in public folder with all routes
- [ ] Robots.txt configured correctly
- [ ] Structured data (JSON-LD) is valid
- [ ] Open Graph images optimized
- [ ] Favicon appears correctly
- [ ] All links are absolute URLs for social sharing

## Functionality Testing
- [ ] Home page loads and displays correctly
- [ ] Navigation works on all pages
- [ ] Audio player works correctly
- [ ] Podcast links open to correct platforms (Spotify, Apple, YouTube, etc.)
- [ ] Contact form submits without errors
- [ ] Newsletter signup works
- [ ] WhatsApp link opens correctly
- [ ] Social media links point to correct accounts
- [ ] Theme toggle works (dark/light mode)
- [ ] Responsive design works on mobile, tablet, desktop

## Security
- [ ] HTTPS enabled on domain
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] No sensitive data in client-side code
- [ ] API keys/secrets stored only in environment variables
- [ ] All external links use HTTPS
- [ ] Email validation on contact form

## Analytics & Monitoring
- [ ] Google Analytics connected and tracking
- [ ] Form submission tracking configured
- [ ] Error tracking configured (Sentry or similar)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured

## DNS & Domain
- [ ] Domain points to hosting provider's nameservers
- [ ] SSL certificate is valid
- [ ] WWW redirect configured if applicable
- [ ] Email MX records configured (if using custom email)

## Hosting Configuration
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 20.x
- [ ] Environment variables added to hosting provider
- [ ] Cache headers configured appropriately

## Final Testing
- [ ] Full page load test
- [ ] Google PageSpeed Insights score acceptable (>80)
- [ ] Mobile-Friendly Test passes
- [ ] Lighthouse audit passes
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Test on slow network (throttle to 3G)

## Backup & Rollback
- [ ] Previous version backed up
- [ ] Rollback procedure documented
- [ ] Hotfix procedure documented

## Post-Deployment
- [ ] Monitor error logs for 24 hours
- [ ] Check analytics for unusual activity
- [ ] Verify all links still work
- [ ] Test on production domain
- [ ] Announce on social media if applicable

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Notes:** 

---

*Built on the corner — Accra → everywhere.*
