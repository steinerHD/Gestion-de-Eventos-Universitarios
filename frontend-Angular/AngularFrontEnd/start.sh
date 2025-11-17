#!/bin/bash

echo "========================================"
echo "  Iniciando Frontend Angular"
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    echo ""
    npm install
    echo ""
fi

echo "La aplicación se ejecutará en: http://localhost:4200"
echo "Presiona Ctrl+C para detener"
echo ""

npm start
