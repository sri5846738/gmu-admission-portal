# Backend Setup Guide - GM University Admission Portal

## 🚀 Backend Architecture

```
Frontend (Netlify) ←→ Backend API (Node.js/Express) ←→ Database (MongoDB)
```

---

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (Local or Cloud)
   - Option A: Local MongoDB
     - Download: https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (Cloud - Recommended)
     - Sign up: https://www.mongodb.com/cloud/atlas

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

---

## 🛠️ Installation Steps

### Step 1: Setup MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a new cluster:
   - Cluster Name: `gmu-admissions`
   - Cloud Provider: AWS
   - Region: Select closest to you
   - Cluster Tier: Free
4. Click "Create Cluster"
5. Wait for cluster to be created (5-10 minutes)
6. Go to "Database" → "Connect"
7. Choose "Drivers"
8. Copy connection string: `mongodb+srv://username:password@...`
9. Save this for later

#### Option B: Local MongoDB

1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Connection string: `mongodb://localhost:27017/gmu-admissions`

---

### Step 2: Install Backend Dependencies

```powershell
cd "C:\Users\Relanto\Downloads\Admission Portal\backend"

npm install
```

This installs:
- Express (web framework)
- Mongoose (MongoDB ODM)
- CORS (cross-origin requests)
- Multer (file uploads)
- Dotenv (environment variables)

---

### Step 3: Configure Environment Variables

1. Create `.env` file in backend folder:
   ```powershell
   cd "C:\Users\Relanto\Downloads\Admission Portal\backend"
   
   # On Windows, create file with:
   copy .env.example .env
   ```

2. Edit `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gmu-admissions
   NODE_ENV=development
   ```

---

### Step 4: Start Backend Server

#### Development Mode (with auto-reload):
```powershell
npm run dev
```

#### Production Mode:
```powershell
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## 🔌 API Endpoints

### 1. Submit Application
**POST** `/api/applications/submit`

Request Body:
```json
{
  "formData": {
    "studentName": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "emailVerified": true,
    "phoneVerified": true,
    "fatherName": "Father Name",
    "motherName": "Mother Name",
    "programType": "UG",
    "selectedCourse": "BCA",
    "presentAddress": "123 Main St",
    "permanentAddress": "456 Oak St",
    "documents": {
      "file10": "file10.pdf",
      "file11": "file11.pdf"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": "507f1f77bcf86cd799439011"
}
```

---

### 2. Get All Applications (Admin)
**GET** `/api/applications`

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "studentName": "John Doe",
    "email": "john@example.com",
    "status": "submitted",
    "createdAt": "2026-01-21T12:00:00Z"
  }
]
```

---

### 3. Get Single Application
**GET** `/api/applications/:id`

Example: `/api/applications/507f1f77bcf86cd799439011`

---

### 4. Update Application Status (Admin)
**PUT** `/api/applications/:id/status`

Request Body:
```json
{
  "status": "approved"
}
```

Valid statuses: `submitted`, `reviewing`, `approved`, `rejected`

---

### 5. Delete Application (Admin)
**DELETE** `/api/applications/:id`

---

### 6. Search Application by Email
**GET** `/api/applications/search/:email`

Example: `/api/applications/search/john@example.com`

---

### 7. Get Statistics (Admin Dashboard)
**GET** `/api/statistics`

Response:
```json
{
  "totalApplications": 150,
  "submitted": 100,
  "reviewing": 30,
  "approved": 15,
  "rejected": 5,
  "programStats": [
    { "_id": "UG", "count": 100 },
    { "_id": "PG", "count": 50 }
  ]
}
```

---

### 8. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "Server is running",
  "timestamp": "2026-01-21T12:00:00Z"
}
```

---

## 🔗 Connect Frontend to Backend

### Update JavaScript to Send Data to Backend

Add to your frontend (`script.js`):

```javascript
// After form verification in nextWithVerification()

async function submitApplicationToBackend(formData) {
    try {
        const response = await fetch('http://localhost:5000/api/applications/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Application submitted to backend');
            console.log('Application ID:', result.applicationId);
            return result.applicationId;
        } else {
            console.error('❌ Backend error:', result.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
```

---

## 📦 Deployment Options

### Option 1: Deploy Backend to Heroku (Free)

1. Create Heroku account: https://www.heroku.com
2. Install Heroku CLI
3. Push to Heroku:
   ```bash
   heroku login
   heroku create gmu-admission-backend
   git push heroku main
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   ```

### Option 2: Deploy Backend to Railway (Free)

1. Go to https://railway.app
2. Connect GitHub repo
3. Select `backend` folder
4. Add environment variables
5. Deploy

### Option 3: Deploy Backend to Render (Free)

1. Go to https://render.com
2. Connect GitHub
3. Create new Web Service
4. Select `backend` folder as root
5. Add environment variables
6. Deploy

---

## 🧪 Testing Backend Locally

### Using cURL:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all applications
curl http://localhost:5000/api/applications

# Submit application
curl -X POST http://localhost:5000/api/applications/submit \
  -H "Content-Type: application/json" \
  -d '{"formData":{"studentName":"John","email":"john@test.com"}}'
```

### Using Postman:

1. Download: https://www.postman.com/downloads/
2. Create new request
3. Set method to POST
4. URL: `http://localhost:5000/api/applications/submit`
5. Body (JSON):
   ```json
   {
     "formData": {
       "studentName": "John Doe",
       "email": "john@example.com",
       "mobile": "9876543210"
     }
   }
   ```
6. Click "Send"

---

## 📊 Database Schema

### Application Collection

```
{
  _id: ObjectId,
  studentName: String,
  email: String (unique),
  mobile: String,
  emailVerified: Boolean,
  phoneVerified: Boolean,
  fatherName: String,
  motherName: String,
  programType: String (UG/PG),
  selectedCourse: String,
  presentAddress: String,
  permanentAddress: String,
  documents: {
    file10: String,
    file11: String,
    file12: String,
    file13: String,
    file14: String
  },
  status: String (submitted/reviewing/approved/rejected),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🔒 Security Considerations

1. **CORS**: Only allow requests from your frontend domain
2. **Validation**: Always validate input data
3. **Authentication**: Add admin authentication for protected endpoints
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **HTTPS**: Use HTTPS in production
6. **Environment Variables**: Never commit `.env` to Git

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MongoDB is running and URI is correct |
| CORS errors | Add frontend URL to CORS origins in server.js |
| Port already in use | Change PORT in .env or kill process using port |
| Module not found | Run `npm install` again |
| Permission denied | Check file permissions in backend folder |

---

## 📚 Next Steps

1. **Add Authentication**: Implement user authentication
2. **Add Email Notifications**: Send confirmation emails
3. **Add File Upload**: Store documents in cloud (AWS S3, Azure Blob)
4. **Add Admin Dashboard**: Create admin panel to review applications
5. **Add Payment Gateway**: Implement fee payment
6. **Add SMS Notifications**: Send SMS updates to applicants

---

## 📞 Support

- Express Documentation: https://expressjs.com/
- Mongoose Documentation: https://mongoosejs.com/
- MongoDB Documentation: https://docs.mongodb.com/
- Heroku Documentation: https://devcenter.heroku.com/
