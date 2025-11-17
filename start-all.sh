#!/bin/bash

echo "========================================"
echo "  Iniciando Sistema Completo"
echo "  Backend + Frontend"
echo "========================================"
echo ""

# Obtener directorio del script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

echo "[1/2] Iniciando Backend..."
cd "$SCRIPT_DIR/backend-SpringBoot/GestionDeEventos"
chmod +x start.sh mvnw
./start.sh &
BACKEND_PID=$!

# Esperar 10 segundos para que el backend inicie
sleep 10

echo ""
echo "[2/2] Iniciando Frontend..."
cd "$SCRIPT_DIR/frontend-Angular/AngularFrontEnd"
chmod +x start.sh
./start.sh &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Sistema iniciado correctamente"
echo "========================================"
echo ""
echo "Backend: http://localhost:8081 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:4200 (PID: $FRONTEND_PID)"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"
echo ""

# Esperar indefinidamente
wait
