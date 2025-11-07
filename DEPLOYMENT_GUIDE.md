# ApplySimple Deployment Guide

## Environment Variables Setup

You need to configure the following environment variables in your Vercel project settings.

### Required Environment Variables

#### 1. DATABASE_URL
**Purpose**: PostgreSQL database connection string from Neon

**How to get it**:
1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Click on "Connection Details"
4. Copy the connection string (it should look like the example below)

**Format**:
```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

**Example**:
```
postgresql://applysimple_user:AbCdEf123456@ep-cool-sound-12345.us-east-2.aws.neon.tech/applysimple?sslmode=require
```

**Where to set it**: Vercel Project Settings → Environment Variables

---

#### 2. NEXTAUTH_SECRET
**Purpose**: Secret key used to encrypt session tokens

**How to generate it**:
Run this command in your terminal:
```bash
openssl rand -base64 32
```

**Example output**:
```
wX8fY2mN9pQ4rT7sV1uK5nL3jH6gD0cB9aE2fR8tY4wX
```

**Where to set it**: Vercel Project Settings → Environment Variables

---

#### 3. NEXTAUTH_URL
**Purpose**: The full URL of your deployed application

**Format**:
```
https://your-app-name.vercel.app
```

**Example**:
```
https://applysimple.vercel.app
```

**Important**:
- Wait until after your first Vercel deployment to get your actual URL
- Then add this environment variable
- Redeploy after adding it

**Where to set it**: Vercel Project Settings → Environment Variables

---

## Step-by-Step Deployment Process

### Step 1: Set up Neon PostgreSQL Database

1. Go to https://neon.tech and sign up (you can use GitHub)
2. Create a new project:
   - **Project name**: applysimple (or your choice)
   - **Postgres version**: 16 (recommended) or latest stable
   - **Region**: Choose closest to your users (e.g., US East for North America)
   - **Cloud provider**: AWS (recommended)
   - **Enable Neon Auth**: No (not needed for this project)
3. After creation, copy your connection string from "Connection Details"

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `Mitchell-Hess/ApplySimple`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **BEFORE deploying**, add environment variables:
   - Click "Environment Variables"
   - Add `DATABASE_URL` with your Neon connection string
   - Add `NEXTAUTH_SECRET` with generated secret
   - Skip `NEXTAUTH_URL` for now (we'll add it after first deploy)

6. Click "Deploy"

### Step 3: Complete Environment Variables

1. After deployment finishes, copy your Vercel URL (e.g., `https://applysimple.vercel.app`)
2. Go to Project Settings → Environment Variables
3. Add `NEXTAUTH_URL` with your Vercel URL
4. Redeploy the project (Settings → Deployments → click the three dots → "Redeploy")

### Step 4: Run Database Migrations

After your app is deployed, you need to create the database tables:

1. Open your terminal
2. Navigate to the frontend directory:
   ```bash
   cd /home/hessm/projects/applysimple/frontend
   ```

3. Set your DATABASE_URL temporarily (use the same one from Vercel):
   ```bash
   export DATABASE_URL="postgresql://[your-connection-string]"
   ```

4. Run the migration:
   ```bash
   npx prisma migrate deploy
   ```

5. Verify migration succeeded - you should see:
   ```
   ✓ All migrations have been successfully applied
   ```

### Step 5: Create Your First User

Since this is a fresh database, create your first user account:

1. Go to your deployed app: `https://your-app.vercel.app`
2. Click "Sign Up"
3. Create an account with your email and password
4. You should be automatically signed in and redirected to the dashboard

### Step 6: Test Your Deployment

Test the following features:
- ✓ Sign up and sign in
- ✓ Add a new application
- ✓ View statistics
- ✓ Import CSV data
- ✓ Dark mode toggle
- ✓ Sign out

---

## Troubleshooting

### Issue: "Invalid DATABASE_URL"
**Solution**: Make sure your connection string includes `?sslmode=require` at the end

### Issue: "NEXTAUTH_SECRET must be provided"
**Solution**: Generate a new secret and add it to environment variables, then redeploy

### Issue: "Database connection failed"
**Solution**:
1. Check that your Neon database is active (not in sleep mode)
2. Verify the DATABASE_URL is correct
3. Check Neon dashboard for any connection issues

### Issue: "Authentication not working"
**Solution**:
1. Make sure NEXTAUTH_URL matches your exact Vercel URL
2. Ensure all three environment variables are set
3. Redeploy after adding environment variables

### Issue: Tables don't exist
**Solution**: Run `npx prisma migrate deploy` to create database tables

---

## Security Notes

- Never commit `.env` files to Git
- Never share your DATABASE_URL or NEXTAUTH_SECRET publicly
- Rotate your NEXTAUTH_SECRET periodically
- Use strong passwords for user accounts
- Consider enabling Neon's IP allowlist for additional security

---

## Updating Your Deployment

Whenever you push changes to GitHub:
1. Vercel will automatically redeploy
2. No need to run migrations again (unless you changed the schema)
3. Environment variables persist between deployments

---

## Local Development vs Production

**Local Development** (what you've been doing):
- Uses local PostgreSQL database
- Environment variables in `.env` file
- Running on `http://localhost:3000`

**Production** (Vercel):
- Uses Neon PostgreSQL database
- Environment variables in Vercel settings
- Running on `https://your-app.vercel.app`

Both environments are separate - changes in one don't affect the other!
