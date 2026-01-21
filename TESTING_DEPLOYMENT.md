# Testing & Production Deployment Checklist

## ✅ Step 1: Test Locally

### 1.1 Start Backend Server

```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal\backend"

# Install dependencies
npm install

# Start server
npm start
```

You should see:
```
✅ MongoDB connected (if using MongoDB)
🚀 Server running on port 3000
```

### 1.2 Test Backend Health Check

Open browser and visit:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-21T12:00:00Z"
}
```

### 1.3 Test Frontend Form Submission (Local)

1. Open `index.html` in browser (or use Live Server in VS Code)
2. Fill out the entire form:
   - Step 1: Student details
   - Step 2: Parent details & course
   - Step 3: Address
   - Step 4: Review & Submit
3. Click "Submit Application"
4. Should see success message with Application ID

### 1.4 Check Backend Console

You should see:
```
📝 New application received from: student@email.com
```

### 1.5 Test Admin Dashboard (Local)

1. Open `admin-dashboard.html` in browser
2. Should see:
   - Statistics (1 total application)
   - Application table with your test submission
   - Status, date, and action buttons
3. Click "View" to see full details
4. Try "Approve" or "Reject" buttons

---

## ⚠️ Common Local Testing Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Install MongoDB locally or use MongoDB Atlas connection string in .env |
| CORS error in console | Make sure backend is running on port 3000 |
| Form won't submit | Check browser console for errors, verify backend is running |
| Admin dashboard shows "Loading..." | Check API_URL in admin-dashboard.html matches backend |
| "Cannot POST /api/applications/submit" | Ensure backend server is running |

---

## 🚀 Step 2: Deploy Backend to Production

### 2.1 Prepare for Deployment

1. Make sure all files are in GitHub:
```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal"
git status
git add .
git commit -m "Add backend API and admin dashboard"
git push origin main
```

2. Create `.env` file in `backend/` folder:
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/gmu-admissions
NODE_ENV=production
```

### 2.2 Deploy on Render.com

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select `gmu-admission-portal` repository
5. Configure:
   - **Name:** `gmu-admission-backend`
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. Add Environment Variables:
   ```
   PORT = 3000
   MONGODB_URI = mongodb+srv://...
   NODE_ENV = production
   ```

7. Click "Create Web Service"
8. Wait 3-5 minutes for deployment
9. Get your production URL: `https://gmu-admission-backend.onrender.com`

### 2.3 Update Frontend with Production Backend URL

Edit `script.js`:

Find this line:
```javascript
const BACKEND_URL = 'http://localhost:3000/api';
```

Replace with:
```javascript
const BACKEND_URL = 'https://gmu-admission-backend.onrender.com/api';
```

Also update `admin-dashboard.html`:

Find:
```javascript
const API_URL = 'http://localhost:3000/api';
```

Replace with:
```javascript
const API_URL = 'https://gmu-admission-backend.onrender.com/api';
```

### 2.4 Update Backend CORS for Production

Edit `backend/server.js` and add your Netlify URL to CORS origins:

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5500',
        'https://gmu-admission-portal-bms.netlify.app',  // Your Netlify frontend
        'https://gmu-admission-backend.onrender.com'      // Your backend
    ]
}));
```

### 2.5 Push Changes to GitHub

```powershell
git add script.js admin-dashboard.html backend/server.js
git commit -m "Update API URLs for production"
git push origin main
```

Netlify automatically redeploys frontend ✅

---

## ✅ Step 3: Test Production Deployment

### 3.1 Test Backend Production

Visit:
```
https://gmu-admission-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 3.2 Test Frontend Production

1. Go to: https://gmu-admission-portal-bms.netlify.app/
2. Fill out form completely
3. Click "Submit Application"
4. Should see success message with Application ID

### 3.3 Test Admin Dashboard Production

1. Go to: https://gmu-admission-portal-bms.netlify.app/admin-dashboard.html
2. Should show:
   - Statistics updated
   - Your test application in table
   - All action buttons working

### 3.4 Test Application Status Update

1. In admin dashboard, click "Approve" on an application
2. Application status should change to "approved"
3. Application should stay in table but with new status

---

## 📋 Production Deployment Checklist

Before going live:

- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas cluster created and connected
- [ ] Frontend updated with production backend URL
- [ ] Admin dashboard updated with production backend URL
- [ ] Backend CORS updated for production domains
- [ ] All changes pushed to GitHub
- [ ] Test local submission works
- [ ] Test production submission works
- [ ] Admin dashboard retrieves submissions
- [ ] Status update functionality working
- [ ] Email verification still working on production
- [ ] Google OAuth still working on production
- [ ] Dark mode working on production
- [ ] Mobile responsive on production

---

## 🔄 Testing Workflow

### Quick Local Test:
```powershell
# Terminal 1: Start backend
cd backend; npm start

# Terminal 2: Open frontend
start index.html

# Browser: Fill form → Submit → Check success message
# Browser: Open admin-dashboard.html → See submission
```

### Quick Production Test:
```
1. Visit frontend: https://gmu-admission-portal-bms.netlify.app/
2. Fill form and submit
3. Check admin dashboard for submission
4. Verify in MongoDB Atlas
```

---

## 🚨 Troubleshooting Production

### Backend shows error in logs
- Check MongoDB connection string
- Verify environment variables are set
- Check IP whitelist in MongoDB Atlas

### Frontend can't connect to backend
- Verify backend URL is correct
- Check backend is "Live" on Render
- Check browser console for CORS errors
- Ensure backend CORS includes frontend URL

### Admin dashboard shows empty
- Verify backend URL in admin-dashboard.html
- Check backend /api/applications endpoint
- Verify MongoDB has data

### Application ID not showing
- Check browser console for JavaScript errors
- Check Render logs for backend errors
- Verify response format from backend

---

## 📊 Success Indicators

✅ **Local Testing Passed When:**
- Backend runs without errors
- Form submits and shows Application ID
- Admin dashboard shows submission
- Status updates work

✅ **Production Deployment Passed When:**
- Production frontend can submit forms
- Production admin dashboard shows submissions
- Can see data in MongoDB Atlas
- All features working on live URLs

---

## 🎉 Live URLs (After Deployment)

- **Frontend:** https://gmu-admission-portal-bms.netlify.app/
- **Admin Dashboard:** https://gmu-admission-portal-bms.netlify.app/admin-dashboard.html
- **Backend API:** https://gmu-admission-backend.onrender.com/api (replace with your URL)
- **GitHub:** https://github.com/sri5846738/gmu-admission-portal

---

## Next Steps

1. ✅ Test locally
2. ✅ Deploy backend to Render
3. ✅ Update frontend URLs
4. ✅ Test production
5. 📧 Add email confirmations (optional)
6. 📱 Add SMS notifications (optional)
7. 🎨 Add custom domain (optional)
8. 📊 Add analytics (optional)
