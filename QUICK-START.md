# 🚀 Guía de Inicio Rápido

## ⚡ Windows - Primera Vez

```powershell
# 1. Abrir PowerShell como Administrador
# 2. Navegar al proyecto
cd c:\projects\Gestion-de-Eventos-Universitarios

# 3. Habilitar ejecución de scripts (solo la primera vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Ejecutar setup completo
cd backend-SpringBoot\GestionDeEventos
.\setup.ps1

# 5. Una vez terminado, usa start-all para iniciar todo
cd ..\..
.\start-all.bat
```

## 🔄 Windows - Uso Diario

```cmd
# Desde la raíz del proyecto
cd c:\projects\Gestion-de-Eventos-Universitarios
start-all.bat
```

---

## 🐧 Linux/Mac - Primera Vez

```bash
# 1. Navegar al proyecto
cd ~/Gestion-de-Eventos-Universitarios

# 2. Dar permisos a los scripts
chmod +x backend-SpringBoot/GestionDeEventos/setup.sh
chmod +x backend-SpringBoot/GestionDeEventos/setup-database.sh
chmod +x backend-SpringBoot/GestionDeEventos/start.sh
chmod +x frontend-Angular/AngularFrontEnd/start.sh
chmod +x start-all.sh

# 3. Ejecutar setup completo
cd backend-SpringBoot/GestionDeEventos
./setup.sh

# 4. Una vez terminado, usa start-all para iniciar todo
cd ../..
./start-all.sh
```

## 🔄 Linux/Mac - Uso Diario

```bash
# Desde la raíz del proyecto
cd ~/Gestion-de-Eventos-Universitarios
./start-all.sh
```

---

## 🌐 URLs de Acceso

Después de iniciar el sistema:

- **Backend API**: http://localhost:8081
- **Frontend**: http://localhost:4200

---

## 👤 Usuarios de Prueba

- **Admin**: admin@universidad.edu / admin123
- **Secretaría**: secretaria@universidad.edu / secretaria123
- **Organizador**: organizador@universidad.edu / organizador123

---

## 🛑 Detener el Sistema

**Windows**: Cierra las ventanas de comando que se abrieron

**Linux/Mac**: Presiona `Ctrl+C` en la terminal

---

## 📚 Documentación Completa

- **README.md** - Documentación principal completa
- **SCRIPTS-SUMMARY.md** - Resumen de todos los scripts
- **backend-SpringBoot/GestionDeEventos/SCRIPTS-README.md** - Guía detallada de scripts del backend

---

## 🆘 Problemas Comunes

### Error: "No se puede ejecutar scripts"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "psql no está en el PATH"
- Windows: Agrega `C:\Program Files\PostgreSQL\16\bin` al PATH
- Linux: `sudo apt install postgresql-client`
- Mac: `brew link postgresql@16`

### Error de conexión a PostgreSQL
```powershell
# Windows
Get-Service postgresql*
Start-Service postgresql-x64-16

# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql@16
```

### Puerto 8081 ya en uso
Edita `application.properties` y cambia `server.port=8082`

---

**¿Listo?** Solo ejecuta `start-all` y comienza a desarrollar! 🎉
