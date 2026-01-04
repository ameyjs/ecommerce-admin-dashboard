# Deployment Guide

## Quick Deployment to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas database (already set up in your `.env.local`)
- Cloudinary account (already set up)

### Step-by-Step Deployment

#### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: E-commerce dashboard"

# Create a new repository on GitHub and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### 3. Add Environment Variables

In the Vercel dashboard, add these environment variables:

```
MONGODB_URI=<your-mongodb-uri>
NEXTAUTH_SECRET=<generate-new-one>
NEXTAUTH_URL=https://your-app-name.vercel.app
ONBOARD_SECRET=<your-secret-key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-preset>
```

**Important Notes:**
- Generate a NEW `NEXTAUTH_SECRET` for production: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` to your actual Vercel deployment URL
- After first deployment, you'll get the URL - then update `NEXTAUTH_URL` and redeploy

#### 4. Deploy

Click "Deploy" and wait for Vercel to build and deploy your app (usually 1-2 minutes).

#### 5. Create Your First Admin

After deployment, visit:
```
https://your-app-name.vercel.app/onboard
```

Enter:
- Email: your admin email
- Password: create a strong password
- Secret Key: the value from your `ONBOARD_SECRET` env variable

#### 6. Login

Visit:
```
https://your-app-name.vercel.app/login
```

Login with the credentials you just created.

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |
| `ONBOARD_SECRET` | Secret for admin creation | Any secure string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset | Create in Cloudinary settings |

---

## Post-Deployment Checklist

- [ ] Test login at `/login`
- [ ] Create a test product at `/dashboard/add`
- [ ] Verify image upload works
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Verify charts are rendering
- [ ] Test logout

---

## Troubleshooting

### "Invalid secret key" on onboarding
- Double-check your `ONBOARD_SECRET` matches in Vercel environment variables

### "Cannot connect to database"
- Verify your `MONGODB_URI` is correct
- Check MongoDB Atlas network access allows Vercel's IPs (use `0.0.0.0/0` for all IPs)

### NextAuth errors
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Regenerate `NEXTAUTH_SECRET` if needed

### Images not uploading
- Verify Cloudinary credentials
- Ensure upload preset is "unsigned" in Cloudinary dashboard

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain
4. Redeploy

---

## Monitoring

Vercel provides:
- Real-time logs
- Analytics
- Performance monitoring

Access these in your Vercel dashboard.
