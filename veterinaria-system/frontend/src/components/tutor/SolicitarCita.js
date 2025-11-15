/**
 * SolicitarCita - Formulario para que tutores soliciten citas médicas
 */
import React, { useState, useEffect } from 'react';
import { citasAPI, mascotasAPI, tutoresAPI, usuariosAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const SolicitarCita = () => {
  const toast = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formulario, setFormulario] = useState({
    mascota: '',
    veterinario: '',
    fecha_hora: '',
    motivo: '',
    observaciones: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Obtener tutor actual y sus mascotas
      const tutorResponse = await tutoresAPI.getMe();
      const tutorId = tutorResponse.data.id;
      const mascotasResponse = await mascotasAPI.getMisMascotas(tutorId);
      setMascotas(mascotasResponse.data || []);

      // Obtener veterinarios disponibles
      const veterinariosResponse = await usuariosAPI.getVeterinarios();
      setVeterinarios(veterinariosResponse.data.results || veterinariosResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await citasAPI.create(formulario);
      toast.success('¡Cita solicitada exitosamente! El veterinario la verá automáticamente.');

      // Resetear formulario
      setFormulario({
        mascota: '',
        veterinario: '',
        fecha_hora: '',
        motivo: '',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error solicitando cita:', error);
      toast.error('Error al solicitar la cita');
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Solicitar Cita Médica</h1>
      </div>

      {mascotas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
            No tienes mascotas registradas. Debes registrar una mascota primero para solicitar una cita.
          </p>
          <p style={{ color: '#999' }}>
            Ve a "Mis Mascotas" para registrar una mascota.
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mascota">Mascota *</label>
              <select
                id="mascota"
                name="mascota"
                value={formulario.mascota}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tu mascota</option>
                {mascotas.filter(m => m.activo).map((mascota) => (
                  <option key={mascota.id} value={mascota.id}>
                    {mascota.nombre} ({mascota.especie} - {mascota.raza})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="veterinario">Veterinario *</label>
              <select
                id="veterinario"
                name="veterinario"
                value={formulario.veterinario}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un veterinario</option>
                {veterinarios.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    Dr(a). {vet.nombre_completo}
                    {vet.especialidad_display && ` - ${vet.especialidad_display}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fecha_hora">Fecha y Hora Preferida *</label>
              <input
                id="fecha_hora"
                type="datetime-local"
                name="fecha_hora"
                value={formulario.fecha_hora}
                onChange={handleChange}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                Selecciona tu fecha y hora preferida. El veterinario la confirmará.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="motivo">Motivo de la Consulta *</label>
              <textarea
                id="motivo"
                name="motivo"
                value={formulario.motivo}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe brevemente el motivo de la consulta: síntomas, comportamiento anormal, revisión de rutina, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="observaciones">Observaciones Adicionales</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formulario.observaciones}
                onChange={handleChange}
                rows="3"
                placeholder="Información adicional que consideres importante: alergias conocidas, medicamentos que toma actualmente, detalles específicos..."
              />
              <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                El veterinario podrá ver estas observaciones antes de la consulta.
              </small>
            </div>

            <div style={{
              background: '#e3f2fd',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #2196f3'
            }}>
              <p style={{ margin: 0, color: '#1976d2' }}>
                <strong>ℹ️ Importante:</strong> Tu solicitud aparecerá automáticamente al veterinario seleccionado.
                Él la aceptará o te propondrá otra fecha si es necesario.
              </p>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                📋 Solicitar Cita Médica
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SolicitarCita;
