#!/bin/bash

echo "=== Configuración de la Base de Datos PostgreSQL ==="
echo

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL no está instalado. Instalando..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo "PostgreSQL instalado correctamente."
else
    echo "PostgreSQL ya está instalado."
fi

echo
echo "=== Configurando la base de datos ==="

# Crear la base de datos si no existe
sudo -u postgres psql -c "CREATE DATABASE \"Eventos_Universitarios\";" 2>/dev/null || echo "La base de datos ya existe o hubo un error."

# Crear usuario si no existe (opcional, ya que usamos postgres)
# sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'mosquera';" 2>/dev/null || echo "El usuario ya existe."

# Ejecutar el schema
echo "Ejecutando schema.sql..."
sudo -u postgres psql -d "Eventos_Universitarios" -f src/main/resources/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de datos configurada correctamente!"
    echo
    echo "=== Información de conexión ==="
    echo "Host: localhost"
    echo "Puerto: 5432"
    echo "Base de datos: Eventos_Universitarios"
    echo "Usuario: postgres"
    echo "Contraseña: mosquera"
    echo
    echo "Puedes verificar la conexión con:"
    echo "psql -h localhost -U postgres -d Eventos_Universitarios"
else
    echo "❌ Error al configurar la base de datos."
    exit 1
fi
