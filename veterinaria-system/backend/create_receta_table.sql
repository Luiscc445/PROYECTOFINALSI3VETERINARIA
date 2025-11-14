-- Script SQL para crear la tabla api_recetamedicamento manualmente en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Eliminar la tabla si existe (con CASCADE para eliminar dependencias)
DROP TABLE IF EXISTS api_recetamedicamento CASCADE;

-- 2. Crear la tabla con la estructura correcta
CREATE TABLE api_recetamedicamento (
    id SERIAL PRIMARY KEY,
    historial_medico_id INTEGER NOT NULL,
    medicamento_id INTEGER NOT NULL,
    dosis VARCHAR(100) NOT NULL,
    frecuencia VARCHAR(100) NOT NULL,
    duracion VARCHAR(100) NOT NULL,
    instrucciones TEXT NOT NULL DEFAULT '',
    cantidad_total INTEGER NOT NULL CHECK (cantidad_total >= 1),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Foreign Keys
    CONSTRAINT api_recetamedicamento_historial_medico_id_fkey
        FOREIGN KEY (historial_medico_id)
        REFERENCES api_historialmedico(id)
        ON DELETE CASCADE,

    CONSTRAINT api_recetamedicamento_medicamento_id_fkey
        FOREIGN KEY (medicamento_id)
        REFERENCES api_inventario(id)
        ON DELETE RESTRICT
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX api_recetamedicamento_historial_medico_id_idx
    ON api_recetamedicamento(historial_medico_id);

CREATE INDEX api_recetamedicamento_medicamento_id_idx
    ON api_recetamedicamento(medicamento_id);

CREATE INDEX api_recetamedicamento_created_at_idx
    ON api_recetamedicamento(created_at DESC);

-- 4. Comentario informativo
COMMENT ON TABLE api_recetamedicamento IS 'Recetas de medicamentos asociadas a historiales médicos';
