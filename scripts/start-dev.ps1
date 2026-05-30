# TalentFlow local development starter
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Starting MySQL via Docker Compose..." -ForegroundColor Cyan
Set-Location $Root
docker compose up -d mysql

Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Starting backend (Spring Boot)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; if (Test-Path .\mvnw.cmd) { .\mvnw.cmd spring-boot:run } else { mvn spring-boot:run }"

Start-Sleep -Seconds 5

Write-Host "Starting frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm run dev"

Write-Host ""
Write-Host "TalentFlow is starting!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  API:      http://localhost:8080/api"
Write-Host ""
Write-Host "Demo accounts (after seed):" -ForegroundColor Yellow
Write-Host "  admin@talentflow.com / admin123"
Write-Host "  recruiter@talentflow.com / recruiter123"
Write-Host "  user@talentflow.com / user123"
