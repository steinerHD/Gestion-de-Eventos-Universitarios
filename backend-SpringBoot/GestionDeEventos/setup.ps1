# Script de configuracion completa del Backend Spring Boot
# Este script instala JDK, PostgreSQL, configura la base de datos e inicia el backend

param(
    [switch]$SkipJDK,
    [switch]$SkipPostgreSQL,
    [switch]$SkipDatabase,
    [switch]$OnlyRun
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Backend - Gestion de Eventos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Funcion para verificar si un comando existe
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Funcion para descargar archivo
function Download-File {
    param($url, $output)
    Write-Host "Descargando desde $url..." -ForegroundColor Yellow
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $url -OutFile $output
    $ProgressPreference = 'Continue'
}

# ============================
# 1. VERIFICAR/INSTALAR JDK 21
# ============================
if (-not $SkipJDK -and -not $OnlyRun) {
    Write-Host "[1/4] Verificando Java JDK 21..." -ForegroundColor Green
    
    $javaInstalled = Test-CommandExists "java"
    $javaVersion = ""
    
    if ($javaInstalled) {
        try {
            $javaVersionOutput = & java -version 2>&1 | Select-Object -First 1
            $javaVersion = $javaVersionOutput -replace '.*"(\d+).*', '$1'
            Write-Host "Java detectado: $javaVersionOutput" -ForegroundColor Gray
        } catch {
            $javaInstalled = $false
        }
    }
    
    if (-not $javaInstalled -or $javaVersion -lt 21) {
        Write-Host "Java 21 no esta instalado. Descargando e instalando..." -ForegroundColor Yellow
        
        # Descargar OpenJDK 21 (Microsoft)
        $jdkUrl = "https://aka.ms/download-jdk/microsoft-jdk-21-windows-x64.msi"
        $jdkInstaller = "$env:TEMP\microsoft-jdk-21.msi"
        
        try {
            Download-File -url $jdkUrl -output $jdkInstaller
            
            Write-Host "Instalando JDK 21 (esto puede tardar unos minutos)..." -ForegroundColor Yellow
            Start-Process msiexec.exe -ArgumentList "/i `"$jdkInstaller`" /quiet /norestart" -Wait
            
            # Refrescar variables de entorno
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            Write-Host "OK JDK 21 instalado correctamente" -ForegroundColor Green
        } catch {
            Write-Host "ERROR al instalar JDK 21. Por favor, instala manualmente desde:" -ForegroundColor Red
            Write-Host "   https://learn.microsoft.com/en-us/java/openjdk/download" -ForegroundColor Yellow
            exit 1
        } finally {
            if (Test-Path $jdkInstaller) {
                Remove-Item $jdkInstaller -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "OK Java 21 ya esta instalado" -ForegroundColor Green
    }
    Write-Host ""
} else {
    Write-Host "[1/4] Verificacion de Java omitida" -ForegroundColor Gray
    Write-Host ""
}

# ============================
# 2. VERIFICAR/INSTALAR POSTGRESQL
# ============================
if (-not $SkipPostgreSQL -and -not $OnlyRun) {
    Write-Host "[2/4] Verificando PostgreSQL..." -ForegroundColor Green
    
    $psqlInstalled = Test-CommandExists "psql"
    
    if (-not $psqlInstalled) {
        Write-Host "PostgreSQL no esta instalado." -ForegroundColor Yellow
        Write-Host "Opciones de instalacion:" -ForegroundColor Cyan
        Write-Host "  1. Instalar con Chocolatey (recomendado si tienes Chocolatey)" -ForegroundColor Gray
        Write-Host "  2. Descargar instalador oficial" -ForegroundColor Gray
        Write-Host "  3. Continuar sin instalar (deberas instalarlo manualmente)" -ForegroundColor Gray
        
        $choice = Read-Host "Elige opcion (1, 2 o 3)"
        
        switch ($choice) {
            "1" {
                if (Test-CommandExists "choco") {
                    Write-Host "Instalando PostgreSQL con Chocolatey..." -ForegroundColor Yellow
                    choco install postgresql -y
                    
                    # Refrescar variables de entorno
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                    
                    Write-Host "OK PostgreSQL instalado" -ForegroundColor Green
                } else {
                    Write-Host "ERROR Chocolatey no esta instalado. Instalalo desde https://chocolatey.org/" -ForegroundColor Red
                    Write-Host "O elige la opcion 2" -ForegroundColor Yellow
                    exit 1
                }
            }
            "2" {
                Write-Host "Descargando instalador de PostgreSQL..." -ForegroundColor Yellow
                $pgUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.1-1-windows-x64.exe"
                $pgInstaller = "$env:TEMP\postgresql-installer.exe"
                
                try {
                    Download-File -url $pgUrl -output $pgInstaller
                    
                    Write-Host "Ejecutando instalador de PostgreSQL..." -ForegroundColor Yellow
                    Write-Host "IMPORTANTE: Recuerda la contrasena del usuario 'postgres'" -ForegroundColor Red
                    Start-Process $pgInstaller -Wait
                    
                    # Refrescar variables de entorno
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                } finally {
                    if (Test-Path $pgInstaller) {
                        Remove-Item $pgInstaller -Force -ErrorAction SilentlyContinue
                    }
                }
            }
            "3" {
                Write-Host "ADVERTENCIA Continuando sin instalar PostgreSQL" -ForegroundColor Yellow
                Write-Host "Instala PostgreSQL manualmente desde: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
            }
            default {
                Write-Host "ERROR Opcion invalida" -ForegroundColor Red
                exit 1
            }
        }
    } else {
        Write-Host "OK PostgreSQL ya esta instalado" -ForegroundColor Green
    }
    Write-Host ""
} else {
    Write-Host "[2/4] Verificacion de PostgreSQL omitida" -ForegroundColor Gray
    Write-Host ""
}

# ============================
# 3. CONFIGURAR BASE DE DATOS
# ============================
if (-not $SkipDatabase -and -not $OnlyRun) {
    Write-Host "[3/4] Configurando base de datos..." -ForegroundColor Green
    
    $dbName = "Eventos_Universitarios"
    $dbUser = "postgres"
    
    # Leer contrasena de application.properties
    $appPropsFile = "src\main\resources\application.properties"
    $dbPassword = "mosquera"
    
    if (Test-Path $appPropsFile) {
        $props = Get-Content $appPropsFile
        $passwordLine = $props | Where-Object { $_ -match "spring.datasource.password=" }
        if ($passwordLine) {
            $dbPassword = ($passwordLine -split "=")[1].Trim()
        }
    }
    
    Write-Host "Configuracion de la base de datos:" -ForegroundColor Cyan
    Write-Host "  Base de datos: $dbName" -ForegroundColor Gray
    Write-Host "  Usuario: $dbUser" -ForegroundColor Gray
    Write-Host "  Contrasena: $dbPassword" -ForegroundColor Gray
    Write-Host ""
    
    $confirm = Read-Host "Es correcta la contrasena? (S/n)"
    if ($confirm -eq "n" -or $confirm -eq "N") {
        $securePassword = Read-Host "Ingresa la contrasena de PostgreSQL" -AsSecureString
        $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
    }
    
    # Configurar variable de entorno para psql
    $env:PGPASSWORD = $dbPassword
    
    try {
        # Verificar conexion
        Write-Host "Verificando conexion a PostgreSQL..." -ForegroundColor Yellow
        $result = & psql -h localhost -U $dbUser -d postgres -c "SELECT version();" 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR No se pudo conectar a PostgreSQL" -ForegroundColor Red
            Write-Host "Verifica que PostgreSQL este ejecutandose" -ForegroundColor Yellow
            throw "Conexion fallida"
        }
        
        # Crear base de datos si no existe
        Write-Host "Creando base de datos '$dbName'..." -ForegroundColor Yellow
        $result = & psql -h localhost -U $dbUser -d postgres -c "CREATE DATABASE `"$dbName`";" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK Base de datos creada" -ForegroundColor Green
        } else {
            Write-Host "INFO La base de datos ya existe" -ForegroundColor Gray
        }
        
        # Ejecutar schema.sql
        $schemaFile = "src\main\resources\schema.sql"
        if (Test-Path $schemaFile) {
            Write-Host "Ejecutando schema.sql..." -ForegroundColor Yellow
            $result = & psql -h localhost -U $dbUser -d $dbName -f $schemaFile 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK Schema ejecutado correctamente" -ForegroundColor Green
            } else {
                Write-Host "ADVERTENCIA Hubo advertencias al ejecutar el schema" -ForegroundColor Yellow
            }
        } else {
            Write-Host "ADVERTENCIA No se encontro schema.sql en $schemaFile" -ForegroundColor Yellow
        }
        
        # Ejecutar inserts.sql si existe
        $insertsFile = "src\main\resources\inserts.sql"
        if (Test-Path $insertsFile) {
            Write-Host "Ejecutando inserts.sql (datos de prueba)..." -ForegroundColor Yellow
            $result = & psql -h localhost -U $dbUser -d $dbName -f $insertsFile 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK Datos de prueba insertados" -ForegroundColor Green
            } else {
                Write-Host "INFO Los datos de prueba ya existen o hubo conflictos" -ForegroundColor Gray
            }
        }
        
    } catch {
        Write-Host "ERROR al configurar la base de datos: $_" -ForegroundColor Red
        Write-Host "Verifica que PostgreSQL este ejecutandose y que la contrasena sea correcta" -ForegroundColor Yellow
    } finally {
        $env:PGPASSWORD = $null
    }
    
    Write-Host ""
} else {
    Write-Host "[3/4] Configuracion de base de datos omitida" -ForegroundColor Gray
    Write-Host ""
}

# ============================
# 4. COMPILAR Y EJECUTAR BACKEND
# ============================
Write-Host "[4/4] Compilando y ejecutando el backend..." -ForegroundColor Green

# Limpiar y compilar
Write-Host "Limpiando y compilando el proyecto..." -ForegroundColor Yellow
& .\mvnw.cmd clean compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en la compilacion" -ForegroundColor Red
    exit 1
}

Write-Host "OK Compilacion exitosa" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando aplicacion Spring Boot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "La aplicacion se ejecutara en: http://localhost:8081" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener la aplicacion" -ForegroundColor Yellow
Write-Host ""

& .\mvnw.cmd spring-boot:run

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR al ejecutar la aplicacion" -ForegroundColor Red
    exit 1
}
