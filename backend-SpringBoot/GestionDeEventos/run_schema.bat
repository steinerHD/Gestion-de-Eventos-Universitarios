@echo off
echo Ejecutando schema.sql en PostgreSQL...
echo.

REM Intentar conectar y ejecutar el schema
echo Conectando a la base de datos...
psql -h localhost -U postgres -d Eventos_Universitarios -f src\main\resources\schema.sql

if %errorlevel% neq 0 (
    echo.
    echo Error al ejecutar el schema. Intentando con pgAdmin o herramienta alternativa...
    echo Por favor, ejecute manualmente el archivo schema.sql en su cliente PostgreSQL.
    echo.
    pause
) else (
    echo.
    echo Schema ejecutado exitosamente!
    echo.
)

pause
