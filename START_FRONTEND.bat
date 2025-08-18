@echo off
echo Starting ShopMe Frontend...
cd shopme-frontend
call npm install
echo Frontend starting on http://localhost:3000
npm start
pause