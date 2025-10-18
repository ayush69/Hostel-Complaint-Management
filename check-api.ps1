# API Endpoint Verification Script
# Run this to verify all endpoints are working

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "   HCM API Endpoint Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if backend is running
Write-Host "`n[1/5] Checking if backend server is running..." -ForegroundColor Yellow
$backendProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.StartInfo.FileName -like "*node*"
}

if ($backendProcess) {
    Write-Host "✅ Backend Node.js process(es) found" -ForegroundColor Green
    $backendProcess | Format-Table Id, ProcessName, StartTime
} else {
    Write-Host "❌ No Node.js processes found" -ForegroundColor Red
    Write-Host "   Start backend with: cd backend; npm run dev" -ForegroundColor Yellow
}

# Check if port 5000 is listening
Write-Host "`n[2/5] Checking if port 5000 is listening..." -ForegroundColor Yellow
$port5000 = netstat -ano | findstr ":5000.*LISTENING"

if ($port5000) {
    Write-Host "✅ Port 5000 is LISTENING (Backend is ready)" -ForegroundColor Green
    Write-Host $port5000
} else {
    Write-Host "❌ Port 5000 is NOT listening" -ForegroundColor Red
    Write-Host "   Backend server is not running on port 5000" -ForegroundColor Yellow
}

# Check if frontend is running
Write-Host "`n[3/5] Checking if port 5173 is listening (Frontend)..." -ForegroundColor Yellow
$port5173 = netstat -ano | findstr ":5173.*LISTENING"

if ($port5173) {
    Write-Host "✅ Port 5173 is LISTENING (Frontend is ready)" -ForegroundColor Green
    Write-Host $port5173
} else {
    Write-Host "❌ Port 5173 is NOT listening" -ForegroundColor Red
    Write-Host "   Start frontend with: cd frontend; npm run dev" -ForegroundColor Yellow
}

# Test backend health endpoint
Write-Host "`n[4/5] Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -Method GET -ErrorAction Stop
    $content = $response.Content | ConvertFrom-Json
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
    Write-Host "   Response: $($content | ConvertTo-Json -Compress)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Make sure backend is running: cd backend; npm run dev" -ForegroundColor Yellow
}

# List all backend route files
Write-Host "`n[5/5] Verifying backend route files exist..." -ForegroundColor Yellow
$routeFiles = @(
    "backend\src\routes\admin.js",
    "backend\src\routes\staff.js",
    "backend\src\routes\student.js",
    "backend\src\routes\complaints.js",
    "backend\src\routes\authStudent.js",
    "backend\src\routes\authAdminStaff.js"
)

$allExist = $true
foreach ($file in $routeFiles) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file NOT FOUND" -ForegroundColor Red
        $allExist = $false
    }
}

# Summary
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "   SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

if ($port5000 -and $port5173) {
    Write-Host "✅ Both servers are running!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
    Write-Host "2. Open Browser DevTools (F12)" -ForegroundColor White
    Write-Host "3. Go to Console tab" -ForegroundColor White
    Write-Host "4. Clear old token: localStorage.removeItem('hcm_token')" -ForegroundColor White
    Write-Host "5. Login again" -ForegroundColor White
    Write-Host "6. Try the problematic endpoints - watch console for logs!" -ForegroundColor White
    Write-Host "`n📄 Also open API_TESTER.html in your browser to test endpoints directly" -ForegroundColor Cyan
} else {
    Write-Host "❌ One or both servers are not running" -ForegroundColor Red
    Write-Host "`nTo start servers:" -ForegroundColor Yellow
    
    if (-not $port5000) {
        Write-Host "`nBackend (Terminal 1):" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
    }
    
    if (-not $port5173) {
        Write-Host "`nFrontend (Terminal 2):" -ForegroundColor Cyan
        Write-Host "  cd frontend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
    }
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - API_DEBUG_SUMMARY.md - Quick overview" -ForegroundColor White
Write-Host "   - TROUBLESHOOTING_API.md - Detailed guide" -ForegroundColor White
Write-Host "   - API_TESTER.html - Interactive endpoint tester" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
