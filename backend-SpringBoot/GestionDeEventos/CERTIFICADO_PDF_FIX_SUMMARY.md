# Fix for certificado_pdf BYTEA Error

## Problem
The application was throwing the error:
```
ERROR: la columna «certificado_pdf» es de tipo bytea pero la expresión es de tipo bigint
```

This occurred when trying to create a `participacion_organizacion` with a PDF certificate.

## Root Cause
The issue was caused by a mismatch between:
1. **Frontend**: Sending base64 string for `certificadoPdf`
2. **Backend Entity**: Expecting `byte[]` array for database storage
3. **Database**: Column defined as `BYTEA` but receiving wrong data type

## Solution Implemented

### 1. Created DTO for Base64 to Byte Array Conversion
**File**: `src/main/java/com/Geventos/GestionDeEventos/dto/ParticipacionOrganizacionCreateDTO.java`

- Accepts base64 string from frontend
- Converts base64 to byte array using `Base64.getDecoder().decode()`
- Provides validation for required fields
- Handles conversion errors gracefully

### 2. Updated Controller to Use DTO
**File**: `src/main/java/com/Geventos/GestionDeEventos/controller/ParticipacionOrganizacionController.java`

- Changed `@RequestBody` parameter from `ParticipacionOrganizacion` to `ParticipacionOrganizacionCreateDTO`
- Uses DTO's `toEntity()` method for conversion
- Maintains same API contract

### 3. Enhanced Entity Mapping
**File**: `src/main/java/com/Geventos/GestionDeEventos/entity/ParticipacionOrganizacion.java`

- Added `@JdbcTypeCode(SqlTypes.BINARY)` annotation (same as working `Evento.avalPdf`)
- Maintains `@Lob` and `columnDefinition = "bytea"`
- Ensures proper Hibernate mapping for PostgreSQL BYTEA

### 4. Database Schema Fix
**File**: `fix-participacion-organizacion-schema.sql`

- Ensures `certificado_pdf` column is properly defined as `BYTEA`
- Handles cases where column might be wrong type
- Provides verification queries

## How It Works Now

### Frontend → Backend Flow:
```typescript
// Frontend sends:
{
  idEvento: 1,
  idOrganizacion: 2,
  certificadoPdf: "JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoK..." // base64 string
}
```

### Backend Processing:
```java
// DTO receives base64 string
ParticipacionOrganizacionCreateDTO dto = // from JSON

// DTO converts to entity with byte array
ParticipacionOrganizacion entity = dto.toEntity();
// entity.certificadoPdf is now byte[] array

// Entity mapping ensures proper BYTEA storage
@JdbcTypeCode(SqlTypes.BINARY)
private byte[] certificadoPdf;
```

### Database Storage:
- Column: `certificado_pdf BYTEA NOT NULL`
- Data: Binary PDF data (not base64 string)
- Type: Properly mapped as PostgreSQL BYTEA

## Testing

### Unit Tests
**File**: `src/test/java/com/Geventos/GestionDeEventos/dto/ParticipacionOrganizacionCreateDTOTest.java`

- Tests valid base64 conversion
- Tests empty/null base64 handling
- Tests invalid base64 format handling

### Manual Testing
1. Start backend server
2. Create event with external organization participation
3. Upload PDF certificate
4. Verify no database errors
5. Verify PDF is stored as binary data

## Files Modified

1. `ParticipacionOrganizacionCreateDTO.java` (NEW)
2. `ParticipacionOrganizacionController.java` (MODIFIED)
3. `ParticipacionOrganizacion.java` (MODIFIED)
4. `ParticipacionOrganizacionCreateDTOTest.java` (NEW)
5. `fix-participacion-organizacion-schema.sql` (NEW)

## Database Schema Requirements

Ensure your database has:
```sql
CREATE TABLE participacion_organizacion (
  id_evento INT NOT NULL,
  id_organizacion INT NOT NULL,
  certificado_pdf BYTEA NOT NULL,  -- Must be BYTEA, not bigint
  representante_diferente BOOLEAN DEFAULT FALSE,
  nombre_representante_diferente VARCHAR(150),
  PRIMARY KEY (id_evento, id_organizacion),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento),
  FOREIGN KEY (id_organizacion) REFERENCES organizacion_externa(id_organizacion)
);
```

## Verification

To verify the fix works:
1. Check that no more `bigint` vs `bytea` errors occur
2. Verify PDF certificates are stored as binary data
3. Confirm frontend can still send base64 strings
4. Test that PDFs can be retrieved and displayed

