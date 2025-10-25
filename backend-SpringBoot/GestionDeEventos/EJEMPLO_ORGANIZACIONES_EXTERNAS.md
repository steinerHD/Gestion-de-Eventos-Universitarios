# Ejemplo de Uso: Organizaciones Externas en Eventos

## Descripción
Se ha agregado la funcionalidad para que los eventos puedan recibir y devolver las IDs de las organizaciones externas que participan en el evento.

## Cambios Realizados

### 1. DTOs Modificados
- **EventoRequest.java**: Agregado campo `organizacionesExternas` (List<Long>)
- **EventoResponse.java**: Agregado campo `organizacionesExternas` (List<Long>)

### 2. Servicio Modificado
- **EventoService.java**: 
  - Agregado manejo de organizaciones externas en `createEvento()` y `updateEvento()`
  - Nuevo método privado `manejarOrganizacionesExternas()` para gestionar las participaciones
  - Agregados repositorios necesarios: `OrganizacionExternaRepository` y `ParticipacionOrganizacionRepository`

### 3. Mapper Modificado
- **EventoMapper.java**: Agregado mapeo de organizaciones externas en `toResponse()`

### 4. Repositorio Modificado
- **ParticipacionOrganizacionRepository.java**: Agregado método `deleteByIdEvento()` con anotación `@Modifying`

## Ejemplo de Uso

### Crear Evento con Organizaciones Externas

**POST** `/api/eventos`

```json
{
  "titulo": "Conferencia de Tecnología",
  "tipoEvento": "Académico",
  "fecha": "2024-03-15",
  "horaInicio": "09:00:00",
  "horaFin": "17:00:00",
  "idOrganizador": 1,
  "instalaciones": [1, 2],
  "coorganizadores": [2, 3],
  "organizacionesExternas": [1, 2, 3],
  "avalPdf": "/uploads/eventos/aval_evento_123.pdf",
  "tipoAval": "Director_Programa",
  "estado": "Pendiente"
}
```

### Respuesta del Evento Creado

```json
{
  "idEvento": 1,
  "titulo": "Conferencia de Tecnología",
  "tipoEvento": "Académico",
  "fecha": "2024-03-15",
  "horaInicio": "09:00:00",
  "horaFin": "17:00:00",
  "idOrganizador": 1,
  "instalaciones": [1, 2],
  "coorganizadores": [2, 3],
  "organizacionesExternas": [1, 2, 3],
  "tipoAval": "Director_Programa",
  "avalPdf": "/uploads/eventos/aval_evento_123.pdf"
}
```

### Actualizar Evento con Nuevas Organizaciones

**PUT** `/api/eventos/1`

```json
{
  "titulo": "Conferencia de Tecnología Actualizada",
  "tipoEvento": "Académico",
  "fecha": "2024-03-15",
  "horaInicio": "09:00:00",
  "horaFin": "17:00:00",
  "idOrganizador": 1,
  "instalaciones": [1, 2],
  "coorganizadores": [2, 3],
  "organizacionesExternas": [1, 4, 5],
  "avalPdf": "/uploads/eventos/aval_evento_123.pdf",
  "tipoAval": "Director_Programa",
  "estado": "Pendiente"
}
```

## Comportamiento

1. **Al crear un evento**: Se crean las participaciones de organizaciones en la tabla `participacion_organizacion`
2. **Al actualizar un evento**: Se eliminan las participaciones existentes y se crean las nuevas
3. **Al consultar un evento**: Se devuelven las IDs de las organizaciones externas que participan
4. **Validación**: Se verifica que las organizaciones externas existan antes de crear las participaciones

## Notas Importantes

- El campo `organizacionesExternas` es opcional en el request
- Si se envía una lista vacía o null, no se crean participaciones
- Las participaciones se crean con `certificadoPdf` vacío inicialmente
- El campo `representanteDiferente` se establece como `false` por defecto
