/**
 * CrearHistorial - Formulario para crear historial médico desde una cita
 */
import React, { useState } from 'react';
import { historialesAPI, citasAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Tables.css';

const CrearHistorial = ({ cita, onClose, onSuccess }) => {
  const toast = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo: 'consulta',
    diagnostico: '',
    tratamiento: '',
    medicamentos: '',
    peso_kg: '',
    temperatura_c: '',
    observaciones: ''
  });
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      // Crear historial médico
      const historialData = {
        ...formData,
        mascota: cita.mascota,
        veterinario: user.id,
        fecha: new Date().toISOString().split('T')[0],
        peso_kg: formData.peso_kg ? parseFloat(formData.peso_kg) : null,
        temperatura_c: formData.temperatura_c ? parseFloat(formData.temperatura_c) : null
      };

      await historialesAPI.create(historialData);

      // Marcar cita como completada
      await citasAPI.cambiarEstado(cita.id, 'completada');

      toast.success('Historial médico creado exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creando historial:', error);
      toast.error('Error al crear el historial médico');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Atender Paciente: {cita.mascota_nombre}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <p><strong>Mascota:</strong> {cita.mascota_nombre}</p>
          <p><strong>Tutor:</strong> {cita.tutor_nombre}</p>
          <p><strong>Motivo de la cita:</strong> {cita.motivo}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Consulta *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="consulta">Consulta General</option>
              <option value="vacunacion">Vacunación</option>
              <option value="cirugia">Cirugía</option>
              <option value="emergencia">Emergencia</option>
              <option value="control">Control</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diagnostico">Diagnóstico *</label>
            <textarea
              id="diagnostico"
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Describa el diagnóstico del paciente..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tratamiento">Tratamiento *</label>
            <textarea
              id="tratamiento"
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Describa el tratamiento prescrito..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicamentos">Medicamentos Recetados</label>
            <textarea
              id="medicamentos"
              name="medicamentos"
              value={formData.medicamentos}
              onChange={handleChange}
              rows="2"
              placeholder="Lista de medicamentos, dosis y frecuencia..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="peso_kg">Peso (kg)</label>
              <input
                id="peso_kg"
                type="number"
                name="peso_kg"
                value={formData.peso_kg}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="Ej: 15.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="temperatura_c">Temperatura (°C)</label>
              <input
                id="temperatura_c"
                type="number"
                name="temperatura_c"
                value={formData.temperatura_c}
                onChange={handleChange}
                step="0.1"
                min="30"
                max="45"
                placeholder="Ej: 38.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observaciones">Observaciones Adicionales</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="3"
              placeholder="Notas adicionales, recomendaciones para el tutor, próxima visita..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar Historial Médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearHistorial;
