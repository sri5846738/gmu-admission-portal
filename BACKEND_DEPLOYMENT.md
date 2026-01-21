# Backend Deployment Guide - GM University Admission Portal

## 🚀 Deploy Backend to Render (FREE)

Render is the easiest way to deploy Node.js apps with free tier support.

---

## Step 1: Push Backend to GitHub

First, make sure your backend code is in the GitHub repository:

```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal"

# Add backend folder to git
git add backend/
git commit -m "Add backend server for form submissions"
git push origin main
```

---

## Step 2: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your repositories

---

## Step 3: Create New Web Service on Render

1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub account if not already connected
4. Select `gmu-admission-portal` repository
5. Click "Connect"

---

## Step 4: Configure Web Service

Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `gmu-admission-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

---

## Step 5: Add Environment Variables

1. Scroll down to "Environment"
2. Click "Add Environment Variable"
3. Add these variables:

```
KEY: PORT
VALUE: 3000

KEY: MONGODB_URI
VALUE: mongodb+srv://username:password@cluster0.mongodb.net/gmu-admission

KEY: NODE_ENV
VALUE: production
```

### Get MongoDB Connection String:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account (free tier available)
3. Create a cluster (takes 5-10 minutes)
4. Click "Connect"
5. Choose "Connect to Your Application"
6. Copy connection string and replace `<username>`, `<password>`, and `<cluster>`

---

## Step 6: Deploy

1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. See "Deploying..." → "Live" ✅

---

## Step 7: Get Your Backend URL

After deployment, you'll see a URL like:
```
https://gmu-admission-backend.onrender.com
```

This is your production backend URL!

---

## Step 8: Update Frontend with Backend URL

Update `script.js` to use the production backend:

```javascript
// At the top of script.js, after other variables:
const BACKEND_URL = 'https://gmu-admission-backend.onrender.com/api';
```

Then update the `finalSubmit()` function to send data to backend:

```javascript
async function finalSubmit() {
    const formData = {
        // Step 1
        studentName: document.getElementById('studentName').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        
        // Step 2
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        programType: document.getElementById('programType').value,
        selectedCourse: document.getElementById('selectedCourse').value,
        
        // Step 3
        presentAddress: document.getElementById('presentAddress').value,
        permanentAddress: document.getElementById('permanentAddress').value
    };

    try {
        const response = await fetch(`${BACKEND_URL}/applications/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formData })
        });

        const result = await response.json();

        if (response.ok) {
            form.style.display = "none";
            if (progressBar) progressBar.style.width = "100%";
            successBox.style.display = "block";
            successBox.innerHTML = `
                <div class="success-message">
                    <h2>✅ Application Submitted Successfully!</h2>
                    <p>Application ID: <strong>${result.applicationId}</strong></p>
                    <p>We have received your application. Our admissions team will review it shortly.</p>
                </div>
            `;
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert(`Submission failed: ${error.message}`);
    }
}
```

---

## Step 9: Test Backend

1. Push updated `script.js` to GitHub
2. Netlify automatically redeploys frontend
3. Go to https://gmu-admission-portal-bms.netlify.app/
4. Fill form and submit
5. Check admin dashboard for submission

---

## Alternative: Deploy on Railway

If Render doesn't work, try Railway:

### Railway.app Setup:

1. Go to https://railway.app
2. Click "Start a New Project"
3. Connect GitHub repository
4. Select `backend` directory
5. Add environment variables (same as above)
6. Deploy

Railway gives you a URL like: `https://your-app.railway.app`

---

## Alternative: Deploy on Heroku (Paid Now)

Heroku used to be free but now requires payment. Skip unless you have a credit card.

---

## Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB connection string is correct
- Ensure IP address is whitelisted in MongoDB Atlas
- Go to Atlas → Network Access → Add your IP

### CORS errors in browser console
- Update `server.js` CORS origin to include Netlify URL
- Make sure both frontend and backend URLs are correct

### Application ID not showing
- Check browser console for JavaScript errors
- Check Render logs for backend errors
- Ensure backend is running ("Live" status on Render)

### Tests not working locally first?
1. Start backend: `cd backend; npm start`
2. Backend runs on `http://localhost:3000`
3. Test form submission
4. Check `http://localhost:3000/api/health` returns OK

---

## Admin Dashboard Setup

Access the admin dashboard at:
```
https://gmu-admission-portal-bms.netlify.app/admin-dashboard.html
```

Update the API URL in `admin-dashboard.html`:
```javascript
const API_URL = 'https://gmu-admission-backend.onrender.com/api';
```

---

## Production Checklist

- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set correctly
- [ ] Frontend updated with backend URL
- [ ] Test form submission end-to-end
- [ ] Admin dashboard working
- [ ] Received confirmation in admin dashboard
- [ ] Email verification still working
- [ ] Dark mode still working
- [ ] Mobile responsive on production

---

## 🎉 You're Done!

Your admission portal is now fully functional with:
- ✅ Live frontend on Netlify
- ✅ Live backend on Render
- ✅ MongoDB database in Atlas
- ✅ Form submissions stored and retrievable
- ✅ Admin dashboard to manage applications
- ✅ Email verification working
- ✅ Google OAuth working
- ✅ Dark mode working

---

## Live URLs

- **Frontend:** https://gmu-admission-portal-bms.netlify.app/
- **Admin Dashboard:** https://gmu-admission-portal-bms.netlify.app/admin-dashboard.html
- **Backend API:** https://gmu-admission-backend.onrender.com (replace with your URL)
- **API Health Check:** https://gmu-admission-backend.onrender.com/api/health

---

## Next Steps (Optional)

1. **Add Email Notifications:** When user submits, send confirmation email
2. **Custom Domain:** Buy domain and point to Netlify/Render
3. **Analytics:** Add Google Analytics to track visitors
4. **SMS Notifications:** When admin updates application status
5. **Payment Integration:** If paid admission required

---

## Support Links

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas:** https://docs.mongodb.com/atlas/
- **Express.js:** https://expressjs.com
- **Netlify:** https://docs.netlify.com
