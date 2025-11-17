#!/bin/bash

echo "========================================"
echo "  Iniciando Backend Spring Boot"
echo "========================================"
echo ""
echo "La aplicación se ejecutará en: http://localhost:8081"
echo "Presiona Ctrl+C para detener"
echo ""

cd "$(dirname "$0")"
./mvnw spring-boot:run
