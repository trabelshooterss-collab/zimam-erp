# Railway Deployment Guide for Zimam ERP Backend

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

## Step 1: Push Code to GitHub

```bash
cd c:\zimam---smart-cloud-erp
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

## Step 2: Deploy on Railway

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your `zimam---smart-cloud-erp` repository
4. Railway will detect it's a Python project

## Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
DEBUG=False
DJANGO_SECRET_KEY=<generate-a-new-secret-key>
ALLOWED_HOSTS=.railway.app,zimam-erp-pro.vercel.app

# Supabase Database
DATABASE_URL=postgresql://postgres.scwpavlyxhzlnibhlscv:381982@saidqqq@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
DB_NAME=postgres
DB_USER=postgres.scwpavlyxhzlnibhlscv
DB_PASSWORD=381982@saidqqq
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543

# Frontend
FRONTEND_URL=https://zimam-erp-pro.vercel.app

# AI (Optional - add later)
GEMINI_API_KEY=
```

## Step 4: Set Root Directory

In Railway **Settings**:
- **Root Directory**: `backend`
- **Start Command**: (leave empty, uses Procfile)

## Step 5: Deploy

Railway will automatically deploy. Wait for it to finish.

## Step 6: Get Backend URL

After deployment, Railway will give you a URL like:
`https://zimam-backend-production.up.railway.app`

Copy this URL - you'll need it for Vercel.

## Step 7: Update Vercel Environment Variables

Go to https://vercel.com/mohamed-saids-projects-fcfc5705/zimam-erp-pro/settings/environment-variables

Add:
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

Then redeploy Frontend on Vercel.

## Troubleshooting

If deployment fails:
1. Check Railway logs
2. Verify all environment variables are set
3. Ensure `backend` is set as root directory
