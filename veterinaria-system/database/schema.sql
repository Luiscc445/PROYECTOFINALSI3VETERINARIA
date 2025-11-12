-- ============================================
-- SCHEMA SQL - SISTEMA DE GESTIÓN VETERINARIA
-- Base de datos PostgreSQL
-- ============================================

-- Eliminar tablas si existen (en orden inverso por dependencias)
DROP TABLE IF EXISTS api_movimientoinventario CASCADE;
DROP TABLE IF EXISTS api_inventario CASCADE;
DROP TABLE IF EXISTS api_historialmedico CASCADE;
DROP TABLE IF EXISTS api_cita CASCADE;
DROP TABLE IF EXISTS api_mascota CASCADE;
DROP TABLE IF EXISTS api_tutor CASCADE;
DROP TABLE IF EXISTS api_usuario CASCADE;
DROP TABLE IF EXISTS api_rol CASCADE;

-- ============================================
-- TABLA 1: api_rol
-- ============================================
CREATE TABLE api_rol (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nombre_rol_check CHECK (nombre IN ('administrador', 'veterinario', 'tutor'))
);

-- ============================================
-- TABLA 2: api_usuario
-- ============================================
CREATE TABLE api_usuario (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    rol_id BIGINT NOT NULL REFERENCES api_rol(id) ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 3: api_tutor
-- ============================================
CREATE TABLE api_tutor (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT UNIQUE NOT NULL REFERENCES api_usuario(id) ON DELETE CASCADE,
    ci VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 4: api_mascota
-- ============================================
CREATE TABLE api_mascota (
    id BIGSERIAL PRIMARY KEY,
    tutor_id BIGINT NOT NULL REFERENCES api_tutor(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('Macho', 'Hembra')),
    color VARCHAR(50) NOT NULL,
    peso_kg DECIMAL(6,2) NOT NULL CHECK (peso_kg > 0),
    foto_url VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 5: api_cita
-- ============================================
CREATE TABLE api_cita (
    id BIGSERIAL PRIMARY KEY,
    mascota_id BIGINT NOT NULL REFERENCES api_mascota(id) ON DELETE CASCADE,
    veterinario_id BIGINT NOT NULL REFERENCES api_usuario(id) ON DELETE RESTRICT,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 6: api_historialmedico
-- ============================================
CREATE TABLE api_historialmedico (
    id BIGSERIAL PRIMARY KEY,
    mascota_id BIGINT NOT NULL REFERENCES api_mascota(id) ON DELETE CASCADE,
    veterinario_id BIGINT NOT NULL REFERENCES api_usuario(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('consulta', 'vacunacion', 'cirugia', 'emergencia')),
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    medicamentos TEXT,
    peso_kg DECIMAL(6,2) CHECK (peso_kg > 0),
    temperatura_c DECIMAL(4,1),
    observaciones TEXT,
    proxima_visita DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 7: api_inventario
-- ============================================
CREATE TABLE api_inventario (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('medicamento', 'alimento', 'accesorio', 'equipamiento')),
    descripcion TEXT,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    unidad_medida VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    stock_minimo INTEGER NOT NULL CHECK (stock_minimo >= 0),
    fecha_vencimiento DATE,
    proveedor VARCHAR(200),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA 8: api_movimientoinventario
-- ============================================
CREATE TABLE api_movimientoinventario (
    id BIGSERIAL PRIMARY KEY,
    inventario_id BIGINT NOT NULL REFERENCES api_inventario(id) ON DELETE CASCADE,
    usuario_id BIGINT NOT NULL REFERENCES api_usuario(id) ON DELETE RESTRICT,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
    cantidad INTEGER NOT NULL,
    motivo TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================
CREATE INDEX idx_usuario_rol ON api_usuario(rol_id);
CREATE INDEX idx_usuario_email ON api_usuario(email);
CREATE INDEX idx_tutor_usuario ON api_tutor(usuario_id);
CREATE INDEX idx_tutor_ci ON api_tutor(ci);
CREATE INDEX idx_mascota_tutor ON api_mascota(tutor_id);
CREATE INDEX idx_cita_mascota ON api_cita(mascota_id);
CREATE INDEX idx_cita_veterinario ON api_cita(veterinario_id);
CREATE INDEX idx_cita_fecha ON api_cita(fecha_hora);
CREATE INDEX idx_historial_mascota ON api_historialmedico(mascota_id);
CREATE INDEX idx_inventario_codigo ON api_inventario(codigo);
CREATE INDEX idx_movimiento_inventario ON api_movimientoinventario(inventario_id);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- ROLES
INSERT INTO api_rol (nombre, descripcion) VALUES
('administrador', 'Administrador del sistema con acceso completo'),
('veterinario', 'Profesional veterinario que atiende mascotas'),
('tutor', 'Dueño o tutor de mascotas');

-- USUARIOS
-- Nota: En producción, los passwords deben estar hasheados
INSERT INTO api_usuario (email, password_hash, nombre_completo, telefono, rol_id, activo) VALUES
('admin@veterinaria.com', 'pbkdf2_sha256$600000$placeholder', 'Admin Sistema', '77123456', 1, TRUE),
('vet1@veterinaria.com', 'pbkdf2_sha256$600000$placeholder', 'Dr. Carlos Méndez', '77234567', 2, TRUE),
('vet2@veterinaria.com', 'pbkdf2_sha256$600000$placeholder', 'Dra. María López', '77345678', 2, TRUE),
('tutor1@gmail.com', 'pbkdf2_sha256$600000$placeholder', 'Juan Pérez', '77456789', 3, TRUE),
('tutor2@gmail.com', 'pbkdf2_sha256$600000$placeholder', 'Ana García', '77567890', 3, TRUE);

-- TUTORES
INSERT INTO api_tutor (usuario_id, ci, direccion, fecha_nacimiento) VALUES
(4, '1234567 LP', 'Av. 6 de Agosto #2500, La Paz', '1985-05-15'),
(5, '7654321 LP', 'Calle Comercio #1234, La Paz', '1990-08-22');

-- MASCOTAS
INSERT INTO api_mascota (tutor_id, nombre, especie, raza, fecha_nacimiento, sexo, color, peso_kg, activo) VALUES
(1, 'Rocky', 'Perro', 'Labrador', '2020-03-10', 'Macho', 'Dorado', 28.50, TRUE),
(1, 'Luna', 'Gato', 'Siamés', '2021-07-22', 'Hembra', 'Crema', 4.20, TRUE),
(2, 'Max', 'Perro', 'Pastor Alemán', '2019-11-05', 'Macho', 'Negro y Marrón', 35.00, TRUE),
(2, 'Bella', 'Gato', 'Persa', '2022-02-14', 'Hembra', 'Blanco', 3.80, TRUE);

-- CITAS
INSERT INTO api_cita (mascota_id, veterinario_id, fecha_hora, motivo, estado, observaciones) VALUES
(1, 2, CURRENT_TIMESTAMP + INTERVAL '2 days', 'Control de rutina y vacunación', 'pendiente', 'Primera cita del mes'),
(2, 2, CURRENT_TIMESTAMP + INTERVAL '3 days', 'Revisión general', 'confirmada', 'Dueño confirmó asistencia'),
(3, 3, CURRENT_TIMESTAMP + INTERVAL '1 day', 'Consulta por cojera', 'pendiente', 'Urgente'),
(4, 3, CURRENT_TIMESTAMP + INTERVAL '5 days', 'Vacunación antirrábica', 'pendiente', NULL);

-- HISTORIAL MÉDICO
INSERT INTO api_historialmedico (mascota_id, veterinario_id, fecha, tipo, diagnostico, tratamiento, medicamentos, peso_kg, temperatura_c, observaciones, proxima_visita) VALUES
(1, 2, CURRENT_DATE - INTERVAL '30 days', 'consulta', 'Mascota en buen estado de salud', 'Mantener dieta balanceada y ejercicio regular', 'Desparasitante interno', 27.80, 38.5, 'Se recomienda control en 3 meses', CURRENT_DATE + INTERVAL '60 days'),
(2, 2, CURRENT_DATE - INTERVAL '45 days', 'vacunacion', 'Vacunación triple felina', 'Observación por 24 horas post-vacuna', 'Vacuna triple felina', 4.10, 38.2, 'Sin reacciones adversas', CURRENT_DATE + INTERVAL '335 days'),
(3, 3, CURRENT_DATE - INTERVAL '20 days', 'emergencia', 'Ingestión de objeto extraño', 'Cirugía de emergencia exitosa', 'Antibióticos (Amoxicilina) y analgésicos', 34.50, 39.1, 'Recuperación satisfactoria', CURRENT_DATE + INTERVAL '10 days'),
(1, 2, CURRENT_DATE - INTERVAL '90 days', 'vacunacion', 'Vacunación antirrábica y séxtuple canina', 'Reposo relativo por 24 horas', 'Vacuna antirrábica, Vacuna séxtuple', 26.50, 38.3, 'Mascota respondió bien', CURRENT_DATE + INTERVAL '275 days');

-- INVENTARIO
INSERT INTO api_inventario (codigo, nombre, categoria, descripcion, cantidad, unidad_medida, precio_unitario, stock_minimo, fecha_vencimiento, proveedor, activo) VALUES
('MED-001', 'Amoxicilina 500mg', 'medicamento', 'Antibiótico de amplio espectro', 50, 'unidades', 15.50, 20, CURRENT_DATE + INTERVAL '18 months', 'Farmacia Veterinaria Central', TRUE),
('MED-002', 'Vacuna Antirrábica', 'medicamento', 'Vacuna contra la rabia', 30, 'dosis', 45.00, 15, CURRENT_DATE + INTERVAL '12 months', 'Laboratorios VetPro', TRUE),
('MED-003', 'Vacuna Séxtuple Canina', 'medicamento', 'Protección contra 6 enfermedades', 25, 'dosis', 85.00, 10, CURRENT_DATE + INTERVAL '12 months', 'Laboratorios VetPro', TRUE),
('ALI-001', 'Alimento Premium Perro Adulto', 'alimento', 'Alimento balanceado para perros adultos', 25, 'kg', 180.00, 50, NULL, 'Nutrición Animal S.A.', TRUE),
('ALI-002', 'Alimento Premium Gato', 'alimento', 'Alimento balanceado para gatos', 20, 'kg', 195.00, 30, NULL, 'Nutrición Animal S.A.', TRUE),
('ACC-001', 'Collar Antipulgas', 'accesorio', 'Collar con protección de 8 meses', 40, 'unidades', 65.00, 15, NULL, 'Accesorios Pet Shop', TRUE),
('ACC-002', 'Placa de Identificación', 'accesorio', 'Placa metálica personalizable', 100, 'unidades', 25.00, 30, NULL, 'Accesorios Pet Shop', TRUE),
('EQU-001', 'Estetoscopio Veterinario', 'equipamiento', 'Estetoscopio profesional', 5, 'unidades', 450.00, 2, NULL, 'Equipamiento Médico Bolivia', TRUE);

-- MOVIMIENTOS DE INVENTARIO
INSERT INTO api_movimientoinventario (inventario_id, usuario_id, tipo_movimiento, cantidad, motivo, fecha) VALUES
(1, 1, 'entrada', 50, 'Compra inicial de stock', CURRENT_TIMESTAMP - INTERVAL '60 days'),
(2, 1, 'entrada', 50, 'Compra de vacunas', CURRENT_TIMESTAMP - INTERVAL '55 days'),
(2, 2, 'salida', 20, 'Vacunación de pacientes', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(4, 1, 'entrada', 100, 'Reposición de alimento', CURRENT_TIMESTAMP - INTERVAL '45 days'),
(4, 2, 'salida', 75, 'Venta a clientes', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(6, 1, 'entrada', 50, 'Compra de accesorios', CURRENT_TIMESTAMP - INTERVAL '40 days'),
(6, 2, 'salida', 10, 'Venta a clientes', CURRENT_TIMESTAMP - INTERVAL '15 days');

-- ============================================
-- COMENTARIOS FINALES
-- ============================================
-- Este schema incluye:
-- ✓ 8 tablas principales con relaciones FK
-- ✓ Constraints y checks de validación
-- ✓ Índices para optimizar consultas
-- ✓ 5 usuarios (1 admin, 2 vets, 2 tutores)
-- ✓ 2 tutores con información completa
-- ✓ 4 mascotas
-- ✓ 4 citas programadas
-- ✓ 4 registros de historial médico
-- ✓ 8 productos en inventario
-- ✓ 7 movimientos de inventario

-- Para conectar con Supabase:
-- 1. Crear nuevo proyecto en Supabase
-- 2. Copiar DATABASE_URL de Settings > Database
-- 3. Ejecutar este script en el SQL Editor de Supabase
-- 4. Configurar .env del backend con la DATABASE_URL
