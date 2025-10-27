# Gestión de Eventos Universitarios

Este repositorio contiene una aplicación full-stack para gestionar eventos universitarios.

- Backend: Spring Boot (Java) — lógica del dominio, persistencia y APIs REST.
- Frontend: Angular — interfaz de usuario para organizadores, secretaría y demás roles.

La aplicación permite:
- Crear, editar y eliminar eventos.
- Definir encuentros (fechas, horarios, instalaciones).
- Asociar coorganizadores y organizaciones externas (con certificados PDF).
- Flujos de validación / aprobación: enviar a validación, aprobar o rechazar eventos.

Esta guía explica cómo ejecutar el proyecto en tu máquina (Windows, usando cmd.exe) y qué archivos/entradas son relevantes.

## Requisitos

- Java JDK 21 (el proyecto está configurado para java.version=21 en el pom.xml).
- Git (opcional, para clonar el repositorio).
- Node.js (>=18) y npm.
- PostgreSQL (o ajusta la configuración a la base de datos que prefieras).
- En Windows se usan los scripts incluidos (`mvnw.cmd`, `run_schema.bat`).

## Estructura principal

- `backend-SpringBoot/GestionDeEventos/` - backend Spring Boot
	- `src/main/java/...` - controladores, servicios, entidades y mappers
	- `src/main/resources/application.properties` - configuración (base de datos, puerto, JWT, mail, ...)
	- `mvnw.cmd` - wrapper Maven para Windows
	- `run_schema.bat` - script para crear/esquematizar la base de datos (si se incluye)
- `frontend-Angular/AngularFrontEnd/` - frontend Angular
	- `src/app/` - componentes y servicios Angular
	- `package.json` - scripts y dependencias
	- `src/app/config/api.config.ts` - URL base de la API y rutas usadas por el frontend

## Configurar la base de datos

Por defecto el backend está apuntando a una base de datos PostgreSQL local (ver `application.properties`):

```
spring.datasource.url=jdbc:postgresql://localhost:5432/Eventos_Universitarios
spring.datasource.username=postgres
spring.datasource.password=... (reemplazar)
```

Recomendaciones:
- Crea la base de datos `Eventos_Universitarios` en tu PostgreSQL local.
- Modifica `application.properties` con las credenciales que uses, o exporta variables de entorno para sobreescribir las propiedades de Spring Boot (por ejemplo `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
- Si el repositorio aporta scripts de inicialización (`run_schema.bat`, `setup-database.sh`), puedes ejecutarlos para crear tablas y datos de ejemplo.

> Importante: No comitas secretos en `application.properties` si subes el repo a un servidor público. Usa variables de entorno o un mecanismo seguro para secretos.

## Ejecutar el backend (Windows cmd)

1. Abrir una consola y situarse en el directorio del backend:

```cmd
cd backend-SpringBoot\GestionDeEventos
```

2. (Opcional) Crear / poblar la base de datos si dispones del script:

```cmd
run_schema.bat
```

3. Ejecutar la aplicación con el wrapper de Maven:

```cmd
mvnw.cmd spring-boot:run
```

La aplicación arrancará (por defecto) en el puerto 8081 según `application.properties`. Cambia el puerto allí si es necesario.

También puedes generar un JAR y ejecutarlo:

```cmd
mvnw.cmd clean package -DskipTests
java -jar target\GestionDeEventos-0.0.1-SNAPSHOT.jar
```

## Ejecutar el frontend (Angular)

1. Abrir otra consola y situarse en la carpeta del frontend:

```cmd
cd frontend-Angular\AngularFrontEnd
```

2. Instalar dependencias (una sola vez):

```cmd
npm install
```

3. Iniciar el servidor de desarrollo de Angular:

```cmd
npm start
```

Por defecto el frontend corre en `http://localhost:4200`. El frontend está configurado para llamar a la API en `http://localhost:8081` (ver `src/app/config/api.config.ts`). Si tu backend corre en otra URL/puerto, actualiza `API_BASE_URL` allí.

## Uso rápido

- Abre `http://localhost:4200` en tu navegador.
- Inicia sesión (usa un usuario existente o crea uno según el flujo de la app).
- Navega a "Mis eventos" para crear/editar o a "Aprobar eventos" si estás en el rol de secretaría.

## Endpoints útiles (ejemplos)

- Listar eventos:
	- GET http://localhost:8081/api/eventos
- Obtener evento por id:
	- GET http://localhost:8081/api/eventos/{id}
- Crear evento:
	- POST http://localhost:8081/api/eventos
- Actualizar evento:
	- PUT http://localhost:8081/api/eventos/{id}
- Enviar a validación / aprobar / rechazar (acciones semánticas):
	- POST http://localhost:8081/api/eventos/{id}/enviar-validacion
	- POST http://localhost:8081/api/eventos/{id}/aprobar
	- POST http://localhost:8081/api/eventos/{id}/rechazar

Usa Postman o curl para probar los endpoints directamente si lo prefieres.

## Seguridad y configuración

- El backend usa JWT para autenticación; las claves y tiempo de expiración están en `application.properties` (recomiendo externalizarlas con variables de entorno en producción).
- El backend también tiene configuración SMTP para enviar correos (credenciales en `application.properties` en este repo - cámbialas o usa variables de entorno).

## Desarrollo y pruebas

- Frontend: el proyecto usa Angular 20. Usa `npm start` para desarrollo y `npm run build` para producción.
- Backend: usa Spring Boot 3.5 (Java 21). Ejecuta `mvnw.cmd spring-boot:run` o empaqueta con `mvnw.cmd package`.

## Consejos y resolución de problemas

- Error de conexión a la base de datos: revisa que PostgreSQL esté corriendo, que la base de datos exista y que las credenciales coincidan.
- CORS / llamadas desde el frontend: si recibes errores CORS, asegúrate de que el backend permita peticiones desde `http://localhost:4200`. El backend puede configurarse para permitir orígenes específicos.
- Problemas con dependencias de Node: elimina `node_modules` y vuelve a ejecutar `npm install` si hay errores raros.

## Contribuir

1. Haz fork del repositorio.
2. Crea una rama feature/bugfix.
3. Abre un pull request con una descripción clara de los cambios.

## Contacto

Si necesitas ayuda con la ejecución local, pega aquí el error que obtengas en la terminal y te guío en los pasos para resolverlo.

