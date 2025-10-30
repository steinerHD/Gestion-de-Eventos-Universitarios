# Sistema de Archivos de Avales

Este directorio contiene los archivos de aval de las organizaciones externas.

## Estructura de Archivos

Los archivos se guardan con el siguiente formato:
- `org_{idOrganizacion}_{timestamp}.pdf`

Ejemplo:
- `org_1_1703123456789.pdf`
- `org_2_1703123456790.pdf`

## Uso en el Proyecto

1. **Selección de archivo**: El usuario selecciona un archivo PDF desde la interfaz
2. **Generación de ruta**: Se genera automáticamente una ruta única para el archivo
3. **Almacenamiento**: El archivo se guarda localmente en este directorio
4. **Base de datos**: Solo se guarda la ruta del archivo en la base de datos

## Ventajas para Proyecto de Prueba

- ✅ No sobrecarga la base de datos con archivos binarios
- ✅ Fácil de gestionar y limpiar
- ✅ Permite pruebas rápidas sin configuración compleja
- ✅ Los archivos se mantienen organizados por organización

## Nota

Este es un sistema simplificado para proyectos de prueba. En un entorno de producción, se recomendaría usar un servicio de almacenamiento en la nube como AWS S3, Google Cloud Storage, o Azure Blob Storage.
