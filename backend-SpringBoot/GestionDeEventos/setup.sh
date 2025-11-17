#!/bin/bash

set -e  # Salir si hay errores

echo "========================================"
echo "  Setup Backend - Gestión de Eventos"
echo "========================================"
echo

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PKG_MANAGER="apt"
    if command -v yum &> /dev/null; then
        PKG_MANAGER="yum"
    elif command -v pacman &> /dev/null; then
        PKG_MANAGER="pacman"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    PKG_MANAGER="brew"
else
    echo "❌ Sistema operativo no soportado: $OSTYPE"
    echo "Use setup.ps1 para Windows"
    exit 1
fi

echo "[1/4] Verificando Java JDK 21..."

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "Java no está instalado. Instalando OpenJDK 21..."
    
    if [ "$OS" = "linux" ]; then
        if [ "$PKG_MANAGER" = "apt" ]; then
            sudo apt update
            sudo apt install -y openjdk-21-jdk
            
            # Configurar JAVA_HOME
            export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
            echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
            echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
        elif [ "$PKG_MANAGER" = "yum" ]; then
            sudo yum install -y java-21-openjdk java-21-openjdk-devel
        else
            echo "⚠️  Por favor instala Java 21 manualmente desde https://adoptium.net/"
            exit 1
        fi
    elif [ "$OS" = "mac" ]; then
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew no está instalado. Instálalo desde https://brew.sh/"
            exit 1
        fi
        brew install openjdk@21
        sudo ln -sfn $(brew --prefix)/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
    fi
    
    echo "✅ Java 21 instalado correctamente"
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}' | awk -F '.' '{print $1}')
    if [ "$JAVA_VERSION" -lt 21 ]; then
        echo "⚠️  Java $JAVA_VERSION detectado, se requiere Java 21+"
        echo "Por favor actualiza Java desde https://adoptium.net/"
        exit 1
    fi
    echo "✅ Java $JAVA_VERSION ya está instalado"
    java -version
fi

echo
echo "[2/4] Configurando base de datos..."

# Ejecutar script de configuración de base de datos
if [ -f "./setup-database.sh" ]; then
    chmod +x ./setup-database.sh
    ./setup-database.sh
else
    echo "⚠️  No se encontró setup-database.sh"
    echo "Asegúrate de que PostgreSQL esté ejecutándose y que la base de datos 'Eventos_Universitarios' exista."
fi

echo
echo "[3/4] Compilando el proyecto..."

# Dar permisos de ejecución al wrapper de Maven
chmod +x mvnw

./mvnw clean compile

if [ $? -eq 0 ]; then
    echo "✅ Compilación exitosa!"
else
    echo "❌ Error en la compilación. Revisa los errores anteriores."
    exit 1
fi

echo
echo "[4/4] Ejecutando la aplicación..."
echo "========================================"
echo "La aplicación se ejecutará en: http://localhost:8081"
echo "Presiona Ctrl+C para detener la aplicación"
echo "========================================"
echo

./mvnw spring-boot:run
