# Gestión de Eventos Universitarios

Sistema completo full-stack para la gestión de eventos universitarios, desarrollado con Spring Boot (backend) y Angular (frontend).

## 🎯 Características

- **Gestión de Eventos**: Crear, editar, eliminar y consultar eventos
- **Encuentros y Horarios**: Definir múltiples encuentros por evento con fechas, horarios e instalaciones
- **Reserva de Instalaciones**: Sistema de reserva con detección automática de conflictos de horarios
- **Coorganizadores**: Asociar múltiples organizadores y organizaciones externas con sus certificados
- **Flujo de Aprobación**: Sistema de validación con estados (Pendiente, En Validación, Aprobado, Rechazado)
- **Gestión de Usuarios**: Diferentes roles (organizador, secretaría, administrador)
- **Notificaciones por Email**: Envío automático de correos en cambios de estado

## 📋 Requisitos Previos

### Windows
- **Java JDK 21** (se instala automáticamente con el script de setup)
- **PostgreSQL** (versión 14 o superior)
- **Node.js** (versión 18 o superior) y npm
- **Git** (opcional, para clonar el repositorio)

### Linux/Mac
- Los scripts de instalación instalarán automáticamente Java y PostgreSQL si no están presentes

## 🚀 Instalación y Ejecución

### ⚡ Inicio Rápido (Windows)

**La forma más fácil es usar el script de configuración automática:**

1. **Abre PowerShell como Administrador** (necesario para instalar Java y PostgreSQL)
2. Navega a la carpeta del backend:
   ```powershell
   cd backend-SpringBoot\GestionDeEventos
   ```
3. Si es la primera vez ejecutando scripts PowerShell, habilita la ejecución:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Ejecuta el script de setup:
   ```powershell
   .\setup.ps1
   ```

El script instalará automáticamente:
- ✅ Java JDK 21 (si no está instalado)
- ✅ PostgreSQL (te preguntará cómo instalarlo)
- ✅ Base de datos y tablas
- ✅ Datos de prueba
- ✅ Compilará y ejecutará el backend

**¡Listo!** El backend estará corriendo en `http://localhost:8081`

### 🚀 Iniciar Todo el Sistema (Backend + Frontend)

Después de la configuración inicial, puedes iniciar todo el sistema de una vez:

**Windows:**
```cmd
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

Esto abrirá:
- Backend en `http://localhost:8081`
- Frontend en `http://localhost:4200`

### 🔄 Ejecuciones Posteriores (Después de la configuración inicial)

Una vez configurado todo, para iniciar el backend simplemente usa:

**Windows:**
```cmd
cd backend-SpringBoot\GestionDeEventos
start.bat
```

**Linux/Mac:**
```bash
cd backend-SpringBoot/GestionDeEventos
./start.sh
```

### Opción 1: Setup Automático (Windows - Recomendado)

### 📖 Opciones Avanzadas de Setup

#### Setup Automático Completo (Primera vez)

**Windows (PowerShell):**
```powershell
cd backend-SpringBoot\GestionDeEventos
.\setup.ps1
```

**Linux/Mac (Bash):**
```bash
cd backend-SpringBoot/GestionDeEventos
chmod +x setup.sh
./setup.sh
```

El script realizará:
1. Verificación e instalación de Java JDK 21
2. Verificación e instalación de PostgreSQL
3. Creación de la base de datos
4. Ejecución de scripts SQL (schema.sql e inserts.sql)
5. Compilación y ejecución del backend

**Opciones del script:**
```powershell
# Saltar instalación de JDK
.\setup.ps1 -SkipJDK

# Saltar instalación de PostgreSQL
.\setup.ps1 -SkipPostgreSQL

# Solo ejecutar el backend (sin configurar)
.\setup.ps1 -OnlyRun
```

### Opción 2: Setup Manual por Pasos

#### Paso 1: Configurar Base de Datos

**Windows:**
```cmd
cd backend-SpringBoot\GestionDeEventos
run_schema.bat
```

**Linux/Mac:**
```bash
cd backend-SpringBoot/GestionDeEventos
chmod +x setup-database.sh
./setup-database.sh
```

#### Paso 2: Configurar y Ejecutar Backend

Antes de ejecutar, verifica la configuración en `backend-SpringBoot/GestionDeEventos/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/Eventos_Universitarios
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASEÑA_AQUI
```

**Windows:**
```cmd
cd backend-SpringBoot\GestionDeEventos
mvnw.cmd clean spring-boot:run
```

**Linux/Mac:**
```bash
cd backend-SpringBoot/GestionDeEventos
chmod +x setup.sh
./setup.sh
```

El backend se ejecutará en: `http://localhost:8081`

#### Paso 3: Ejecutar Frontend

En una nueva terminal:

**Windows:**
```cmd
cd frontend-Angular\AngularFrontEnd
start.bat
```

**Linux/Mac:**
```bash
cd frontend-Angular/AngularFrontEnd
chmod +x start.sh
./start.sh
```

El script instalará automáticamente las dependencias con `npm install` si es la primera vez.

El frontend estará disponible en: `http://localhost:4200`

---

### 📚 Más Información sobre Scripts

Para detalles completos sobre todos los scripts disponibles, consulta:
- **Backend**: `backend-SpringBoot/GestionDeEventos/SCRIPTS-README.md`

## 📁 Estructura del Proyecto

```
├── backend-SpringBoot/
│   └── GestionDeEventos/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/Geventos/GestionDeEventos/
│       │   │   │   ├── controller/      # Controladores REST
│       │   │   │   ├── service/         # Lógica de negocio
│       │   │   │   ├── entity/          # Entidades JPA
│       │   │   │   ├── repository/      # Repositorios de datos
│       │   │   │   ├── dto/             # DTOs (Request/Response)
│       │   │   │   ├── mapper/          # Mapeo entre entidades y DTOs
│       │   │   │   └── config/          # Configuración (Security, JWT, etc)
│       │   │   └── resources/
│       │   │       ├── application.properties  # Configuración principal
│       │   │       ├── schema.sql              # Estructura de la BD
│       │   │       └── inserts.sql             # Datos de prueba
│       │   └── test/
│       ├── setup.ps1              # Script de instalación Windows
│       ├── setup.sh               # Script de instalación Linux/Mac
│       ├── setup-database.sh      # Configuración de BD Linux/Mac
│       ├── run_schema.bat         # Configuración de BD Windows
│       └── pom.xml                # Dependencias Maven
│
└── frontend-Angular/
    └── AngularFrontEnd/
        ├── src/
        │   ├── app/
        │   │   ├── components/           # Componentes reutilizables
        │   │   ├── services/             # Servicios HTTP
        │   │   ├── config/               # Configuración API
        │   │   ├── login/                # Componentes de autenticación
        │   │   ├── home/                 # Página principal
        │   │   ├── add-event/            # Crear/editar eventos
        │   │   ├── my-events/            # Mis eventos
        │   │   ├── aprob-event/          # Aprobar eventos
        │   │   └── profile/              # Perfil de usuario
        │   ├── assets/
        │   │   ├── images/               # Imágenes
        │   │   └── uploads/              # Archivos subidos (avales, actas)
        │   └── styles.css                # Estilos globales
        ├── angular.json
        ├── package.json
        └── tsconfig.json
```

## 🔧 Configuración

### Backend (application.properties)

```properties
# Base de Datos
spring.datasource.url=jdbc:postgresql://localhost:5432/Eventos_Universitarios
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña

# Puerto del servidor
server.port=8081

# JWT (Seguridad)
jwt.secret=tu_clave_secreta_aqui
jwt.expiration=3600000

# Email (SMTP Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.username=tu_email@gmail.com
spring.mail.password=tu_app_password

# Rutas de archivos
aval.upload.path=../../frontend-Angular/AngularFrontEnd/src/assets/uploads/avales
acta.upload.path=../../frontend-Angular/AngularFrontEnd/src/assets/uploads/actas
```

### Frontend (src/app/config/api.config.ts)

```typescript
export const API_BASE_URL = 'http://localhost:8081';

export const API_ENDPOINTS = {
  eventos: `${API_BASE_URL}/api/eventos`,
  usuarios: `${API_BASE_URL}/api/usuarios`,
  auth: `${API_BASE_URL}/api/auth`,
  // ... más endpoints
};
```

## 📡 API Endpoints Principales

### Eventos
- `GET /api/eventos` - Listar todos los eventos
- `GET /api/eventos/{id}` - Obtener evento por ID
- `POST /api/eventos` - Crear nuevo evento
- `PUT /api/eventos/{id}` - Actualizar evento
- `DELETE /api/eventos/{id}` - Eliminar evento
- `POST /api/eventos/{id}/enviar-validacion` - Enviar a validación
- `POST /api/eventos/{id}/aprobar` - Aprobar evento
- `POST /api/eventos/{id}/rechazar` - Rechazar evento

### Usuarios
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/usuarios/me` - Obtener perfil actual
- `PUT /api/usuarios/{id}` - Actualizar usuario

### Instalaciones
- `GET /api/instalaciones` - Listar instalaciones
- `GET /api/instalaciones/{id}/disponibilidad` - Verificar disponibilidad

## 🧪 Datos de Prueba

El script `inserts.sql` crea usuarios y datos de prueba:

**Usuarios por defecto:**
- **Administrador**: admin@universidad.edu / admin123
- **Secretaría**: secretaria@universidad.edu / secretaria123
- **Organizador**: organizador@universidad.edu / organizador123

## 🔒 Seguridad

- **Autenticación**: JWT (JSON Web Tokens)
- **Autorización**: Control de acceso basado en roles
- **Encriptación**: Contraseñas hasheadas con BCrypt
- **CORS**: Configurado para desarrollo local

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL está ejecutándose
# Windows (PowerShell)
Get-Service postgresql*

# Linux/Mac
sudo systemctl status postgresql
```

### Error "psql no está en el PATH"
Agrega PostgreSQL al PATH:
- Windows: `C:\Program Files\PostgreSQL\16\bin`
- Linux: Usualmente ya está en el PATH después de la instalación
- Mac: `brew link postgresql@16`

### Error de compilación Maven
```bash
# Limpiar caché de Maven
mvnw clean

# Reinstalar dependencias
mvnw dependency:purge-local-repository
```

### Puerto 8081 ya en uso
Cambia el puerto en `application.properties`:
```properties
server.port=8082
```

Y actualiza `API_BASE_URL` en el frontend.

### Error CORS en el frontend
Verifica que el backend permita el origen del frontend en la configuración de CORS.

## 📝 Comandos Útiles

### Backend
```bash
# Compilar sin ejecutar tests
mvnw.cmd clean package -DskipTests

# Ejecutar JAR generado
java -jar target\GestionDeEventos-0.0.1-SNAPSHOT.jar

# Ver logs en tiempo real
mvnw.cmd spring-boot:run --debug
```

### Frontend
```bash
# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Verificar errores de linting
npm run lint
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras problemas durante la instalación o ejecución:

1. Verifica los logs del backend para errores específicos
2. Asegúrate de que todas las dependencias estén instaladas
3. Consulta la sección de solución de problemas
4. Abre un issue en el repositorio con el error completo

---

**Desarrollado para la gestión eficiente de eventos universitarios** 🎓

