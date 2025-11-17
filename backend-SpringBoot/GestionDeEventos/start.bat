@echo off
echo ========================================
echo   Iniciando Backend Spring Boot
echo ========================================
echo.
echo La aplicacion se ejecutara en: http://localhost:8081
echo Presiona Ctrl+C para detener
echo.

cd /d "%~dp0"
call mvnw.cmd spring-boot:run
