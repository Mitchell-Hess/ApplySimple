# Deploying ML Service to Railway

## Prerequisites
- GitHub account (to connect Railway to your repo)
- Railway account (free tier available at https://railway.app)

## Deployment Steps

### 1. Push ML Service to GitHub

First, make sure your ml_service folder is committed to your GitHub repository:

```bash
cd /home/hessm/projects/applysimple
git add ml_service/
git commit -m "Prepare ML service for Railway deployment"
git push origin main
```

### 2. Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

### 3. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `applysimple` repository
4. Railway will detect the Dockerfile automatically

### 4. Configure Service

1. After Railway creates the project, click on your service
2. Go to "Settings" tab
3. Set the **Root Directory** to: `ml_service`
4. Railway will automatically:
   - Detect the Dockerfile
   - Build and deploy the service
   - Assign a public URL

### 5. Get Your Railway URL

1. Once deployed, go to the "Settings" tab
2. Under "Networking" section, you'll see your public domain
3. It will look like: `https://your-service-name.up.railway.app`
4. Copy this URL

### 6. Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your `applysimple` project
3. Go to Settings → Environment Variables
4. Find `ML_SERVICE_URL` and update it to your Railway URL
5. Example: `https://your-service-name.up.railway.app`
6. Click "Save"
7. Redeploy your Vercel app for changes to take effect

### 7. Test the Deployment

Visit your Railway URL to see if the service is running:
- Health check: `https://your-service-name.up.railway.app/health`
- You should see: `{"status": "healthy", "timestamp": "...", "model_loaded": true}`

## Troubleshooting

### Service won't start
- Check the Railway logs in the "Deployments" tab
- Verify the Dockerfile is correct
- Ensure all dependencies are in requirements.txt

### CORS errors
- Verify your production domain is in the CORS allow_origins list in main.py
- The current list includes:
  - https://applysimple.xyz
  - https://www.applysimple.xyz
  - https://applysimple.vercel.app

### 502 Bad Gateway
- Service might be starting up (wait 1-2 minutes)
- Check Railway logs for errors

## Cost

Railway offers:
- Free tier: $5 credit per month (enough for this small service)
- Paid tier: $5/month + usage

The ML service is lightweight and should easily fit within the free tier.

## Alternative: Deploy with Railway CLI

If you prefer using the CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd /home/hessm/projects/applysimple/ml_service
railway init

# Deploy
railway up
```
