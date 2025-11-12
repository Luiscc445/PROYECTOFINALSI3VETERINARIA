-- ============================================
-- RESET DE USUARIOS - Solo 3 usuarios de prueba
-- ============================================

-- Eliminar todos los tutores primero (por dependencias)
DELETE FROM api_tutor;

-- Eliminar todos los usuarios
DELETE FROM api_usuario;

-- Reiniciar la secuencia de IDs
ALTER SEQUENCE api_usuario_id_seq RESTART WITH 1;
ALTER SEQUENCE api_tutor_id_seq RESTART WITH 1;

-- ============================================
-- INSERTAR 3 USUARIOS (uno por cada rol)
-- ============================================

-- 1. ADMINISTRADOR
INSERT INTO api_usuario (email, password_hash, nombre_completo, telefono, rol_id, activo) VALUES
('admin@vet.com', 'admin123', 'Administrador Sistema', '77111111', 1, TRUE);

-- 2. VETERINARIO
INSERT INTO api_usuario (email, password_hash, nombre_completo, telefono, rol_id, activo) VALUES
('vet@vet.com', 'vet123', 'Dr. Carlos Veterinario', '77222222', 2, TRUE);

-- 3. TUTOR (con su registro en tabla api_tutor)
INSERT INTO api_usuario (email, password_hash, nombre_completo, telefono, rol_id, activo) VALUES
('tutor@vet.com', 'tutor123', 'Juan Pérez Tutor', '77333333', 3, TRUE);

-- Crear el registro de tutor para el usuario tutor
INSERT INTO api_tutor (usuario_id, ci, direccion, fecha_nacimiento) VALUES
(3, '1234567 LP', 'Av. Principal #123, La Paz', '1990-01-15');

-- ============================================
-- VERIFICAR
-- ============================================
SELECT u.id, u.email, u.password_hash, u.nombre_completo, r.nombre as rol
FROM api_usuario u
JOIN api_rol r ON u.rol_id = r.id
ORDER BY u.id;
