#!/bin/bash

echo "=== Configuración del Backend Spring Boot ==="
echo

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "Java no está instalado. Instalando OpenJDK 21..."
    sudo apt update
    sudo apt install -y openjdk-21-jdk
    
    # Configurar JAVA_HOME
    echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
    echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
    export PATH=$JAVA_HOME/bin:$PATH
    
    echo "Java 21 instalado correctamente."
else
    echo "Java ya está instalado:"
    java -version
fi

echo
echo "=== Verificando configuración de la base de datos ==="
echo "Asegúrate de que PostgreSQL esté ejecutándose y que la base de datos 'Eventos_Universitarios' exista."
echo "Usuario: postgres"
echo "Contraseña: mosquera"
echo

# Dar permisos de ejecución al wrapper de Maven
chmod +x mvnw

echo "=== Compilando el proyecto ==="
./mvnw clean compile

if [ $? -eq 0 ]; then
    echo "✅ Compilación exitosa!"
    echo
    echo "=== Ejecutando la aplicación ==="
    echo "La aplicación se ejecutará en: http://localhost:8081"
    echo "Presiona Ctrl+C para detener la aplicación"
    echo
    ./mvnw spring-boot:run
else
    echo "❌ Error en la compilación. Revisa los errores anteriores."
    exit 1
fi
