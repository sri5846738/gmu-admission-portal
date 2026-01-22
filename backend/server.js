// GM University Admission Portal - Backend Server
// Node.js + Express + MongoDB

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:3000',
        'https://gmu-admission-portal-bms.netlify.app'
    ]
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB error:', err));

// Application Schema
const applicationSchema = new mongoose.Schema({
    // Step 1: Student Details
    studentName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    googleEmail: { type: String, default: null },  // Email from Google OAuth
    
    // Step 2: Parent & Course Details
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    programType: { type: String, enum: ['UG', 'PG'], required: true },
    selectedCourse: { type: String, required: true },
    
    // Step 3: Address & Documents
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    documents: {
        file10: String,  // File path
        file11: String,
        file12: String,
        file13: String,
        file14: String
    },
    
    // Status & Timestamps
    status: { type: String, enum: ['submitted', 'reviewing', 'approved', 'rejected'], default: 'submitted' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema, 'sri18');

// Routes

// 1. Submit Application
app.post('/api/applications/submit', async (req, res) => {
    try {
        const { formData } = req.body;
        
        // Check if email already exists
        const existingApp = await Application.findOne({ email: formData.email });
        if (existingApp) {
            return res.status(400).json({ 
                error: 'Application with this email already exists' 
            });
        }
        
        // Convert verification fields to boolean properly
        const emailVerified = formData.emailVerified === true || formData.emailVerified === 'true' || false;
        const phoneVerified = formData.phoneVerified === true || formData.phoneVerified === 'true' || false;
        
        // Create new application
        const application = new Application({
            studentName: formData.studentName,
            email: formData.email,
            mobile: formData.mobile,
            emailVerified: emailVerified,
            phoneVerified: phoneVerified,
            googleEmail: formData.googleEmail || null,  // Store Google OAuth email
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            programType: formData.programType,
            selectedCourse: formData.selectedCourse,
            presentAddress: formData.presentAddress,
            permanentAddress: formData.permanentAddress,
            documents: formData.documents || {}  // Store file paths from frontend
        });
        
        await application.save();
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: application._id
        });
        
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 2. Get All Applications (Admin)
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 3. Get Single Application
app.get('/api/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 4. Update Application Status (Admin)
app.put('/api/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['submitted', 'reviewing', 'approved', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        
        res.json({
            success: true,
            message: 'Status updated',
            application
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 5. Delete Application (Admin)
app.delete('/api/applications/:id', async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Application deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 6. Search Applications
app.get('/api/applications/search/:email', async (req, res) => {
    try {
        const application = await Application.findOne({ email: req.params.email });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 7. Get Statistics (Admin Dashboard)
app.get('/api/statistics', async (req, res) => {
    try {
        const total = await Application.countDocuments();
        const submitted = await Application.countDocuments({ status: 'submitted' });
        const reviewing = await Application.countDocuments({ status: 'reviewing' });
        const approved = await Application.countDocuments({ status: 'approved' });
        const rejected = await Application.countDocuments({ status: 'rejected' });
        
        const programStats = await Application.aggregate([
            { $group: { _id: '$programType', count: { $sum: 1 } } }
        ]);
        
        res.json({
            totalApplications: total,
            submitted,
            reviewing,
            approved,
            rejected,
            programStats
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// 8. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
});
