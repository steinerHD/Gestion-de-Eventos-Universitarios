-- =======================
--  ESQUEMA SIGEU 
-- =======================

-- Desactivar las restricciones de clave foránea temporalmente para evitar errores
SET session_replication_role = 'replica';

-- Tablas principales
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS estudiante (
  id_estudiante SERIAL PRIMARY KEY,
  codigo_estudiantil VARCHAR(20) UNIQUE NOT NULL,
  programa VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_estudiante) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS docente (
  id_docente SERIAL PRIMARY KEY,
  unidad_academica VARCHAR(100) NOT NULL,
  cargo VARCHAR(50),
  FOREIGN KEY (id_docente) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS secretaria_academica (
  id_secretaria SERIAL PRIMARY KEY,
  facultad VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_secretaria) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instalacion (
  id_instalacion SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  capacidad INT NOT NULL
);

INSERT INTO instalacion (nombre, tipo, ubicacion, capacidad) VALUES
('Salon 111', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 1', 25),
('Salon 112', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 2', 25),
('Salon 113', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 3', 25),
('Salon 114', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 4', 25),
('Salon 115', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 5', 25),
('Salon 116', 'Salon de clases', 'El edificio numero 1 en el piso 1 en el salon de clases 6', 25),
('Salon 121', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 1', 25),
('Salon 122', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 2', 25),
('Salon 123', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 3', 25),
('Salon 124', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 4', 25),
('Salon 125', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 5', 25),
('Salon 126', 'Salon de clases', 'El edificio numero 1 en el piso 2 en el salon de clases 6', 25),
('Salon 131', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 1', 25),
('Salon 132', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 2', 25),
('Salon 133', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 3', 25),
('Salon 134', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 4', 25),
('Salon 135', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 5', 25),
('Salon 136', 'Salon de clases', 'El edificio numero 1 en el piso 3 en el salon de clases 6', 25),
('Salon 141', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 1', 25),
('Salon 142', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 2', 25),
('Salon 143', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 3', 25),
('Salon 144', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 4', 25),
('Salon 145', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 5', 25),
('Salon 146', 'Salon de clases', 'El edificio numero 1 en el piso 4 en el salon de clases 6', 25),
('Salon 211', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 1', 25),
('Salon 212', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 2', 25),
('Salon 213', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 3', 25),
('Salon 214', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 4', 25),
('Salon 215', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 5', 25),
('Salon 216', 'Salon de clases', 'El edificio numero 2 en el piso 1 en el salon de clases 6', 25),
('Salon 221', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 1', 25),
('Salon 222', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 2', 25),
('Salon 223', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 3', 25),
('Salon 224', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 4', 25),
('Salon 225', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 5', 25),
('Salon 226', 'Salon de clases', 'El edificio numero 2 en el piso 2 en el salon de clases 6', 25),
('Salon 231', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 1', 25),
('Salon 232', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 2', 25),
('Salon 233', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 3', 25),
('Salon 234', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 4', 25),
('Salon 235', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 5', 25),
('Salon 236', 'Salon de clases', 'El edificio numero 2 en el piso 3 en el salon de clases 6', 25),
('Salon 241', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 1', 25),
('Salon 242', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 2', 25),
('Salon 243', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 3', 25),
('Salon 244', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 4', 25),
('Salon 245', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 5', 25),
('Salon 246', 'Salon de clases', 'El edificio numero 2 en el piso 4 en el salon de clases 6', 25),
('Salon 311', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 1', 25),
('Salon 312', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 2', 25),
('Salon 313', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 3', 25),
('Salon 314', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 4', 25),
('Salon 315', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 5', 25),
('Salon 316', 'Salon de clases', 'El edificio numero 3 en el piso 1 en el salon de clases 6', 25),
('Salon 321', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 1', 25),
('Salon 322', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 2', 25),
('Salon 323', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 3', 25),
('Salon 324', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 4', 25),
('Salon 325', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 5', 25),
('Salon 326', 'Salon de clases', 'El edificio numero 3 en el piso 2 en el salon de clases 6', 25),
('Salon 331', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 1', 25),
('Salon 332', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 2', 25),
('Salon 333', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 3', 25),
('Salon 334', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 4', 25),
('Salon 335', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 5', 25),
('Salon 336', 'Salon de clases', 'El edificio numero 3 en el piso 3 en el salon de clases 6', 25),
('Salon 341', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 1', 25),
('Salon 342', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 2', 25),
('Salon 343', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 3', 25),
('Salon 344', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 4', 25),
('Salon 345', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 5', 25),
('Salon 346', 'Salon de clases', 'El edificio numero 3 en el piso 4 en el salon de clases 6', 25),
('Salon 411', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 1', 25),
('Salon 412', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 2', 25),
('Salon 413', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 3', 25),
('Salon 414', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 4', 25),
('Salon 415', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 5', 25),
('Salon 416', 'Salon de clases', 'El edificio numero 4 en el piso 1 en el salon de clases 6', 25),
('Salon 421', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 1', 25),
('Salon 422', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 2', 25),
('Salon 423', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 3', 25),
('Salon 424', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 4', 25),
('Salon 425', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 5', 25),
('Salon 426', 'Salon de clases', 'El edificio numero 4 en el piso 2 en el salon de clases 6', 25),
('Salon 431', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 1', 25),
('Salon 432', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 2', 25),
('Salon 433', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 3', 25),
('Salon 434', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 4', 25),
('Salon 435', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 5', 25),
('Salon 436', 'Salon de clases', 'El edificio numero 4 en el piso 3 en el salon de clases 6', 25),
('Salon 441', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 1', 25),
('Salon 442', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 2', 25),
('Salon 443', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 3', 25),
('Salon 444', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 4', 25),
('Salon 445', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 5', 25),
('Salon 446', 'Salon de clases', 'El edificio numero 4 en el piso 4 en el salon de clases 6', 25),
('Auditorio Indigo', 'Auditorio', 'Bloque 1 (junto a la cafeteria principal del primer piso)', 110),
('Auditorio Magenta', 'Auditorio', 'Bloque 1 (subiendo las escaleras del ala este en el segundo piso)', 85),
('Auditorio Verde', 'Auditorio', 'Bloque 1 (al fondo del pasillo central del primer piso)', 98),
('Auditorio Magenta', 'Auditorio', 'Bloque 2 (en el primer piso, acceso por el patio interior)', 115),
('Auditorio Purpura', 'Auditorio', 'Bloque 2 (al lado oeste del piso 2)', 77),
('Auditorio Cyan', 'Auditorio', 'Bloque 2 (frente a los ascensores del segundo piso)', 105),
('Biblioteca Central', 'Biblioteca', 'Bloque 1 en el piso 1 al lado norte', 50);

CREATE TABLE IF NOT EXISTS evento (
  id_evento SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  tipo_evento VARCHAR(20) NOT NULL CHECK (tipo_evento IN ('Académico','Lúdico')),
  fecha DATE NOT NULL,
  horaInicio TIME NOT NULL,
  horaFin TIME NOT NULL,
  id_usuario_organizador INT,
  FOREIGN KEY (id_usuario_organizador) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla para almacenar los avales de eventos
CREATE TABLE IF NOT EXISTS evento_aval (
  id_aval SERIAL PRIMARY KEY,
  id_evento INT NOT NULL,
  aval_pdf BYTEA,
  tipo_aval VARCHAR(50) NOT NULL CHECK (tipo_aval IN ('Director Programa','Director Docencia')),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE
);

-- Tabla de unión M:N entre evento e instalacion
CREATE TABLE IF NOT EXISTS evento_instalacion (
  id_evento INT NOT NULL,
  id_instalacion INT NOT NULL,
  PRIMARY KEY (id_evento, id_instalacion),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE,
  FOREIGN KEY (id_instalacion) REFERENCES instalacion(id_instalacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS organizacion_externa (
  id_organizacion SERIAL PRIMARY KEY,
  nit INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  representante_legal VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  sector_economico VARCHAR(100) NOT NULL,
  actividad_principal VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS participacion_organizacion (
  id_evento INT NOT NULL,
  id_organizacion INT NOT NULL,
  certificado_pdf BYTEA NOT NULL,
  representante_diferente BOOLEAN DEFAULT FALSE,
  nombre_representante_diferente VARCHAR(150),
  PRIMARY KEY (id_evento, id_organizacion),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento),
  FOREIGN KEY (id_organizacion) REFERENCES organizacion_externa(id_organizacion)
);

CREATE TABLE IF NOT EXISTS evaluacion (
  id_evaluacion SERIAL PRIMARY KEY,
  id_evento INT NOT NULL REFERENCES evento(id_evento),
  id_secretaria INT NOT NULL REFERENCES secretaria_academica(id_secretaria),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('Aprobado','Rechazado','Pendiente')),
  fecha DATE NOT NULL,
  justificacion TEXT,
  acta_pdf BYTEA
);

CREATE TABLE IF NOT EXISTS notificacion (
  id_notificacion SERIAL PRIMARY KEY,
  id_evaluacion INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_evaluacion) REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE
);

-- Reactivar las restricciones de clave foránea
SET session_replication_role = 'origin';

-- =======================
--  TRIGGERS DE PERMISOS
-- =======================

-- 1) Solo estudiantes o docentes pueden organizar eventos
CREATE OR REPLACE FUNCTION validar_organizador_evento()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM estudiante WHERE id_estudiante = NEW.id_usuario_organizador)
     AND NOT EXISTS (SELECT 1 FROM docente WHERE id_docente = NEW.id_usuario_organizador) THEN
    RAISE EXCEPTION 'Solo estudiantes o docentes pueden organizar eventos';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_organizador_evento
BEFORE INSERT OR UPDATE ON evento
FOR EACH ROW
EXECUTE FUNCTION validar_organizador_evento();

-- 2) Solo secretaría académica puede registrar evaluaciones
CREATE OR REPLACE FUNCTION validar_secretaria_evaluacion()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM secretaria_academica WHERE id_secretaria = NEW.id_secretaria) THEN
    RAISE EXCEPTION 'Solo usuarios de Secretaría Académica pueden registrar evaluaciones';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_secretaria_evaluacion
BEFORE INSERT OR UPDATE ON evaluacion
FOR EACH ROW
EXECUTE FUNCTION validar_secretaria_evaluacion();

-- 3) Al insertar evaluación, crear notificación automática al organizador
CREATE OR REPLACE FUNCTION crear_notificacion_evaluacion()
RETURNS TRIGGER AS $$
DECLARE
  v_id_usuario INT;
  v_estado TEXT;
BEGIN
  SELECT id_usuario_organizador INTO v_id_usuario FROM evento WHERE id_evento = NEW.id_evento;
  v_estado := NEW.estado;
  INSERT INTO notificacion (id_evaluacion, mensaje)
  VALUES (NEW.id_evaluacion,
          'El evento ha sido ' || v_estado || ' por la Secretaría Académica.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crear_notificacion_evaluacion
AFTER INSERT ON evaluacion
FOR EACH ROW
EXECUTE FUNCTION crear_notificacion_evaluacion();

-- =======================
--  SCHEMA UPDATES FOR MULTIPLE ORGANIZERS AND AVALS
-- =======================

-- 1. Create table for multiple organizers per event
CREATE TABLE IF NOT EXISTS evento_organizador (
  id_evento INT NOT NULL REFERENCES evento(id_evento) ON DELETE CASCADE,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  rol_organizador VARCHAR(50) NOT NULL DEFAULT 'Organizador Principal',
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evento, id_usuario),
  CONSTRAINT fk_evento_organizador_evento FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE,
  CONSTRAINT fk_evento_organizador_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 2. Actualizar la tabla evento_aval existente en lugar de crearla nuevamente
-- La tabla ya fue creada anteriormente en el script

-- 3. Verificar si las columnas existen antes de modificarlas
DO $$
BEGIN
  -- Verificar si la columna aval_pdf existe en la tabla evento
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'evento' AND column_name = 'aval_pdf'
  ) THEN
    -- Si existe, modificarla
    ALTER TABLE evento ALTER COLUMN aval_pdf DROP NOT NULL;
  END IF;
  
  -- Verificar si la columna tipo_aval existe en la tabla evento
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'evento' AND column_name = 'tipo_aval'
  ) THEN
    -- Si existe, modificarla
    ALTER TABLE evento ALTER COLUMN tipo_aval DROP NOT NULL;
  END IF;
END $$;

-- 4. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_evento_organizador_evento ON evento_organizador(id_evento);
CREATE INDEX IF NOT EXISTS idx_evento_organizador_usuario ON evento_organizador(id_usuario);
CREATE INDEX IF NOT EXISTS idx_evento_aval_evento ON evento_aval(id_evento);

-- 5. Migration script to move existing data
-- Move existing organizador to new table
DO $$
BEGIN
  -- Verificar si la columna id_usuario_organizador existe en la tabla evento
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'evento' AND column_name = 'id_usuario_organizador'
  ) THEN
    -- Si existe, migrar los datos
    INSERT INTO evento_organizador (id_evento, id_usuario, rol_organizador)
    SELECT id_evento, id_usuario_organizador, 'Organizador Principal'
    FROM evento 
    WHERE id_usuario_organizador IS NOT NULL
    ON CONFLICT (id_evento, id_usuario) DO NOTHING;
  END IF;
END $$;

-- No migrar datos de aval ya que la estructura ha cambiado

-- 6. Create views for backward compatibility
CREATE OR REPLACE VIEW evento_principal AS
SELECT 
  e.id_evento,
  e.titulo,
  e.tipo_evento,
  e.fecha,
  e.horaInicio,
  e.horaFin,
  eo.id_usuario as id_usuario_organizador
FROM evento e
LEFT JOIN evento_organizador eo ON e.id_evento = eo.id_evento AND eo.rol_organizador = 'Organizador Principal';

-- 7. Functions to get all organizers and avals for an event
CREATE OR REPLACE FUNCTION get_evento_organizadores(p_id_evento INT)
RETURNS TABLE(
  id_usuario INT,
  rol_organizador VARCHAR(50),
  fecha_asignacion TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT eo.id_usuario, eo.rol_organizador, eo.fecha_asignacion
  FROM evento_organizador eo
  WHERE eo.id_evento = p_id_evento
  ORDER BY eo.fecha_asignacion;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_evento_avales(p_id_evento INT)
RETURNS TABLE(
  id_aval INT,
  aval_pdf BYTEA,
  tipo_aval VARCHAR(50),
  nombre_aval VARCHAR(150),
  fecha_subida TIMESTAMP
) AS $$
BEGIN
  -- Verificar si la tabla evento_aval existe y tiene la estructura esperada
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'evento_aval'
  ) THEN
    RETURN QUERY
    SELECT 
      ea.id_aval, 
      ea.aval_pdf, 
      ea.tipo_aval, 
      COALESCE(ea.nombre_aval, 'Sin nombre') as nombre_aval,
      COALESCE(ea.fecha_subida, CURRENT_TIMESTAMP) as fecha_subida
    FROM evento_aval ea
    WHERE ea.id_evento = p_id_evento 
    ORDER BY ea.fecha_subida;
  ELSE
    -- Si la tabla no existe, devolver un conjunto vacío
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers to maintain data integrity
CREATE OR REPLACE FUNCTION validar_organizador_evento_multiple()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar que el usuario sea estudiante o docente
  IF NOT EXISTS (SELECT 1 FROM estudiante WHERE id_estudiante = NEW.id_usuario)
     AND NOT EXISTS (SELECT 1 FROM docente WHERE id_docente = NEW.id_usuario) THEN
    RAISE EXCEPTION 'Solo estudiantes o docentes pueden ser organizadores de eventos';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_organizador_evento_multiple
BEFORE INSERT OR UPDATE ON evento_organizador
FOR EACH ROW
EXECUTE FUNCTION validar_organizador_evento_multiple();

-- 9. Update existing evento table to remove the single organizer constraint
-- (Keep the column for backward compatibility but make it nullable)
-- Note: This should be done AFTER the migration to avoid data loss
ALTER TABLE evento 
ALTER COLUMN id_usuario_organizador DROP NOT NULL;

-- 10. Add comments for documentation
COMMENT ON TABLE evento_organizador IS 'Relación many-to-many entre eventos y organizadores';
COMMENT ON TABLE evento_aval IS 'Múltiples avales por evento';
COMMENT ON FUNCTION get_evento_organizadores IS 'Obtiene todos los organizadores de un evento';
COMMENT ON FUNCTION get_evento_avales IS 'Obtiene todos los avales activos de un evento';

