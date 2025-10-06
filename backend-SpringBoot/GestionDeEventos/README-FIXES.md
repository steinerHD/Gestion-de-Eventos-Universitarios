# Correcciones del Backend Spring Boot

## Problemas Identificados y Solucionados

### 1. **Problemas de Mapeo de Base de Datos**
- **Problema**: Las entidades JPA no coincidían con el esquema de la base de datos
- **Solución**: 
  - Actualizado `schema.sql` para incluir columnas faltantes
  - Corregido mapeo de columnas en entidades (`hora_inicio` vs `horainicio`)
  - Agregadas columnas faltantes en tabla `evento_aval`

### 2. **Configuración de Entidades JPA**
- **Problema**: Columnas marcadas como `NOT NULL` en entidades pero opcionales en BD
- **Solución**: 
  - Removido `nullable = false` de campos opcionales
  - Unificado uso de enum `TipoAval` entre entidades
  - Corregido mapeo de relaciones

### 3. **Configuración de Hibernate**
- **Problema**: `ddl-auto=update` podía causar inconsistencias
- **Solución**: Cambiado a `ddl-auto=validate` para validar esquema existente

## Archivos Modificados

### `schema.sql`
```sql
-- Agregadas columnas faltantes en tabla evento
ALTER TABLE evento ADD COLUMN hora_inicio TIME NOT NULL;
ALTER TABLE evento ADD COLUMN hora_fin TIME NOT NULL;
ALTER TABLE evento ADD COLUMN aval_pdf BYTEA;
ALTER TABLE evento ADD COLUMN tipo_aval VARCHAR(50);

-- Agregadas columnas faltantes en tabla evento_aval
ALTER TABLE evento_aval ADD COLUMN nombre_aval VARCHAR(150);
ALTER TABLE evento_aval ADD COLUMN fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE evento_aval ADD COLUMN activo BOOLEAN DEFAULT TRUE;
```

### `Evento.java`
- Removido `nullable = false` de `avalPdf` y `tipoAval`
- Corregido mapeo de columnas de tiempo

### `EventoAval.java`
- Removido `nullable = false` de `avalPdf` y `tipoAval`
- Unificado uso de `Evento.TipoAval` enum
- Agregadas columnas faltantes

### `application.properties`
- Cambiado `spring.jpa.hibernate.ddl-auto=update` a `validate`

## Instrucciones de Instalación

### 1. Instalar Dependencias
```bash
# Ejecutar script de configuración de base de datos
./setup-database.sh

# Ejecutar script de configuración de aplicación
./setup.sh
```

### 2. Configuración Manual (si los scripts fallan)

#### Instalar Java 21:
```bash
sudo apt update
sudo apt install -y openjdk-21-jdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

#### Instalar PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Crear Base de Datos:
```bash
sudo -u postgres psql -c "CREATE DATABASE \"Eventos_Universitarios\";"
sudo -u postgres psql -d "Eventos_Universitarios" -f src/main/resources/schema.sql
```

#### Ejecutar Aplicación:
```bash
chmod +x mvnw
./mvnw clean compile
./mvnw spring-boot:run
```

## Configuración de Base de Datos

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: Eventos_Universitarios
- **Usuario**: postgres
- **Contraseña**: mosquera

## Verificación

1. La aplicación debería iniciar sin errores en `http://localhost:8081`
2. Los logs no deberían mostrar errores de mapeo JPA
3. La base de datos debería tener todas las tablas creadas correctamente

## Notas Importantes

- Asegúrate de que PostgreSQL esté ejecutándose antes de iniciar la aplicación
- Si hay problemas de permisos, ejecuta los scripts con `sudo`
- La aplicación usa `ddl-auto=validate`, por lo que el esquema debe existir previamente
