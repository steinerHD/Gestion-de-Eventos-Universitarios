@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Configurar Base de Datos PostgreSQL
echo ========================================
echo.

REM Leer contraseña de application.properties
set DB_PASSWORD=mosquera
if exist src\main\resources\application.properties (
    for /f "tokens=2 delims==" %%a in ('findstr "spring.datasource.password=" src\main\resources\application.properties') do (
        set DB_PASSWORD=%%a
    )
)

set DB_NAME=Eventos_Universitarios
set DB_USER=postgres

echo Configuracion:
echo   Base de datos: %DB_NAME%
echo   Usuario: %DB_USER%
echo   Contraseña: %DB_PASSWORD%
echo.

REM Configurar variable de entorno para psql
set PGPASSWORD=%DB_PASSWORD%

REM Verificar si psql está disponible
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: psql no esta en el PATH
    echo.
    echo Por favor:
    echo   1. Verifica que PostgreSQL este instalado
    echo   2. Agrega PostgreSQL al PATH (ej: C:\Program Files\PostgreSQL\16\bin)
    echo   3. O usa el script setup.ps1 para instalacion automatica
    echo.
    pause
    exit /b 1
)

echo [1/3] Creando base de datos '%DB_NAME%'...
psql -h localhost -U %DB_USER% -d postgres -c "CREATE DATABASE \"%DB_NAME%\";" 2>nul
if %errorlevel% equ 0 (
    echo OK Base de datos creada
) else (
    echo INFO La base de datos ya existe
)

echo.
echo [2/3] Ejecutando schema.sql...
if exist src\main\resources\schema.sql (
    psql -h localhost -U %DB_USER% -d %DB_NAME% -f src\main\resources\schema.sql
    if %errorlevel% equ 0 (
        echo OK Schema ejecutado correctamente
    ) else (
        echo ADVERTENCIA Hubo errores al ejecutar el schema
    )
) else (
    echo ERROR No se encontro src\main\resources\schema.sql
)

echo.
echo [3/3] Ejecutando inserts.sql...
if exist src\main\resources\inserts.sql (
    psql -h localhost -U %DB_USER% -d %DB_NAME% -f src\main\resources\inserts.sql 2>nul
    if %errorlevel% equ 0 (
        echo OK Datos de prueba insertados
    ) else (
        echo INFO Los datos de prueba ya existen
    )
) else (
    echo INFO No se encontro inserts.sql (opcional)
)

set PGPASSWORD=

echo.
echo ========================================
echo   Configuracion completada
echo ========================================
echo.
echo Informacion de conexion:
echo   Host: localhost
echo   Puerto: 5432
echo   Base de datos: %DB_NAME%
echo   Usuario: %DB_USER%
echo.
echo Verifica la conexion con:
echo   set PGPASSWORD=%DB_PASSWORD% ^&^& psql -h localhost -U %DB_USER% -d %DB_NAME%
echo.
pause
