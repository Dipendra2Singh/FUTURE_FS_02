@echo off
echo Starting ShopMe Backend Server...
cd shopme-backend
call npm install
echo Backend server starting on http://localhost:8001
npm start
pause