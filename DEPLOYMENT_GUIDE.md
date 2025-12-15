# 🚀 Deployment Guide - Defiéndete MX

**Last Updated:** December 11, 2025  
**Version:** 2.0.0  
**Status:** Ready for Production Deployment

---

## 📋 Pre-Deployment Checklist

- [x] Production build successful (`npm run build`)
- [x] All dependencies installed
- [x] Environment variables configured locally
- [x] Frontend tested and working
- [x] Code migrated to MongoDB
- [ ] MongoDB Atlas cluster created
- [ ] Production environment variables prepared
- [ ] Deployment platform account ready

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in
3. Create a new project named "DefiendeteMX"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **M0 Free Tier** (512 MB storage, perfect for starting)
3. Select a cloud provider and region (preferably closest to your users)
   - Recommended: AWS - US East (N. Virginia) or GCP - Iowa
4. Name your cluster: `defiendete-mx-cluster`
5. Click "Create Cluster" (takes 3-5 minutes)

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `defiendete-admin`
5. Password: Generate a secure password (save it securely!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, restrict to your deployment platform's IPs
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string:
   ```
   mongodb+srv://defiendete-admin:<password>@defiendete-mx-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `defiendete-mx`
   ```
   mongodb+srv://defiendete-admin:YOUR_PASSWORD@defiendete-mx-cluster.xxxxx.mongodb.net/defiendete-mx?retryWrites=true&w=majority
   ```

---

## 🔐 Step 2: Prepare Environment Variables

Create a secure file with your production environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://defiendete-admin:YOUR_PASSWORD@defiendete-mx-cluster.xxxxx.mongodb.net/defiendete-mx?retryWrites=true&w=majority

# JWT Secrets (GENERATE NEW ONES FOR PRODUCTION!)
JWT_SECRET=GENERATE_A_SECURE_RANDOM_STRING_HERE_AT_LEAST_32_CHARS
JWT_REFRESH_SECRET=GENERATE_ANOTHER_SECURE_RANDOM_STRING_HERE_AT_LEAST_32_CHARS

# JWT Expiration
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Twilio (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Environment
NODE_ENV=production
```

### Generate Secure Secrets

Use one of these methods to generate secure JWT secrets:

**Method 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Method 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Method 3: Online Generator**
- Visit: https://generate-secret.vercel.app/32

---

## 🚀 Step 3: Deploy to Vercel (Recommended)

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy
```bash
cd /vercel/sandbox
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `defiendete-mx`
- In which directory is your code located? `./`
- Want to override settings? **N**

### 3.4 Add Environment Variables
```bash
# Add MongoDB URI
vercel env add MONGODB_URI production

# Add JWT Secret
vercel env add JWT_SECRET production

# Add JWT Refresh Secret
vercel env add JWT_REFRESH_SECRET production

# Add other variables
vercel env add JWT_EXPIRES_IN production
vercel env add JWT_REFRESH_EXPIRES_IN production
vercel env add NODE_ENV production
```

Or add them via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with value and select "Production"

### 3.5 Deploy to Production
```bash
vercel --prod
```

### 3.6 Verify Deployment
1. Visit the deployment URL provided by Vercel
2. Test the homepage
3. Test navigation
4. Try to register a new account
5. Try to login
6. Check browser console for errors

---

## 🌐 Step 4: Deploy to Cloudflare Pages (Alternative)

### 4.1 Install Wrangler CLI
```bash
npm install -g wrangler
```

### 4.2 Login to Cloudflare
```bash
wrangler login
```

### 4.3 Build the Application
```bash
npm run build
```

### 4.4 Deploy
```bash
wrangler pages deploy .next --project-name=defiendete-mx
```

### 4.5 Add Environment Variables
1. Go to Cloudflare Dashboard
2. Select "Pages"
3. Select your project
4. Go to Settings → Environment Variables
5. Add all production environment variables

### 4.6 Redeploy
```bash
wrangler pages deploy .next --project-name=defiendete-mx
```

---

## 🔍 Step 5: Post-Deployment Verification

### 5.1 Functional Testing

**Homepage:**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] SOS button visible
- [ ] Scenarios display correctly
- [ ] Footer links work

**Resources Page:**
- [ ] All 6 PDF resources display
- [ ] Download buttons work (may show placeholder)

**Constitution Page:**
- [ ] Page loads correctly
- [ ] Practical tips display
- [ ] Buttons are functional

**Authentication:**
- [ ] Registration page loads
- [ ] Can create a new account
- [ ] Receives success/error messages
- [ ] Login page loads
- [ ] Can login with created account
- [ ] Redirects to protected pages after login
- [ ] Logout works correctly

**Protected Routes:**
- [ ] Voice recorder requires authentication
- [ ] Redirects to login when not authenticated
- [ ] Accessible after login

### 5.2 API Testing

Test each API endpoint using curl or Postman:

**Register:**
```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Get User Profile:**
```bash
curl https://your-domain.com/api/auth/me \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

### 5.3 Performance Testing

**Run Lighthouse Audit:**
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance", "Accessibility", "Best Practices", "SEO", "PWA"
4. Click "Generate report"

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90
- PWA: > 80

### 5.4 Database Verification

**Check MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Verify databases and collections are created:
   - `users` collection
   - `issues` collection
   - `chats` collection
   - `notifications` collection
   - `voicerecordings` collection
   - `governmentreports` collection

---

## 🔧 Step 6: Configure Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### For Cloudflare Pages:
1. Go to Project Settings → Custom Domains
2. Add your domain
3. DNS automatically configured if domain is on Cloudflare
4. SSL certificate automatic

---

## 📊 Step 7: Set Up Monitoring

### 7.1 Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 7.2 Analytics (Google Analytics)
```bash
npm install @next/third-parties
```

Add to `app/layout.js`:
```javascript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### 7.3 Uptime Monitoring
- Use UptimeRobot: https://uptimerobot.com
- Or Vercel Analytics (built-in)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### MongoDB Connection Fails
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure password doesn't contain special characters (URL encode if needed)
- Test connection locally first

### Environment Variables Not Working
- Ensure variables are set for "Production" environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### 500 Errors on API Routes
- Check server logs in Vercel/Cloudflare dashboard
- Verify MongoDB connection
- Check environment variables are set
- Ensure all dependencies are installed

---

## 📞 Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Next.js Documentation:** https://nextjs.org/docs

---

## ✅ Deployment Complete!

Once all steps are completed and verified:

1. ✅ MongoDB Atlas configured
2. ✅ Environment variables set
3. ✅ Application deployed
4. ✅ Custom domain configured (optional)
5. ✅ All tests passing
6. ✅ Monitoring set up

**Your Defiéndete MX platform is now live and protecting citizens' rights! 🎉**

---

**Deployed By:** _____________  
**Deployment Date:** _____________  
**Production URL:** _____________  
**MongoDB Cluster:** _____________
