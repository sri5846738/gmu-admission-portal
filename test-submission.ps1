$testData = @{
    formData = @{
        studentName = "Raj Kumar"
        email = "raj.kumar@test.com"
        mobile = "9876543210"
        fatherName = "Mr. Kumar"
        motherName = "Mrs. Kumar"
        programType = "UG"
        selectedCourse = "BCA"
        presentAddress = "123 Test Street, Delhi"
        permanentAddress = "456 Permanent St, Bangalore"
        emailVerified = $true
        phoneVerified = $true
    }
} | ConvertTo-Json

Write-Host "📤 Sending test form data..."
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/applications/submit" -Method Post -ContentType "application/json" -Body $testData

Write-Host "✅ Success! Submission Response:"
$result = $response.Content | ConvertFrom-Json
Write-Host "Application ID: $($result.applicationId)"
Write-Host "Message: $($result.message)"
