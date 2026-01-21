# Google OAuth2 Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter Project Name: `GM University Admission Portal`
4. Click "Create"

## Step 2: Enable Google Identity Services API

1. In Google Cloud Console, search for "Google Identity Services API"
2. Click on it and select "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" in the left menu
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure OAuth consent screen first:
   - User Type: "External"
   - Fill in required fields (App name, User support email, etc.)
   - Add scopes: `email`, `profile`
4. Application Type: Select "Web application"
5. Name: `GM University Admission Portal`

## Step 4: Configure Authorized Redirect URIs

Add these redirect URIs in the OAuth credentials:

```
http://localhost:5500
http://localhost:5500/index.html
http://127.0.0.1:5500
https://yourdomain.com
https://yourdomain.com/index.html
```

### ✅ Your Configured Redirect URL:
- **Fallback URL (Primary):** `http://localhost:5500/index.html`
- **Client ID:** `237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com`

Replace `yourdomain.com` with your actual domain when deployed.

### For Local Development:
- Use `http://localhost:5500` (if using Live Server on port 5500)
- Or `http://127.0.0.1:5500`

### For Production:
- Use your actual domain: `https://yourdomain.com`
- Also add subdomain if applicable: `https://admissions.yourdomain.com`

## Step 5: Get Your Client ID

1. After creating credentials, copy your **Client ID**
2. It will look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

## Step 6: Update HTML File

✅ **Already Updated!**

Your Client ID has been added to `index.html`:

```html
data-client_id="237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com"
```

No further action needed for the Client ID.

## Step 7: Test Locally

### Using Live Server (VS Code):
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. It will open at `http://localhost:5500`

### Using Python:
```bash
python -m http.server 5500
```

### Using Node.js:
```bash
npx http-server -p 5500
```

## Step 8: Test Google Login

1. Open your local server URL
2. Go to the "Apply" section (Admissions form)
3. Click "Sign in with Google"
4. You should see a Google login popup
5. After login, email should auto-populate

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Redirect URI mismatch" error | Make sure your redirect URI matches exactly in Google Console |
| Google button not showing | Check that Client ID is valid and not expired |
| Email not auto-populating | Check browser console for JavaScript errors |
| CORS errors | Make sure you're using the correct protocol (http vs https) |

## Important Notes

⚠️ **Security:**
- Never expose your Client Secret in frontend code
- Only use Client ID in HTML/JavaScript
- Client ID is safe to share publicly

⚠️ **Production Deployment:**
- Update redirect URIs to your production domain
- Use HTTPS (not HTTP)
- Update Client ID in HTML before deploying

## Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Flow](https://developers.google.com/identity/protocols/oauth2)

