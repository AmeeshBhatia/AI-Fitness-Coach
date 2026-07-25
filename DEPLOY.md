# Deploying to Vercel

The app is entirely client-side, so deployment is just static hosting.
`vercel.json` handles the config — it serves `public/` and skips the build step.
`server.js` is **only** for local development and isn't used in production.

---

## Deploy from the terminal

From inside the `ai-fitness-coach` folder:

```bash
npx vercel login
npx vercel --prod
```

Accept the defaults when prompted. `--prod` publishes to your live URL; running
`npx vercel` without it creates a preview deployment instead.

---

## Deploy from GitHub (auto-deploy on every push)

**1. Push the code**

```bash
git init
git add .
git commit -m "AI Fitness Coach"
git branch -M main
git remote add origin https://github.com/AmeeshBhatia/AI-Fitness-Coach.git
git push -u origin main
```

**2. Import into Vercel**

1. Go to https://vercel.com/new
2. **Import** the `AI-Fitness-Coach` repo
3. Change nothing — `vercel.json` already sets the output directory and no build step
4. **Deploy**

Vercel then redeploys on every push to `main`, and gives each pull request its
own preview URL.

> If the project already exists on Vercel from a CLI deploy, connect the repo
> instead: project → **Settings → Git → Connect Git Repository**.

---

## After deploying — check these

1. **Open the live URL** and complete onboarding once. If the page is blank,
   open DevTools (F12) → Console and look for a failed import.
2. **Hard-refresh** (`Ctrl+Shift+R`) and confirm your plan is still there —
   that verifies `localStorage` works on the live domain.
3. **Open it on your phone.** The layout is mobile-first.

---

## Things worth knowing

**User data is per-device.** Everything lives in the browser's `localStorage`,
so a plan doesn't sync between phone and laptop, and clearing site data wipes
it. Adding accounts means adding a backend — `public/js/lib/store.js` is the
only module that touches persistence.

**Caching deliberately revalidates.** The JS/CSS filenames aren't
content-hashed, so aggressive caching would leave users on stale code after a
deploy. If you later add a build step with hashed filenames, switch those
`Cache-Control` headers to `public, max-age=31536000, immutable`.

**A Content-Security-Policy is enabled** in `vercel.json`. It allows only
same-origin scripts plus inline styles (used by the macro and progress bars).
If you add a CDN script, web font, or analytics tag, you must add that domain
to the matching CSP directive or the browser will block it — and it fails
silently apart from a console error.

**No environment variables or secrets are needed.** No API key, no database,
no server. Nothing to leak, no runtime cost.

**Never commit `.vercel/`.** It's created by the CLI and holds machine-specific
project IDs. It's already in `.gitignore`.

---

## Custom domain (later)

Project → **Settings → Domains → Add**. Vercel shows the exact DNS records for
your registrar — usually an `A` record to `76.76.21.21` for an apex domain, or a
`CNAME` to `cname.vercel-dns.com` for a subdomain. HTTPS is automatic once DNS
propagates.

---

## Troubleshooting

**404 on the deployed URL** — the output directory isn't set. This happens if
`vercel.json` was missing when you first deployed. Fix it in project →
**Settings → Build & Deployment → Output Directory** → `public`, then redeploy.

**Page loads but nothing renders** — almost always a module path problem. Paths
are case-sensitive on Vercel's Linux servers but not on Windows, so
`todayView.js` vs `TodayView.js` works locally and breaks in production.

**Changes aren't showing up** — you deployed a preview, not production. Run
`npx vercel --prod`, then hard-refresh.
