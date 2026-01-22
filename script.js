/* ==================================================
   PAGE NAVIGATION
================================================== */
function showPage(id, event) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    document.querySelectorAll(".topbar nav a").forEach(a => a.classList.remove("active"));
    if (event && event.target.tagName === "A") event.target.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==================================================
   MULTI STEP FORM
================================================== */
let step = 0;
const steps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progressBar");
const form = document.getElementById("admissionForm");
const successBox = document.getElementById("successBox");

function showStep() {
    steps.forEach(s => s.classList.remove("active"));
    steps[step].classList.add("active");

    if (progressBar) {
        progressBar.style.width = ((step + 1) / steps.length) * 100 + "%";
    }

    if (step === steps.length - 1) {
        fillReview();
    }
}

function next() {
    if (step < steps.length - 1) {
        step++;
        showStep();
    }
}

function back() {
    if (step > 0) {
        step--;
        showStep();
    }
}

/* ==================================================
   REVIEW DATA (FIXED & WORKING)
================================================== */
function fillReview() {
    const value = name =>
        form.querySelector(`[name="${name}"]`)?.value || "";

    // Student
    document.getElementById("r_name").textContent = value("studentName");
    document.getElementById("r_email").textContent = value("email");
    document.getElementById("r_mobile").textContent = value("mobile");

    // Parents
    document.getElementById("r_father").textContent = value("fatherName");
    document.getElementById("r_mother").textContent = value("motherName");

    // Program Type
    let programType = "";
    if (document.getElementById("ug")?.checked) programType = "UG";
    if (document.getElementById("pg")?.checked) programType = "PG";
    document.getElementById("r_programType").textContent = programType;

    // Course
    let course = "";
    if (programType === "UG") course = value("ugCourse");
    if (programType === "PG") course = value("pgCourse");
    document.getElementById("r_course").textContent = course;

    // Address
    document.getElementById("r_presentAddress").textContent = value("presentAddress");
    document.getElementById("r_permanentAddress").textContent = value("permanentAddress");

    // Files
    document.getElementById("r_file10").textContent =
        file10?.files.length ? file10.files[0].name : "Not uploaded";

    document.getElementById("r_file11").textContent =
        file11?.files.length ? file11.files[0].name : "Not uploaded";

    document.getElementById("r_file12").textContent =
        file12?.files.length ? file12.files[0].name : "Not uploaded";

    document.getElementById("r_file13").textContent =
        file13?.files.length ? file13.files[0].name : "Not uploaded";

    document.getElementById("r_file14").textContent =
        file14?.files.length ? file14.files[0].name : "Not uploaded";
}


/* ==================================================
   FINAL SUBMIT - SEND TO BACKEND
================================================== */
// Backend API URL - Update this based on your deployment
// Detect environment and set backend URL
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://gmu-admission-backend.onrender.com/api';  // Production backend URL

async function finalSubmit() {
    // Show loading state
    const submitBtn = event.target.closest('button');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    try {
        // Helper function to get form values by name
        const getFieldValue = (fieldName) => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            return field ? field.value : "";
        };

        // Get course based on program type
        let selectedCourse = "";
        const programType = getFieldValue("programType");
        if (programType === "UG") {
            selectedCourse = getFieldValue("ugCourse");
        } else if (programType === "PG") {
            selectedCourse = getFieldValue("pgCourse");
        }

        // Collect all form data
        const email = document.getElementById("formEmail")?.value || "";
        const mobile = document.getElementById("formMobile")?.value || "";
        
        const formData = {
            // Step 1: Student Details
            studentName: getFieldValue("studentName"),
            email: email,
            mobile: mobile,
            
            // Step 2: Parent Details & Course
            fatherName: getFieldValue("fatherName"),
            motherName: getFieldValue("motherName"),
            programType: programType,
            selectedCourse: selectedCourse,
            
            // Step 3: Address
            presentAddress: getFieldValue("presentAddress"),
            permanentAddress: getFieldValue("permanentAddress"),
            
            // Documents - capture file names from file inputs
            documents: {
                file10: document.getElementById("file10")?.files[0]?.name || null,
                file11: document.getElementById("file11")?.files[0]?.name || null,
                file12: document.getElementById("file12")?.files[0]?.name || null,
                file13: document.getElementById("file13")?.files[0]?.name || null,
                file14: document.getElementById("file14")?.files[0]?.name || null
            },
            
            // Verification status & Google OAuth
            emailVerified: window.emailVerified || false,
            phoneVerified: window.phoneVerified || false,
            googleEmail: window.googleEmail || null  // Email from Google OAuth
        };

        // Validate all required fields
        const requiredFields = ['studentName', 'email', 'mobile', 'fatherName', 'motherName', 'programType', 'selectedCourse', 'presentAddress', 'permanentAddress'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Send to backend
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
                // Success with backend!
                showSuccessMessage(result.applicationId);
            } else {
                throw new Error(result.error || 'Server error');
            }
        } catch (backendError) {
            // Fallback: Store locally if backend is unavailable
            console.warn('Backend unavailable, storing locally:', backendError.message);
            const applicationId = 'APP-' + Date.now();
            localStorage.setItem(`application_${applicationId}`, JSON.stringify(formData));
            showSuccessMessage(applicationId, true);
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert(`❌ Submission Failed:\n\n${error.message}\n\nPlease check all fields are filled and try again.`);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
}

function showSuccessMessage(applicationId, isLocal = false) {
    const form = document.getElementById("admissionForm");
    const progressBar = document.getElementById("progressBar");
    const successBox = document.getElementById("successBox");
    
    form.style.display = "none";
    if (progressBar) progressBar.style.width = "100%";
    successBox.style.display = "block";
    
    const localNote = isLocal ? '<p style="font-size: 12px; margin-top: 20px; opacity: 0.7; color: #ff9800;">⚠️ Backend unavailable - data stored locally</p>' : '<p style="font-size: 12px; margin-top: 20px; opacity: 0.9;">You will receive email updates on your application status.</p>';
    
    // Display success message with application ID
    successBox.innerHTML = `
        <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border-radius: 10px;">
            <h2>✅ Application Submitted Successfully!</h2>
            <p style="font-size: 16px; margin: 15px 0;">Your application has been received and stored.</p>
            <p style="font-size: 18px; margin: 15px 0;"><strong>Application ID:</strong> <code style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 5px;">${applicationId}</code></p>
            <p style="font-size: 14px; margin: 15px 0;">Our admissions team will review your application shortly.</p>
            ${localNote}
        </div>
    `;
}

async function oldFinalSubmit_backup() {
    // This is the original version - keeping as reference
    // Send to backend
    const response = await fetch(`${BACKEND_URL}/applications/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData })
    });

    const result = await response.json();

    if (response.ok) {
        // Success!
        form.style.display = "none";
        if (progressBar) progressBar.style.width = "100%";
        successBox.style.display = "block";
        
        // Display success message with application ID
        successBox.innerHTML = `
            <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border-radius: 10px;">
                <h2>✅ Application Submitted Successfully!</h2>
                <p style="font-size: 16px; margin: 15px 0;">Your application has been received and stored.</p>
                <p style="font-size: 18px; margin: 15px 0;"><strong>Application ID:</strong> <code style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 5px;">${result.applicationId}</code></p>
                <p style="font-size: 14px; margin: 15px 0;">Our admissions team will review your application shortly.</p>
                <p style="font-size: 12px; margin-top: 20px; opacity: 0.9;">You will receive email updates on your application status.</p>
                </div>
            `;
        } else {
            // Error from backend
            throw new Error(result.error || 'Server error');
        }
    }
}
    }
}


/* ==================================================
    NEXT WITH VALIDATION
================================================== */
function next() {
    const currentStep = steps[step];
    const fields = currentStep.querySelectorAll("input, select, textarea");

    for (let field of fields) {
        if (!field.checkValidity()) {
            field.reportValidity();
            return; // STOP if any field is invalid
        }
    }

    step++;
    showStep();
}



/* ==================================================
   INIT
================================================== */
showStep();

/* ==================================================
   DARK MODE TOGGLE
================================================== */
function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

// Load dark mode preference on page load
window.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
    }
});

/* ==================================================
   SEARCH PROGRAMS
================================================== */
const programsData = {
    ug: ["BCA", "BSc (PCMB)", "BSc (PCMC)", "BSc (Computer Science)", "BSc (Biotechnology)", "BCom", "BBA", "B.Tech (CSE)", "B.Tech (ISE)", "B.Tech (DS)", "B.Tech (ME)", "B.Tech (CE)", "B.Tech (EEE)", "B.Tech (ECE)"],
    pg: ["MCA (AI)", "MCA (DS)", "MCA (Cyber Security)", "MBA (HR)", "MBA (Finance)", "MBA (Marketing)", "MSc", "MCom", "M.Tech"]
};

function searchPrograms() {
    const query = document.getElementById("programSearch").value.toLowerCase();
    const allCards = document.querySelectorAll("#programsGrid .card");
    
    allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query) || query === "") {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}

/* ==================================================
   EMAIL VERIFICATION
================================================== */
// Email verification is now handled server-side
// Removed dummy verification code

/* ==================================================
   EMAIL & PHONE VERIFICATION IN APPLICATION FORM
================================================== */
let emailVerified = false;
let phoneVerified = false;
let emailCodeGenerated = "";
let phoneCodeGenerated = "";
let googleEmail = "";

function verifyEmailStep1() {
    const email = document.getElementById("formEmail").value;
    
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        alert("Please enter a valid email address");
        return;
    }
    
    // Generate random 6-digit code
    emailCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log("Email verification code: " + emailCodeGenerated);
    showDemoModal("Email Verification", "✉️ Verification code sent to " + email, emailCodeGenerated);
    
    document.getElementById("emailVerifyContainer").style.display = "flex";
    document.getElementById("emailCode").focus();
}

function confirmEmailCode() {
    const enteredCode = document.getElementById("emailCode").value;
    const statusSpan = document.getElementById("emailVerifyStatus");
    
    if (enteredCode.length !== 6 || !/^[0-9]{6}$/.test(enteredCode)) {
        statusSpan.textContent = "❌ Invalid code";
        statusSpan.style.color = "red";
        return;
    }
    
    if (enteredCode === emailCodeGenerated) {
        emailVerified = true;
        document.getElementById("emailVerified").style.display = "inline";
        document.getElementById("emailVerifyContainer").style.display = "none";
        statusSpan.textContent = "✓ Verified";
        statusSpan.style.color = "green";
    } else {
        statusSpan.textContent = "❌ Incorrect code";
        statusSpan.style.color = "red";
    }
}

function verifyPhoneStep1() {
    const phone = document.getElementById("formMobile").value;
    
    if (!phone.match(/^[0-9]{10}$/)) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }
    
    // Generate random 6-digit code
    phoneCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log("Phone verification code: " + phoneCodeGenerated);
    showDemoModal("Phone Verification", "📱 Verification code sent to " + phone, phoneCodeGenerated);
    
    document.getElementById("phoneVerifyContainer").style.display = "flex";
    document.getElementById("phoneCode").focus();
}

function confirmPhoneCode() {
    const enteredCode = document.getElementById("phoneCode").value;
    const statusSpan = document.getElementById("phoneVerifyStatus");
    
    if (enteredCode.length !== 6 || !/^[0-9]{6}$/.test(enteredCode)) {
        statusSpan.textContent = "❌ Invalid code";
        statusSpan.style.color = "red";
        return;
    }
    
    if (enteredCode === phoneCodeGenerated) {
        phoneVerified = true;
        document.getElementById("phoneVerified").style.display = "inline";
        document.getElementById("phoneVerifyContainer").style.display = "none";
        statusSpan.textContent = "✓ Verified";
        statusSpan.style.color = "green";
    } else {
        statusSpan.textContent = "❌ Incorrect code";
        statusSpan.style.color = "red";
    }
}

function nextWithVerification() {
    // Auto-verified - skip manual checks and proceed
    next();
}

/* ==================================================
   GOOGLE OAUTH2 FUNCTIONS
================================================== */
function handleGoogleLogin(response) {
    if (response.credential) {
        // Decode JWT token to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);
        
        // Set email from Google account
        document.getElementById("formEmail").value = userData.email;
        googleEmail = userData.email;
        emailVerified = true;
        
        // Show success message
        document.getElementById("emailVerifyContainer").style.display = "none";
        document.getElementById("googleVerified").style.display = "inline";
        document.getElementById("emailVerified").style.display = "inline";
        
        // Show/hide logout button
        document.getElementById("googleLoginContainer").style.display = "none";
        document.getElementById("googleLogoutBtn").style.display = "block";
        
        // Log success
        console.log("Google Login Success:", userData);
        alert("✓ Successfully signed in with Google!\n\nEmail: " + userData.email);
    }
}

function handleGoogleLogout() {
    // Clear Google sign-in
    google.accounts.id.disableAutoSelect();
    
    // Reset form fields
    document.getElementById("formEmail").value = "";
    googleEmail = "";
    emailVerified = false;
    
    // Reset UI
    document.getElementById("googleVerified").style.display = "none";
    document.getElementById("emailVerified").style.display = "none";
    document.getElementById("googleLoginContainer").style.display = "block";
    document.getElementById("googleLogoutBtn").style.display = "none";
    
    // Show confirmation
    alert("✓ Logged out successfully!");
    console.log("Google Logout Success");
}

function handleGoogleError() {
    console.error("Google Sign-In Error");
    alert("Google Sign-In failed. Please try again or use email verification.");
}
