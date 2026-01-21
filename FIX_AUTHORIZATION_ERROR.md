# Fix: Authorization Error - OAuth 2.0 Policy Violation

## ❌ Root Cause

Your app is in **Development/Testing mode** and Google is blocking unverified apps from using OAuth.

---

## ✅ Solution: Use OAuth 2.0 Playground (Testing)

Since you're in development, use **Google OAuth 2.0 Playground** instead:

### Option 1: Use Google OAuth 2.0 Playground (Easiest for Testing)

1. Go to: https://developers.google.com/oauthplayground
2. Click settings icon (⚙️) in top right
3. Check "Use your own OAuth credentials"
4. Enter:
   - **Client ID:** `237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com`
   - **Client Secret:** `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`
5. Close settings
6. In left panel, search "Gmail API" or "Google+ API"
7. Select scopes: `https://www.googleapis.com/auth/userinfo.email`
8. Click "Authorize APIs"
9. This will give you a test token

---

## ✅ Solution 2: Add Test Users (For Development)

1. Go to **Google Cloud Console** → Your Project
2. Go to **OAuth consent screen**
3. Click **"Add Users"** under "Test users"
4. Add emails of people who should test:
   - s*****8@gmail.com (add this account)
   - Your email
   - Other test emails
5. These users can now use the app

---

## ✅ Solution 3: Verify Your App (For Production)

### Step 1: Update OAuth Consent Screen
1. Go to **Google Cloud Console** → **OAuth consent screen**
2. User Type: Select **"External"**
3. Fill in ALL required fields:
   - App name: `GM University Admission Portal`
   - User support email: `admissions@gmu.ac.in`
   - App logo: (optional but recommended)
   - Scopes: `email`, `profile`, `openid`
   - Developer contact: `admissions@gmu.ac.in`

### Step 2: Submit for Verification
1. Click "PUBLISH APP"
2. This moves your app from Testing → Production
3. Google will review (takes 1-3 days)
4. Once approved, anyone can use it

---

## 🔧 Immediate Fix for Your Error

### For Local Development Right Now:

1. **Go to Google Cloud Console**
2. **OAuth consent screen** tab
3. Scroll down to **"Test users"**
4. Click **"Add Users"**
5. Add: `s*****8@gmail.com`
6. Save
7. **Try signing in again** - error should be gone

---

## 🚨 If Still Getting Error After Adding Test User

### Issue: Redirect URI mismatch in test mode

Try this exact configuration in Google Cloud Console:

**OAuth Consent Screen:**
- User Type: `External`
- App Name: `GM University Admission Portal`
- User Support Email: `admissions@gmu.ac.in`

**OAuth 2.0 Client IDs:**
- Application Type: `Web application`

**Authorized JavaScript Origins:**
```
http://localhost:5500
http://127.0.0.1:5500
http://localhost:5500/
http://127.0.0.1:5500/
```

**Authorized Redirect URIs:**
```
http://localhost:5500/index.html
http://127.0.0.1:5500/index.html
http://localhost:5500/
http://127.0.0.1:5500/
```

---

## 🎯 Step-by-Step Fix (Do This Now)

1. **Open Google Cloud Console**
   - https://console.cloud.google.com

2. **Select Your Project**
   - Find "GM University" project

3. **Go to OAuth consent screen**
   - In left menu → APIs & Services → OAuth consent screen

4. **Add Test User**
   - Scroll to "Test users" section
   - Click "+ Add Users"
   - Enter: `s*****8@gmail.com`
   - Click "Add"

5. **Save and Wait 2 minutes**

6. **Test Again**
   - Open `http://localhost:5500/index.html`
   - Try "Sign in with Google"
   - Should work now!

---

## 🔒 Important Notes

- **Development Mode:** Restricted to you + test users only
- **Production Mode:** Anyone can use it (after Google approval)
- **Test users don't need Client Secret** - just add their email
- **Wait 1-2 minutes** for changes to take effect

---

## ⚠️ Current Status

**Your OAuth Credential:**
- Status: ⏳ **Development/Testing**
- Client ID: Stored in index.html (keep secure)
- Only you + added test users can use it

**To Fix Immediately:**
1. Add your test email as test user
2. Wait 2 minutes
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try signing in again

---

## 📋 Checklist

- [ ] Go to OAuth consent screen
- [ ] Find "Test users" section
- [ ] Click "+ Add Users"
- [ ] Add `s*****8@gmail.com`
- [ ] Save changes
- [ ] Wait 2 minutes
- [ ] Clear browser cache
- [ ] Try signing in again
- [ ] ✓ Should work!

If still having issues, try **Option 1: OAuth 2.0 Playground** above.

