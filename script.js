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
   FINAL SUBMIT
================================================== */
function finalSubmit() {
    form.style.display = "none";
    if (progressBar) progressBar.style.width = "100%";
    successBox.style.display = "block";
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
let verificationCodeGenerated = "";

function sendVerificationCode() {
    const email = document.getElementById("verifyEmail").value;
    
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        alert("Please enter a valid email address");
        return;
    }
    
    // Generate random 6-digit code
    verificationCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simulate sending email (in real app, use backend)
    console.log("Verification code sent to " + email + ": " + verificationCodeGenerated);
    alert("Verification code sent to " + email + "\n\n(Demo: " + verificationCodeGenerated + ")");
    
    document.getElementById("verificationForm").style.display = "none";
    document.getElementById("codeVerificationForm").style.display = "block";
}

function verifyCode() {
    const enteredCode = document.getElementById("verificationCode").value;
    
    if (enteredCode.length !== 6 || !/^[0-9]{6}$/.test(enteredCode)) {
        alert("Please enter a valid 6-digit code");
        return;
    }
    
    if (enteredCode === verificationCodeGenerated) {
        document.getElementById("codeVerificationForm").style.display = "none";
        document.getElementById("verificationSuccess").style.display = "block";
    } else {
        alert("Incorrect code. Please try again.");
    }
}

function resetVerification() {
    document.getElementById("verifyEmail").value = "";
    document.getElementById("verificationCode").value = "";
    document.getElementById("verificationForm").style.display = "block";
    document.getElementById("codeVerificationForm").style.display = "none";
    document.getElementById("verificationSuccess").style.display = "none";
}

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
    const email = document.getElementById("formEmail").value;
    const phone = document.getElementById("formMobile").value;
    
    if (!email || !phone) {
        alert("Please enter both email and phone number");
        return;
    }
    
    if (!emailVerified) {
        alert("Please verify your email first");
        return;
    }
    
    if (!phoneVerified) {
        alert("Please verify your phone number first");
        return;
    }
    
    // Both verified - proceed to next step
    next();
}

/* ==================================================
   DEMO CODE MODAL FUNCTIONS
================================================== */
function showDemoModal(title, message, code) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalMessage").textContent = message;
    document.getElementById("demoCode").textContent = code;
    document.getElementById("demoCodeModal").classList.add("show");
}

function closeDemoModal() {
    document.getElementById("demoCodeModal").classList.remove("show");
}

function copyDemoCode() {
    const code = document.getElementById("demoCode").textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector(".btn-copy");
        const originalText = btn.textContent;
        btn.textContent = "✓ Copied!";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    const modal = document.getElementById("demoCodeModal");
    if (event.target === modal) {
        closeDemoModal();
    }
});

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
        
        // Show success modal
        showDemoModal(
            "Google Account Verified ✓",
            "👤 Email: " + userData.email + "\n✓ Automatically verified with Google",
            "Google OAuth"
        );
        
        console.log("Google Login Success:", userData);
    }
}

function handleGoogleError() {
    console.error("Google Sign-In Error");
    alert("Google Sign-In failed. Please try again or use email verification.");
}
