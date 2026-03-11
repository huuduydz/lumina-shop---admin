@echo off
REM Lumina Shop & Admin - Start both servers (Windows)

echo.
echo Starting Lumina Shop ^& Admin...
echo.

REM Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if MySQL is running
echo Checking MySQL connection...
mysql -h localhost -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL is not running on localhost:3306
    echo Please start MySQL manually before continuing
    echo.
)

REM Start Backend
echo.
echo Starting Backend Server...
start "Lumina Backend" cmd /k "cd server && npm install --production && npm run dev"
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend Server...
start "Lumina Frontend" cmd /k "npm install && npm run dev"

echo.
echo All servers are starting in new windows...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001/api
echo.
pause
