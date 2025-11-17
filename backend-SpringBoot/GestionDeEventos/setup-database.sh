#!/bin/bash

set -e  # Salir si hay errores

echo "=== Configuración de la Base de Datos PostgreSQL ==="
echo

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PKG_MANAGER="apt"
    if command -v yum &> /dev/null; then
        PKG_MANAGER="yum"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    PKG_MANAGER="brew"
else
    echo "❌ Sistema operativo no soportado"
    exit 1
fi

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL no está instalado. Instalando..."
    
    if [ "$OS" = "linux" ]; then
        if [ "$PKG_MANAGER" = "apt" ]; then
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        elif [ "$PKG_MANAGER" = "yum" ]; then
            sudo yum install -y postgresql-server postgresql-contrib
            sudo postgresql-setup --initdb
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        fi
    elif [ "$OS" = "mac" ]; then
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew no está instalado. Instálalo desde https://brew.sh/"
            exit 1
        fi
        brew install postgresql@16
        brew services start postgresql@16
    fi
    
    echo "✅ PostgreSQL instalado correctamente"
else
    echo "✅ PostgreSQL ya está instalado"
fi

echo
echo "=== Configurando la base de datos ==="

# Leer contraseña de application.properties
DB_PASSWORD="mosquera"
if [ -f "src/main/resources/application.properties" ]; then
    DB_PASSWORD=$(grep "spring.datasource.password=" src/main/resources/application.properties | cut -d'=' -f2)
fi

DB_NAME="Eventos_Universitarios"
DB_USER="postgres"

echo "Configuración:"
echo "  Base de datos: $DB_NAME"
echo "  Usuario: $DB_USER"
echo "  Contraseña: $DB_PASSWORD"
echo

# Configurar variable de entorno para psql
export PGPASSWORD="$DB_PASSWORD"

# Intentar crear la base de datos
echo "Creando base de datos '$DB_NAME'..."
if [ "$OS" = "linux" ]; then
    sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\";" 2>/dev/null && echo "✅ Base de datos creada" || echo "ℹ️  La base de datos ya existe"
    
    # Ejecutar schema
    if [ -f "src/main/resources/schema.sql" ]; then
        echo "Ejecutando schema.sql..."
        sudo -u postgres psql -d "$DB_NAME" -f src/main/resources/schema.sql
        echo "✅ Schema ejecutado"
    fi
    
    # Ejecutar inserts si existe
    if [ -f "src/main/resources/inserts.sql" ]; then
        echo "Ejecutando inserts.sql..."
        sudo -u postgres psql -d "$DB_NAME" -f src/main/resources/inserts.sql 2>/dev/null || echo "ℹ️  Datos de prueba ya existen"
    fi
else
    # Mac o sistema donde no se necesita sudo
    psql -h localhost -U "$DB_USER" -c "CREATE DATABASE \"$DB_NAME\";" 2>/dev/null && echo "✅ Base de datos creada" || echo "ℹ️  La base de datos ya existe"
    
    # Ejecutar schema
    if [ -f "src/main/resources/schema.sql" ]; then
        echo "Ejecutando schema.sql..."
        psql -h localhost -U "$DB_USER" -d "$DB_NAME" -f src/main/resources/schema.sql
        echo "✅ Schema ejecutado"
    fi
    
    # Ejecutar inserts si existe
    if [ -f "src/main/resources/inserts.sql" ]; then
        echo "Ejecutando inserts.sql..."
        psql -h localhost -U "$DB_USER" -d "$DB_NAME" -f src/main/resources/inserts.sql 2>/dev/null || echo "ℹ️  Datos de prueba ya existen"
    fi
fi

unset PGPASSWORD

echo
echo "✅ Base de datos configurada correctamente!"
echo
echo "=== Información de conexión ==="
echo "Host: localhost"
echo "Puerto: 5432"
echo "Base de datos: $DB_NAME"
echo "Usuario: $DB_USER"
echo "Contraseña: $DB_PASSWORD"
echo
echo "Puedes verificar la conexión con:"
echo "PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME"
