# Deployment Guide - GM University Admission Portal

## 🚀 Deployment Options (Choose One)

### Option 1: GitHub Pages (Free, Easiest)
### Option 2: Netlify (Free, Recommended)
### Option 3: Vercel (Free)
### Option 4: Firebase Hosting (Free)
### Option 5: Traditional Web Hosting (Paid)

---

## ✅ OPTION 1: Deploy to GitHub Pages (Free)

### Step 1: Create GitHub Account
1. Go to https://github.com/signup
2. Create account
3. Verify email

### Step 2: Create Repository
1. Go to https://github.com/new
2. Repository name: `gmu-admission-portal`
3. Description: `GM University Davangere Admission Portal`
4. Select "Public"
5. Click "Create repository"

### Step 3: Push Files to GitHub
1. Open PowerShell in your project folder
2. Run these commands:

```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal"

# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/gmu-admission-portal.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: GM University Admission Portal"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** tab
3. Go to **Pages** (left menu)
4. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"
6. Wait 1-2 minutes

### Step 5: Your Site is Live!
**URL:** `https://YOUR_USERNAME.github.io/gmu-admission-portal`

---

## ✅ OPTION 2: Deploy to Netlify (Recommended)

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign up"
3. Sign up with GitHub (easiest) or email

### Step 2: Connect GitHub Repository
1. Click "New site from Git"
2. Select GitHub
3. Find `gmu-admission-portal` repository
4. Click "Connect"

### Step 3: Build Settings (Leave as default)
- Build command: (leave empty)
- Publish directory: `.` (current folder)

### Step 4: Deploy
1. Click "Deploy site"
2. Wait 30 seconds

### Step 5: Your Site is Live!
**URL:** `https://YOUR_SITE_NAME.netlify.app`

**To customize domain:**
1. Go to Site settings
2. Change site name to something like: `gmu-admissions`
3. New URL: `https://gmu-admissions.netlify.app`

---

## ✅ OPTION 3: Deploy to Vercel (Free)

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub

### Step 2: Import Project
1. Click "Add New Project"
2. Click "Import Git Repository"
3. Paste: `https://github.com/YOUR_USERNAME/gmu-admission-portal`
4. Click "Import"

### Step 3: Deploy
1. Framework: Select "Other"
2. Click "Deploy"
3. Wait 1-2 minutes

### Step 4: Your Site is Live!
**URL:** `https://gmu-admission-portal.vercel.app`

---

## ✅ OPTION 4: Deploy to Firebase Hosting (Free)

### Step 1: Create Firebase Project
1. Go to https://firebase.google.com
2. Click "Get Started"
3. Click "Create a project"
4. Project name: `GM University Admission`
5. Click "Continue"

### Step 2: Install Firebase CLI
```powershell
# Install Node.js first from https://nodejs.org

npm install -g firebase-tools
```

### Step 3: Login to Firebase
```powershell
firebase login
```
(This opens browser - log in with your Google account)

### Step 4: Initialize Firebase
```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal"

firebase init hosting
```

When prompted:
- Select project: Choose your Firebase project
- Public directory: `.` (current)
- Configure as single-page app: `No`

### Step 5: Deploy
```powershell
firebase deploy
```

### Step 6: Your Site is Live!
**URL:** `https://YOUR_PROJECT_ID.web.app`

---

## 🔧 Update Google OAuth for Deployed URL

After deployment, update OAuth redirect URIs:

### In Google Cloud Console:
1. Go to **Credentials** → **OAuth 2.0 Client IDs**
2. Click to edit
3. Add these **Authorized JavaScript Origins:**
   ```
   https://YOUR_DEPLOYED_URL.com
   https://www.YOUR_DEPLOYED_URL.com
   ```
4. Add these **Authorized Redirect URIs:**
   ```
   https://YOUR_DEPLOYED_URL.com/index.html
   https://www.YOUR_DEPLOYED_URL.com/index.html
   ```
5. Save

---

## 📊 Comparison

| Feature | GitHub Pages | Netlify | Vercel | Firebase |
|---------|-------------|---------|--------|----------|
| Cost | Free | Free | Free | Free |
| Ease | Easy | Very Easy | Very Easy | Medium |
| Speed | Good | Excellent | Excellent | Good |
| Custom Domain | Yes | Yes | Yes | Yes |
| Build Tools | Limited | Yes | Yes | Yes |
| Best For | Static Sites | Web Apps | Web Apps | Web Apps |

---

## 🎯 Recommended: Deploy to Netlify

**Why Netlify:**
- ✅ Easiest setup (1-2 clicks)
- ✅ Automatic deployments when you push to GitHub
- ✅ Free custom domain support
- ✅ Best for admission portals
- ✅ Supports form submissions

---

## 📝 Step-by-Step (Netlify - Recommended)

### 1. Prepare Files (Already Done!)
Your files are ready in: `C:\Users\Relanto\Downloads\Admission Portal`

### 2. Push to GitHub
```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal"
git init
git remote add origin https://github.com/YOUR_USERNAME/gmu-admission-portal.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 3. Deploy on Netlify
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select repository
5. Click "Deploy"
6. Done! 🎉

### 4. Get Your URL
After deployment, Netlify gives you a URL like:
`https://gmu-admissions.netlify.app`

### 5. Update Google OAuth
Add your Netlify URL to Google Cloud Console redirect URIs.

---

## ✅ Testing After Deployment

1. Open your deployed URL
2. Click "Apply" in navigation
3. Try "Sign in with Google"
4. Should work perfectly!

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

**On Netlify:**
1. Go to Site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter your domain: `admissions.gmu.ac.in`
5. Follow DNS setup instructions

**On Google Cloud Console:**
1. Add domain to redirect URIs:
   ```
   https://admissions.gmu.ac.in
   https://admissions.gmu.ac.in/index.html
   ```

---

## 📋 Deployment Checklist

### Before Deploying:
- [ ] All files are in one folder
- [ ] No sensitive data in code
- [ ] Google Client ID is valid
- [ ] CSS and JS files linked correctly

### After Deploying:
- [ ] Site loads without errors
- [ ] Navigation works
- [ ] Form submissions work (if backend ready)
- [ ] Google OAuth works
- [ ] Dark mode works
- [ ] Email verification works
- [ ] Phone verification works
- [ ] Mobile responsive

### Update Google OAuth:
- [ ] Add deployed URL to JS Origins
- [ ] Add deployed URL to Redirect URIs
- [ ] Test sign in

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Files not loading | Check file paths are relative (not absolute) |
| Google OAuth not working | Add deployed URL to redirect URIs in Google Console |
| 404 errors | Make sure all files are in root folder |
| Styles not loading | Check CSS file path in HTML |
| Forms not working | Ensure backend is ready (if needed) |

---

## 🎉 Your Admission Portal is Live!

Once deployed:
- ✅ Accessible 24/7
- ✅ HTTPS secured
- ✅ Fast loading
- ✅ Google OAuth working
- ✅ Email/Phone verification working
- ✅ Dark mode working
- ✅ Mobile responsive

---

## 📞 Support

For each platform:
- **GitHub Pages:** https://docs.github.com/en/pages
- **Netlify:** https://docs.netlify.com
- **Vercel:** https://vercel.com/docs
- **Firebase:** https://firebase.google.com/docs

