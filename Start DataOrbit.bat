@echo off
setlocal
pushd "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js, then run this file again.
  pause
  popd
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $health = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/health' -TimeoutSec 2; if ($health.status -eq 'ok') { exit 0 } } catch {}; exit 1" >nul 2>nul
if errorlevel 1 (
  if not exist "node_modules\express" (
    echo Project dependencies are missing. Run npm install in this folder first.
    pause
    popd
    exit /b 1
  )
  start "DataOrbit Server" /D "%~dp0" cmd /k "npm start"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddSeconds(30); while ((Get-Date) -lt $deadline) { try { $health = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/health' -TimeoutSec 2; if ($health.status -eq 'ok') { exit 0 } } catch {}; Start-Sleep -Milliseconds 500 }; exit 1" >nul 2>nul
if errorlevel 1 (
  echo DataOrbit did not start. Check the DataOrbit Server window for errors.
  pause
  popd
  exit /b 1
)

start "" "http://127.0.0.1:3000/index.html"
popd
endlocal
