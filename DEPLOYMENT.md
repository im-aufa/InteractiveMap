# Deployment Guide 🚀

This interactive map application is built with **Next.js 16**, making it extremely easy to deploy to modern hosting platforms.

## Option 1: Vercel (Recommended) 
Vercel is the creator of Next.js and provides the best performance and zero-configuration deployment.

### Steps:
1.  **Push your code to GitHub**, GitLab, or Bitbucket.
2.  **Sign up/Login to [Vercel](https://vercel.com/)**.
3.  Click **"Add New..."** -> **"Project"**.
4.  **Import** your `interactive-map-app` repository.
5.  **Configure Project**:
    *   **Framework Preset**: Next.js (Should be auto-detected)
    *   **Root Directory**: `interactive-map-app` (Important! Since your app is inside this folder, not the root of the repo).
    *   **Environment Variables**: 
        *   If you plan to use the data extraction scripts in the cloud (optional), add your `OPENAI_API_KEY`.
        *   For just the frontend map, **NO environment variables are needed**.
6.  Click **Deploy**.

Vercel will build your site and give you a simplified URL (e.g., `interactive-map-app.vercel.app`).

---

## Option 2: Netlify
Netlify is another excellent option for static and serverless sites.

### Steps:
1.  **Push your code** to a git provider.
2.  **Login to [Netlify](https://www.netlify.com/)**.
3.  Click **"Add new site"** -> **"Import from an existing project"**.
4.  Select your provider (GitHub/GitLab/etc).
5.  **Build Settings**:
    *   **Base directory**: `interactive-map-app`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next` (Netlify usually auto-detects Next.js)
6.  Click **Deploy**.

---

## Option 3: Static Export (GitHub Pages)
If you must use GitHub Pages (which only supports static files and **cannot** run the Next.js image optimization server), you need to change your configuration.

### 1. Update `next.config.ts`
Add `output: 'export'` and disable image optimization:

```typescript
const nextConfig: NextConfig = {
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for GitHub Pages
    remotePatterns: [...], 
  },
};
```

### 2. Build & Deploy
Run `npm run build`. This will create an `out` folder. You can then upload the contents of `out` to your hosting provider.

> **Note:** Vercel (Option 1) is free for hobby projects and supports all Next.js features (Image Optimization, etc.) out of the box, whereas Static Export has limitations.
