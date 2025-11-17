@echo off
echo ========================================
echo   Iniciando Sistema Completo
echo   Backend + Frontend
echo ========================================
echo.

REM Guardar directorio actual
set "ROOT_DIR=%~dp0"

echo [1/2] Iniciando Backend...
start "Backend - Spring Boot" cmd /k "cd /d "%ROOT_DIR%backend-SpringBoot\GestionDeEventos" && start.bat"

REM Esperar 5 segundos para que el backend inicie
timeout /t 5 /nobreak >nul

echo [2/2] Iniciando Frontend...
start "Frontend - Angular" cmd /k "cd /d "%ROOT_DIR%frontend-Angular\AngularFrontEnd" && start.bat"

echo.
echo ========================================
echo   Sistema iniciado correctamente
echo ========================================
echo.
echo Backend: http://localhost:8081
echo Frontend: http://localhost:4200
echo.
echo Se han abierto dos ventanas:
echo   - Backend (Spring Boot)
echo   - Frontend (Angular)
echo.
echo Cierra ambas ventanas para detener el sistema.
echo.
pause
