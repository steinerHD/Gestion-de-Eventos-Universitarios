#!/bin/bash

echo "=== Corrigiendo Base de Datos ==="
echo

# Detener la aplicación si está ejecutándose
echo "1. Deteniendo aplicación si está ejecutándose..."
pkill -f "spring-boot:run" 2>/dev/null || echo "No hay aplicación ejecutándose"

echo
echo "2. Recreando base de datos..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"Eventos_Universitarios\";"
sudo -u postgres psql -c "CREATE DATABASE \"Eventos_Universitarios\";"

echo
echo "3. Ejecutando schema corregido..."
sudo -u postgres psql -d "Eventos_Universitarios" -f src/main/resources/schema-simple.sql

echo
echo "4. Ejecutando funciones SQL..."
sudo -u postgres psql -d "Eventos_Universitarios" -f src/main/resources/functions.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de datos recreada correctamente!"
    echo
    echo "5. Ejecutando aplicación..."
    echo "La aplicación se ejecutará en: http://localhost:8081"
    echo "Presiona Ctrl+C para detener"
    ./mvnw spring-boot:run
else
    echo "❌ Error al recrear la base de datos"
    exit 1
fi
