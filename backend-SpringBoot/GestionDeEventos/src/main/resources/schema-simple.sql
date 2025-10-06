-- =======================
--  ESQUEMA SIGEU SIMPLIFICADO
-- =======================

-- Desactivar las restricciones de clave foránea temporalmente para evitar errores
SET session_replication_role = 'replica';

-- Tablas principales
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS estudiante (
  id_estudiante BIGSERIAL PRIMARY KEY,
  codigo_estudiantil VARCHAR(20) UNIQUE NOT NULL,
  programa VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_estudiante) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS docente (
  id_docente BIGSERIAL PRIMARY KEY,
  unidad_academica VARCHAR(100) NOT NULL,
  cargo VARCHAR(50),
  FOREIGN KEY (id_docente) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS secretaria_academica (
  id_secretaria BIGSERIAL PRIMARY KEY,
  facultad VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_secretaria) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instalacion (
  id_instalacion BIGSERIAL PRIMARY KEY,
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
  id_evento BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  tipo_evento VARCHAR(20) NOT NULL CHECK (tipo_evento IN ('Académico','Lúdico')),
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  horainicio TIME NOT NULL,
  horafin TIME NOT NULL,
  id_usuario_organizador BIGINT,
  aval_pdf BYTEA,
  tipo_aval VARCHAR(50) CHECK (tipo_aval IN ('Director Programa','Director Docencia')),
  FOREIGN KEY (id_usuario_organizador) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Tabla para almacenar los avales de eventos
CREATE TABLE IF NOT EXISTS evento_aval (
  id_aval BIGSERIAL PRIMARY KEY,
  id_evento BIGINT NOT NULL,
  aval_pdf BYTEA,
  tipo_aval VARCHAR(50) NOT NULL CHECK (tipo_aval IN ('Director Programa','Director Docencia')),
  nombre_aval VARCHAR(150),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE
);

-- Tabla de unión M:N entre evento e instalacion
CREATE TABLE IF NOT EXISTS evento_instalacion (
  id_evento BIGINT NOT NULL,
  id_instalacion BIGINT NOT NULL,
  PRIMARY KEY (id_evento, id_instalacion),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE,
  FOREIGN KEY (id_instalacion) REFERENCES instalacion(id_instalacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS organizacion_externa (
  id_organizacion BIGSERIAL PRIMARY KEY,
  nit INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  representante_legal VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  ubicacion VARCHAR(200) NOT NULL,
  sector_economico VARCHAR(100) NOT NULL,
  actividad_principal VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS participacion_organizacion (
  id_evento BIGINT NOT NULL,
  id_organizacion BIGINT NOT NULL,
  certificado_pdf BYTEA NOT NULL,
  representante_diferente BOOLEAN DEFAULT FALSE,
  nombre_representante_diferente VARCHAR(150),
  PRIMARY KEY (id_evento, id_organizacion),
  FOREIGN KEY (id_evento) REFERENCES evento(id_evento),
  FOREIGN KEY (id_organizacion) REFERENCES organizacion_externa(id_organizacion)
);

CREATE TABLE IF NOT EXISTS evaluacion (
  id_evaluacion BIGSERIAL PRIMARY KEY,
  id_evento BIGINT NOT NULL REFERENCES evento(id_evento),
  id_secretaria BIGINT NOT NULL REFERENCES secretaria_academica(id_secretaria),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('Aprobado','Rechazado','Pendiente')),
  fecha DATE NOT NULL,
  justificacion TEXT,
  acta_pdf BYTEA
);

CREATE TABLE IF NOT EXISTS notificacion (
  id_notificacion BIGSERIAL PRIMARY KEY,
  id_evaluacion BIGINT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_evaluacion) REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE
);

-- Tabla para múltiples organizadores por evento
CREATE TABLE IF NOT EXISTS evento_organizador (
  id_evento BIGINT NOT NULL REFERENCES evento(id_evento) ON DELETE CASCADE,
  id_usuario BIGINT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  rol_organizador VARCHAR(50) NOT NULL DEFAULT 'Organizador Principal',
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evento, id_usuario),
  CONSTRAINT fk_evento_organizador_evento FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE,
  CONSTRAINT fk_evento_organizador_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Reactivar las restricciones de clave foránea
SET session_replication_role = 'origin';
