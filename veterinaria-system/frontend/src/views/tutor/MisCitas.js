/**
 * MisCitas - Vista de citas del tutor con capacidad de reserva
 */
import React, { useState, useEffect } from 'react';
import { citasAPI, mascotasAPI, usuariosAPI, tutoresAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/Tables.css';

const MisCitas = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormulario, setShowFormulario] = useState(false);
  const [tutorData, setTutorData] = useState(null);
  const [misMascotas, setMisMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState('');
  const [nuevaCita, setNuevaCita] = useState({
    mascota: '',
    veterinario: '',
    fecha_hora: '',
    motivo: ''
  });

  const especialidades = [
    { value: '', label: 'Todas las especialidades' },
    { value: 'general', label: 'Medicina General' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'traumatologia', label: 'Traumatología' },
    { value: 'odontologia', label: 'Odontología' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'oncologia', label: 'Oncología' }
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, [user]);

  useEffect(() => {
    if (showFormulario) {
      cargarVeterinarios(especialidadFiltro);
    }
  }, [showFormulario, especialidadFiltro]);

  const cargarDatosIniciales = async () => {
    try {
      // Obtener datos del tutor actual
      const tutorResponse = await tutoresAPI.getMe(user.email);
      setTutorData(tutorResponse.data);

      // Cargar citas del tutor
      const citasResponse = await citasAPI.getMisCitas(tutorResponse.data.id);
      setCitas(citasResponse.data);

      // Cargar mascotas del tutor
      const mascotasResponse = await mascotasAPI.getMisMascotas(tutorResponse.data.id);
      setMisMascotas(mascotasResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar citas. Por favor, recargue la página.');
    } finally {
      setLoading(false);
    }
  };

  const cargarVeterinarios = async (especialidad = '') => {
    try {
      const response = await usuariosAPI.getVeterinarios(especialidad);
      setVeterinarios(response.data);
    } catch (error) {
      console.error('Error cargando veterinarios:', error);
      alert('Error al cargar veterinarios.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEspecialidadChange = (e) => {
    const especialidad = e.target.value;
    setEspecialidadFiltro(especialidad);
    // Resetear veterinario seleccionado cuando cambia la especialidad
    setNuevaCita(prev => ({
      ...prev,
      veterinario: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (misMascotas.length === 0) {
      alert('Debes registrar al menos una mascota antes de agendar una cita.');
      return;
    }

    try {
      const citaData = {
        ...nuevaCita,
        mascota: parseInt(nuevaCita.mascota),
        veterinario: parseInt(nuevaCita.veterinario),
        estado: 'pendiente',
        observaciones: ''
      };

      await citasAPI.create(citaData);
      alert('¡Cita agendada exitosamente! Recibirás una confirmación pronto.');

      // Resetear formulario y recargar citas
      setNuevaCita({
        mascota: '',
        veterinario: '',
        fecha_hora: '',
        motivo: ''
      });
      setEspecialidadFiltro('');
      setShowFormulario(false);
      cargarDatosIniciales();
    } catch (error) {
      console.error('Error creando cita:', error);
      alert('Error al agendar la cita. Verifique los datos e intente nuevamente.');
    }
  };

  const obtenerFechaMinima = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().slice(0, 16);
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Mis Citas Médicas</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowFormulario(true)}
          disabled={misMascotas.length === 0}
        >
          + Agendar Cita
        </button>
      </div>

      {misMascotas.length === 0 && (
        <div className="alert alert-info">
          <strong>Información:</strong> Primero debes registrar una mascota antes de poder agendar citas.
        </div>
      )}

      {citas.length === 0 ? (
        <div className="empty-state">
          <p>No tienes citas agendadas aún.</p>
          {misMascotas.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => setShowFormulario(true)}
            >
              Agendar mi primera cita
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Mascota</th>
                <th>Veterinario</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>
                    {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </td>
                  <td>{cita.mascota_nombre}</td>
                  <td>{cita.veterinario_nombre}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <span className={`badge badge-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td>{cita.observaciones || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulario */}
      {showFormulario && (
        <div className="modal-overlay" onClick={() => setShowFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar Nueva Cita</h2>
              <button className="modal-close" onClick={() => setShowFormulario(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mascota *</label>
                <select
                  name="mascota"
                  value={nuevaCita.mascota}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una mascota</option>
                  {misMascotas.map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre} - {mascota.especie} ({mascota.raza})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Especialidad del Veterinario</label>
                <select
                  value={especialidadFiltro}
                  onChange={handleEspecialidadChange}
                >
                  {especialidades.map((esp) => (
                    <option key={esp.value} value={esp.value}>
                      {esp.label}
                    </option>
                  ))}
                </select>
                <small className="form-help">
                  Filtra los veterinarios por especialidad para encontrar el más adecuado
                </small>
              </div>

              <div className="form-group">
                <label>Veterinario *</label>
                <select
                  name="veterinario"
                  value={nuevaCita.veterinario}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un veterinario</option>
                  {veterinarios.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.nombre_completo} - {vet.especialidad_display || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  name="fecha_hora"
                  value={nuevaCita.fecha_hora}
                  onChange={handleInputChange}
                  required
                  min={obtenerFechaMinima()}
                />
                <small className="form-help">
                  Horario de atención: Lunes a Viernes 8:00-18:00, Sábados 9:00-13:00
                </small>
              </div>

              <div className="form-group">
                <label>Motivo de la Consulta *</label>
                <textarea
                  name="motivo"
                  value={nuevaCita.motivo}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describa brevemente el motivo de la consulta (síntomas, comportamiento, etc.)"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormulario(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCitas;
