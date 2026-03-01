@echo off
cd /d c:\Users\Vaishali Shenisetti\recipe-sharing-frontend
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
start cmd /k "npm run dev -- --port 5173"
