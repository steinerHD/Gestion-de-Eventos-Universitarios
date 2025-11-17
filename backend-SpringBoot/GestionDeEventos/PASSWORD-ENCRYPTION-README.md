# Sistema de Encriptación de Contraseñas con BCrypt

## Descripción

Se ha implementado un sistema completo de encriptación de contraseñas usando BCrypt en el backend. Este sistema incluye:

1. **Encriptación automática** de contraseñas al crear o actualizar usuarios
2. **Verificación segura** de contraseñas en el login
3. **Sistema de recuperación de contraseña** con tokens seguros y temporales
4. **Migración de contraseñas existentes** de texto plano a BCrypt

## Componentes Implementados

### Backend

#### 1. PasswordService.java
Servicio principal para encriptación y verificación:
- `encryptPassword(String rawPassword)`: Encripta una contraseña
- `verifyPassword(String rawPassword, String encodedPassword)`: Verifica una contraseña
- `needsUpgrade(String encodedPassword)`: Verifica si un hash necesita actualización

#### 2. PasswordResetToken.java (Entidad)
Almacena tokens de recuperación de contraseña:
- Token único generado con UUID
- Expiración de 1 hora
- Flag de uso único
- Relación con Usuario

#### 3. RecuperarContrasenaService.java (Actualizado)
Maneja la recuperación de contraseñas:
- `enviarTokenRecuperacion(String correo)`: Genera token y envía correo
- `restablecerContrasena(String token, String nuevaContrasena)`: Restablece la contraseña
- `validarToken(String token)`: Valida si un token es válido

#### 4. UsuarioService.java (Actualizado)
Métodos nuevos:
- `authenticate(String correo, String rawPassword)`: Autenticación con BCrypt
- `updatePassword(Long userId, String newRawPassword)`: Actualiza contraseña
- `changePassword(Long userId, String oldRawPassword, String newRawPassword)`: Cambia contraseña

#### 5. AuthController.java (Actualizado)
Endpoints actualizados:
- `POST /api/auth/login`: Usa autenticación con BCrypt
- `POST /api/auth/recuperar`: Envía token de recuperación
- `POST /api/auth/restablecer-contrasena`: Restablece contraseña con token
- `GET /api/auth/validar-token`: Valida un token de recuperación

## Instalación y Configuración

### Paso 1: Ejecutar Script SQL

Ejecuta el script `password_reset_migration.sql` en tu base de datos PostgreSQL:

```sql
-- Se encuentra en: backend-SpringBoot/GestionDeEventos/password_reset_migration.sql
```

Esto creará la tabla `password_reset_token`.

### Paso 2: Migrar Contraseñas Existentes

Si tienes usuarios con contraseñas en texto plano, ejecuta la migración:

```bash
cd backend-SpringBoot/GestionDeEventos
./mvnw spring-boot:run -Dspring-boot.run.profiles=migrate-passwords
```

O en Windows:
```cmd
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=migrate-passwords
```

**IMPORTANTE:** Ejecuta esto solo UNA VEZ. Después, inicia el servidor normalmente sin el profile.

### Paso 3: Configuración del Frontend URL

El archivo `application.properties` ya está configurado con:
```properties
app.frontend.url=http://localhost:4200
```

Cambia esta URL si tu frontend está en otro puerto o dominio.

## Uso del Sistema

### 1. Registro de Usuarios

Las contraseñas se encriptan automáticamente al registrar un usuario:

```java
UsuarioRequest request = new UsuarioRequest();
request.setCorreo("usuario@ejemplo.com");
request.setContrasenaHash("miContraseña123"); // Se encriptará automáticamente
usuarioService.save(request);
```

### 2. Login

El login verifica la contraseña con BCrypt:

```java
POST /api/auth/login
{
  "correo": "usuario@ejemplo.com",
  "contrasenaHash": "miContraseña123"  // Enviar en texto plano, se verifica con BCrypt
}
```

### 3. Recuperación de Contraseña

**Paso 1:** Solicitar recuperación
```java
POST /api/auth/recuperar
{
  "correo": "usuario@ejemplo.com"
}
```

El usuario recibirá un correo con un enlace tipo:
`http://localhost:4200/reset-password?token=abc-123-def-456`

**Paso 2:** Validar token (opcional, para UX)
```java
GET /api/auth/validar-token?token=abc-123-def-456
```

**Paso 3:** Restablecer contraseña
```java
POST /api/auth/restablecer-contrasena
{
  "token": "abc-123-def-456",
  "nuevaContrasena": "nuevaContraseña123"
}
```

### 4. Cambiar Contraseña (Usuario Autenticado)

```java
boolean exitoso = usuarioService.changePassword(
    userId, 
    "contraseñaAnterior", 
    "nuevaContraseña"
);
```

## Seguridad

### BCrypt
- **Algoritmo:** BCrypt con strength 12
- **Salt:** Generado automáticamente por BCrypt
- **Resistencia:** Resistente a ataques de fuerza bruta y rainbow tables
- **Costo:** ~250ms por hash (balance seguridad/rendimiento)

### Tokens de Recuperación
- **Generación:** UUID aleatorio (128 bits de entropía)
- **Expiración:** 1 hora
- **Uso único:** No reutilizable
- **Almacenamiento:** Base de datos con índices optimizados

### Mejores Prácticas Implementadas
✅ Contraseñas nunca se almacenan en texto plano
✅ Tokens de recuperación con expiración
✅ Tokens de un solo uso
✅ Eliminación de tokens anteriores al generar nuevos
✅ Validación de tokens antes de restablecer
✅ Logging de operaciones de seguridad

## Frontend (Pendiente de Implementar)

Necesitarás crear en Angular:

1. **Componente de Recuperación de Contraseña**
   - Formulario para ingresar correo
   - Llamada a `/api/auth/recuperar`

2. **Componente de Restablecimiento de Contraseña**
   - Ruta: `/reset-password`
   - Lee el token de los query params
   - Valida el token
   - Formulario para nueva contraseña
   - Llamada a `/api/auth/restablecer-contrasena`

3. **Actualizar Servicio de Autenticación**
   - El login ahora envía la contraseña en texto plano
   - El backend se encarga de verificar con BCrypt

## Troubleshooting

### Error: "Token inválido, expirado o ya utilizado"
- El token tiene más de 1 hora
- El token ya fue usado
- El token no existe en la base de datos

### Error: "La contraseña no puede estar vacía"
- Se intentó encriptar una contraseña vacía o null

### Los usuarios no pueden hacer login después de la migración
- Verifica que ejecutaste el script de migración
- Revisa los logs para ver si todos los usuarios se migraron
- Verifica que el frontend envíe la contraseña en texto plano (no hasheada)

## Testing

Para probar el sistema:

1. Crea un usuario nuevo (la contraseña se encriptará)
2. Intenta hacer login
3. Solicita recuperación de contraseña
4. Verifica el correo recibido
5. Usa el enlace para restablecer
6. Intenta login con la nueva contraseña

## Notas Importantes

⚠️ **NO** ejecutes la migración más de una vez
⚠️ **NO** envíes contraseñas hasheadas desde el frontend
⚠️ **SÍ** mantén el secret JWT seguro
⚠️ **SÍ** usa HTTPS en producción

## Próximos Pasos Recomendados

1. Implementar componentes de Angular para recuperación de contraseña
2. Agregar validación de fortaleza de contraseñas en el frontend
3. Implementar límite de intentos de login (rate limiting)
4. Agregar autenticación de dos factores (2FA)
5. Implementar política de expiración de contraseñas
6. Agregar auditoría de cambios de contraseña
