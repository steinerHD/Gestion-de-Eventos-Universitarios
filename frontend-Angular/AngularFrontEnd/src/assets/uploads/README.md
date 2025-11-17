# Sistema de Archivos de Avales y Actas

Este directorio contiene los archivos de aval y actas de evaluación de eventos.

## Estructura de Directorios

- `avales/` - Archivos PDF de avales de organizaciones
- `actas/` - Archivos PDF de actas de evaluación de eventos

## Formato de Archivos

### Avales
Los archivos se guardan con el siguiente formato:
- `org_{idOrganizacion}_{timestamp}.pdf`

Ejemplo:
- `org_1_1703123456789.pdf`
- `org_2_1703123456790.pdf`

### Actas
Los archivos se guardan con el siguiente formato:
- `acta_{idEvento}_{timestamp}.pdf`

## Uso en el Proyecto

1. **Selección de archivo**: El usuario selecciona un archivo PDF desde la interfaz
2. **Generación de ruta**: Se genera automáticamente una ruta única para el archivo
3. **Almacenamiento**: El archivo se guarda localmente en este directorio
4. **Base de datos**: Solo se guarda la ruta del archivo en la base de datos

## Configuración Portable

Las rutas están configuradas como **rutas relativas** en `application.properties`:
```properties
aval.upload.path=../../frontend-Angular/AngularFrontEnd/src/assets/uploads/avales
acta.upload.path=../../frontend-Angular/AngularFrontEnd/src/assets/uploads/actas
```

Esto permite que el proyecto funcione en **cualquier computador** sin necesidad de cambiar configuraciones.

## Git Ignore

Los archivos subidos (avales y actas) están **ignorados por git** para:
- ✅ No subir archivos sensibles al repositorio
- ✅ Mantener el repositorio limpio
- ✅ Evitar conflictos entre diferentes entornos

Solo se mantienen los archivos `.gitkeep` para preservar la estructura de carpetas.

## Ventajas para Proyecto de Prueba

- ✅ No sobrecarga la base de datos con archivos binarios
- ✅ Fácil de gestionar y limpiar
- ✅ Permite pruebas rápidas sin configuración compleja
- ✅ Los archivos se mantienen organizados por tipo
- ✅ Portable entre diferentes computadores

## Nota

Este es un sistema simplificado para proyectos de prueba. En un entorno de producción, se recomendaría usar un servicio de almacenamiento en la nube como AWS S3, Google Cloud Storage, o Azure Blob Storage.
