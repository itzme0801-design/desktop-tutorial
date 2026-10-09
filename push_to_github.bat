@echo off
title Pushing Hunting Will to GitHub...
echo ===================================================================
echo               PUSHING HUNTING WILL TO GITHUB
echo ===================================================================
echo.
echo Repository: https://github.com/itzme0801-design/desktop-tutorial.git
echo Branch:     main
echo.
echo Pushing your files now...
"C:\Users\Sahana\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe" push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo   SUCCESS! All project files pushed to GitHub successfully!
    echo ===================================================================
) else (
    echo ===================================================================
    echo   Push failed or requires browser login.
    echo ===================================================================
)
echo.
echo Press any key to close this window...
pause
