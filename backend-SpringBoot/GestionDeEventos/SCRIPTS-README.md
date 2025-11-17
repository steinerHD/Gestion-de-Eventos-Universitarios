# Guía de Scripts del Backend

Esta carpeta contiene varios scripts para facilitar la configuración e inicio del backend. Aquí está la guía de cuál usar en cada situación.

## 🚀 Scripts Disponibles

### Windows

#### `setup.ps1` (PowerShell - RECOMENDADO para primera vez)
**Cuándo usar:** Primera instalación del proyecto
**Qué hace:**
- ✅ Verifica e instala Java JDK 21 automáticamente
- ✅ Verifica e instala PostgreSQL automáticamente
- ✅ Crea la base de datos
- ✅ Ejecuta schema.sql e inserts.sql
- ✅ Compila y ejecuta el backend

**Cómo ejecutar:**
```powershell
.\setup.ps1
```

**Opciones:**
```powershell
.\setup.ps1 -SkipJDK           # No verificar/instalar Java
.\setup.ps1 -SkipPostgreSQL    # No verificar/instalar PostgreSQL
.\setup.ps1 -SkipDatabase      # No configurar base de datos
.\setup.ps1 -OnlyRun           # Solo ejecutar (sin instalar nada)
```

#### `run_schema.bat` (Batch)
**Cuándo usar:** Solo quieres crear/actualizar la base de datos
**Qué hace:**
- Crea la base de datos si no existe
- Ejecuta schema.sql
- Ejecuta inserts.sql (datos de prueba)

**Cómo ejecutar:**
```cmd
run_schema.bat
```

#### `start.bat` (Batch)
**Cuándo usar:** Ya configuraste todo y solo quieres iniciar el backend
**Qué hace:**
- Solo ejecuta el backend (sin configurar nada)

**Cómo ejecutar:**
```cmd
start.bat
```

O simplemente:
```cmd
mvnw.cmd spring-boot:run
```

---

### Linux/Mac

#### `setup.sh` (Bash - RECOMENDADO para primera vez)
**Cuándo usar:** Primera instalación del proyecto
**Qué hace:**
- ✅ Verifica e instala Java JDK 21 automáticamente
- ✅ Ejecuta setup-database.sh
- ✅ Compila y ejecuta el backend

**Cómo ejecutar:**
```bash
chmod +x setup.sh
./setup.sh
```

#### `setup-database.sh` (Bash)
**Cuándo usar:** Solo quieres configurar/actualizar la base de datos
**Qué hace:**
- Verifica e instala PostgreSQL si no está
- Crea la base de datos
- Ejecuta schema.sql e inserts.sql

**Cómo ejecutar:**
```bash
chmod +x setup-database.sh
./setup-database.sh
```

#### `start.sh` (Bash)
**Cuándo usar:** Ya configuraste todo y solo quieres iniciar el backend
**Qué hace:**
- Solo ejecuta el backend

**Cómo ejecutar:**
```bash
chmod +x start.sh
./start.sh
```

O simplemente:
```bash
./mvnw spring-boot:run
```

---

## 📋 Flujo de Trabajo Recomendado

### Primera vez (instalación completa)

**Windows:**
```powershell
# Ejecutar como Administrador (para instalar Java y PostgreSQL)
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Solo actualizar base de datos

**Windows:**
```cmd
run_schema.bat
```

**Linux/Mac:**
```bash
chmod +x setup-database.sh
./setup-database.sh
```

### Solo iniciar el backend (después de configurar)

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

---

## 🔧 Solución de Problemas

### Windows: Error "No se puede ejecutar scripts en este sistema"

Esto significa que PowerShell tiene restricciones de ejecución. Ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego intenta de nuevo:
```powershell
.\setup.ps1
```

### Linux/Mac: "Permission denied"

Dale permisos de ejecución al script:

```bash
chmod +x setup.sh
chmod +x setup-database.sh
chmod +x start.sh
chmod +x mvnw
```

### "psql no está en el PATH"

**Windows:**
Agrega PostgreSQL al PATH:
1. Panel de Control → Sistema → Configuración avanzada del sistema
2. Variables de entorno
3. Editar PATH y agregar: `C:\Program Files\PostgreSQL\16\bin`

**Linux:**
```bash
sudo apt install postgresql-client
```

**Mac:**
```bash
brew link postgresql@16
```

### Error de conexión a la base de datos

Verifica que PostgreSQL esté ejecutándose:

**Windows:**
```powershell
Get-Service postgresql*
# Si no está activo:
Start-Service postgresql-x64-16
```

**Linux:**
```bash
sudo systemctl status postgresql
# Si no está activo:
sudo systemctl start postgresql
```

**Mac:**
```bash
brew services list
# Si no está activo:
brew services start postgresql@16
```

---

## 📝 Configuración Manual

Si prefieres configurar todo manualmente sin scripts:

1. **Instalar Java JDK 21:**
   - Windows: https://learn.microsoft.com/en-us/java/openjdk/download
   - Linux: `sudo apt install openjdk-21-jdk`
   - Mac: `brew install openjdk@21`

2. **Instalar PostgreSQL:**
   - Windows: https://www.postgresql.org/download/windows/
   - Linux: `sudo apt install postgresql postgresql-contrib`
   - Mac: `brew install postgresql@16`

3. **Crear base de datos:**
   ```sql
   CREATE DATABASE "Eventos_Universitarios";
   ```

4. **Ejecutar schema.sql:**
   ```bash
   psql -h localhost -U postgres -d Eventos_Universitarios -f src/main/resources/schema.sql
   ```

5. **Configurar application.properties:**
   Edita `src/main/resources/application.properties` con tu contraseña de PostgreSQL

6. **Compilar y ejecutar:**
   ```bash
   ./mvnw clean spring-boot:run
   ```

---

## 🎯 Resumen Rápido

| Situación | Windows | Linux/Mac |
|-----------|---------|-----------|
| Primera instalación completa | `.\setup.ps1` | `./setup.sh` |
| Solo base de datos | `run_schema.bat` | `./setup-database.sh` |
| Solo iniciar backend | `start.bat` | `./start.sh` |
| Comando directo | `mvnw.cmd spring-boot:run` | `./mvnw spring-boot:run` |

---

**¡Recuerda!** Después de la primera instalación con `setup.ps1` o `setup.sh`, puedes usar simplemente `start.bat` o `start.sh` para iniciar el backend las siguientes veces.
