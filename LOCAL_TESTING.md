# Local Testing Setup - MongoDB Configuration

## Option 1: Use MongoDB Atlas (Cloud - Easiest)

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (M0 free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/gmu-admissions`
5. Add to `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gmu-admissions
   ```

## Option 2: Use MongoDB Community (Local)

### Steps:
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Use connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/gmu-admissions
   ```

## For Testing (Temporary In-Memory):

If MongoDB not available, backend will still start but won't persist data.
Create `backend/.env` with:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gmu-admissions
```

## Quick Start:

```powershell
cd backend
npm start
```

The backend will attempt to connect to MongoDB. If MongoDB is not running:
- Backend will show "❌ MongoDB error" but will still listen on port 3000
- You can still test the API
- Data won't be saved (but you'll see the form submits successfully)
