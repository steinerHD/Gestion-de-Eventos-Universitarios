@echo off
echo ========================================
echo   Iniciando Frontend Angular
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar si node_modules existe
if not exist "node_modules\" (
    echo Instalando dependencias...
    echo.
    call npm install
    echo.
)

echo La aplicacion se ejecutara en: http://localhost:4200
echo Presiona Ctrl+C para detener
echo.

call npm start
