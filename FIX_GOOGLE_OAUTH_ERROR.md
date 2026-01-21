# Fix: Google OAuth 2.0 Security Error - Invalid Request

## ❌ Error Explanation

```
Error 400: invalid_request
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy
```

### Root Cause:
**NEVER use Client Secret in frontend code!**

Client Secret should ONLY be used on a secure backend server, not in HTML/JavaScript.

---

## ✅ Solution

### Step 1: Remove Client Secret from HTML/JavaScript

❌ **WRONG - DO NOT DO THIS:**
```html
<script>
  const clientSecret = "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";
  // ❌ This violates OAuth security policy
</script>
```

✅ **CORRECT - Use only Client ID:**
```html
<div id="g_id_onload"
     data-client_id="237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com"
     data-callback="handleGoogleLogin"
     data-auto_prompt="false">
</div>
```

### Step 2: Verify Your OAuth Configuration in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **Credentials** → **OAuth 2.0 Client IDs**
4. Find your web application credential
5. Click on it to edit

### Step 3: Update Authorized JavaScript Origins

Add these origins:
```
http://localhost:5500
http://127.0.0.1:5500
http://localhost:5500/
```

### Step 4: Update Authorized Redirect URIs

Add these URIs:
```
http://localhost:5500/index.html
http://127.0.0.1:5500/index.html
```

### Step 5: Save and Wait

Google may take 5-10 minutes to propagate changes. Wait before testing again.

---

## 🔒 Security Best Practices

### What is Safe to Share (Public):
- ✅ Client ID
- ✅ Redirect URLs
- ✅ Scopes (email, profile)

### What Must NEVER be Shared (Secret):
- ❌ Client Secret
- ❌ API Keys
- ❌ Access Tokens
- ❌ Refresh Tokens

### If You Accidentally Exposed Client Secret:

1. **Immediately go to Google Cloud Console**
2. **Delete the compromised credential**
3. **Create a new OAuth 2.0 credential**
4. **Update Client ID in your code**

⚠️ If Client Secret was ever exposed, delete the compromised credential and create a new one in Google Cloud Console.

---

## 🧪 Testing Your Setup

### Local Testing (Development):

1. Open your browser dev console (F12)
2. Go to `http://localhost:5500/index.html`
3. Click "Sign in with Google"
4. You should see the Google login popup (no error)

### Check Browser Console for Errors:

If you see errors like:
- "Redirect URI mismatch" → Update redirect URIs in Google Console
- "Client ID invalid" → Copy correct Client ID again
- "Origin mismatch" → Add your origin to JavaScript Origins

---

## 📋 Checklist Before Testing

- [ ] Client Secret removed from code
- [ ] Only Client ID is in HTML
- [ ] `http://localhost:5500` added to Authorized JavaScript Origins
- [ ] `http://localhost:5500/index.html` added to Authorized Redirect URIs
- [ ] Waited 5-10 minutes for changes to propagate
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Testing on exact URL: `http://localhost:5500/index.html`

---

## 🚀 If Still Getting Error

### Common Issues & Fixes:

| Issue | Fix |
|-------|-----|
| "invalid_request" | Remove all secrets, use only Client ID |
| "redirect_uri_mismatch" | Redirect URI must match exactly (case-sensitive) |
| "origin_mismatch" | Add `http://localhost:5500` to JS Origins |
| "invalid_client" | Client ID is incorrect or expired |
| "access_denied" | Clear cookies for accounts.google.com |

### Nuclear Option:

1. Delete entire OAuth credential
2. Create brand new OAuth 2.0 credential
3. Copy new Client ID
4. Update in HTML
5. Add all URIs again
6. Test

---

## 📝 Your Current Setup

**Client ID:** `237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com`

**Fallback Redirect URL:** `http://localhost:5500/index.html`

**⚠️ IMPORTANT:**
- ❌ Do NOT share Client Secret with anyone
- ❌ Do NOT commit Client Secret to Git
- ❌ Do NOT put Client Secret in frontend code

---

## 📚 Additional Resources

- [Google OAuth 2.0 Security Best Practices](https://developers.google.com/identity/protocols/oauth2/web-server)
- [OAuth 2.0 Threat Model](https://www.rfc-editor.org/rfc/rfc6819)
- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)

