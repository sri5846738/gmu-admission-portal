// ⚠️ BACKEND ONLY - Never use this in frontend!
// This shows the proper way to use Client Secret on a secure server

// Example: Node.js/Express Backend (NOT for frontend use)

const express = require('express');
const axios = require('axios');
const app = express();

// Store these as ENVIRONMENT VARIABLES, never hardcode!
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // ⚠️ SECURE - Backend only
const REDIRECT_URL = 'http://localhost:5500/auth/google/callback';

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        // Exchange authorization code for tokens
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET, // ⚠️ ONLY on backend!
            redirect_uri: REDIRECT_URL,
            grant_type: 'authorization_code'
        });
        
        const { access_token, id_token } = response.data;
        
        // Now you have secure tokens to work with
        // Send only what's needed to frontend
        res.json({
            success: true,
            idToken: id_token // Send to frontend if needed
        });
    } catch (error) {
        res.status(400).json({ error: 'Authentication failed' });
    }
});

module.exports = app;

/*
IMPORTANT SECURITY NOTES:

1. CLIENT_SECRET should NEVER be in frontend code
2. Use environment variables:
   - CLIENT_ID=237078816504-072vcar9p6gg4p8igemv8hh9ath3dngk.apps.googleusercontent.com
   - CLIENT_SECRET=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

3. Add to .gitignore:
   - .env
   - .env.local
   - secrets/

4. Example .env file (Create this file, do NOT commit):
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   REDIRECT_URI=http://localhost:5500/auth/google/callback

5. For your current frontend-only app, you don't need Client Secret at all!
*/
