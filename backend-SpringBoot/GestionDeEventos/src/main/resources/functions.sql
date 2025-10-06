-- =======================
--  FUNCIONES Y TRIGGERS
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
  v_id_usuario BIGINT;
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

-- 4) Triggers para múltiples organizadores
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

-- 5) Funciones para obtener organizadores y avales
CREATE OR REPLACE FUNCTION get_evento_organizadores(p_id_evento BIGINT)
RETURNS TABLE(
  id_usuario BIGINT,
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

CREATE OR REPLACE FUNCTION get_evento_avales(p_id_evento BIGINT)
RETURNS TABLE(
  id_aval BIGINT,
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

-- 6) Vista para compatibilidad hacia atrás
CREATE OR REPLACE VIEW evento_principal AS
SELECT 
  e.id_evento,
  e.titulo,
  e.tipo_evento,
  e.fecha,
  e.hora_inicio,
  e.hora_fin,
  eo.id_usuario as id_usuario_organizador
FROM evento e
LEFT JOIN evento_organizador eo ON e.id_evento = eo.id_evento AND eo.rol_organizador = 'Organizador Principal';

-- 7) Comentarios para documentación
COMMENT ON TABLE evento_organizador IS 'Relación many-to-many entre eventos y organizadores';
COMMENT ON TABLE evento_aval IS 'Múltiples avales por evento';
COMMENT ON FUNCTION get_evento_organizadores IS 'Obtiene todos los organizadores de un evento';
COMMENT ON FUNCTION get_evento_avales IS 'Obtiene todos los avales activos de un evento';
