@echo off
:loop
echo "Installing all necessary modules"
npm i
echo "Starting bot..."
npm start
echo "Bot died, restarting in 10 seconds..."
timeout /t 10 /nobreak >nul
goto loop