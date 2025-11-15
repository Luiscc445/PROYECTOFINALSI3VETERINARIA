/**
 * GestionCitas - Gestión completa de citas para administradores
 */
import React, { useState, useEffect } from 'react';
import { citasAPI, mascotasAPI, usuariosAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const GestionCitas = () => {
  const toast = useToast();
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormulario, setShowFormulario] = useState(false);
  const [citaEditar, setCitaEditar] = useState(null);
  const [nuevaCita, setNuevaCita] = useState({
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
      const [citasRes, mascotasRes, vetsRes] = await Promise.all([
        citasAPI.getAll(),
        mascotasAPI.getAll(),
        usuariosAPI.getVeterinarios()
      ]);

      setCitas(citasRes.data.results || citasRes.data);
      setMascotas(mascotasRes.data.results || mascotasRes.data);
      setVeterinarios(vetsRes.data.results || vetsRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (citaEditar) {
        await citasAPI.update(citaEditar.id, nuevaCita);
        toast.success('Cita actualizada exitosamente');
      } else {
        await citasAPI.create(nuevaCita);
        toast.success('Cita creada exitosamente');
      }

      setShowFormulario(false);
      setCitaEditar(null);
      setNuevaCita({
        mascota: '',
        veterinario: '',
        fecha_hora: '',
        motivo: '',
        observaciones: ''
      });
      cargarDatos();
    } catch (error) {
      console.error('Error guardando cita:', error);
      toast.error('Error al guardar cita');
    }
  };

  const abrirFormularioEditar = (cita) => {
    setCitaEditar(cita);
    setNuevaCita({
      mascota: cita.mascota,
      veterinario: cita.veterinario,
      fecha_hora: cita.fecha_hora,
      motivo: cita.motivo,
      observaciones: cita.observaciones || ''
    });
    setShowFormulario(true);
  };

  const cambiarEstado = async (citaId, nuevoEstado) => {
    try {
      await citasAPI.cambiarEstado(citaId, nuevoEstado);
      toast.success(`Cita ${nuevoEstado} exitosamente`);
      cargarDatos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast.error('Error al cambiar estado de la cita');
    }
  };

  const eliminarCita = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cita?')) {
      try {
        await citasAPI.delete(id);
        toast.success('Cita eliminada exitosamente');
        cargarDatos();
      } catch (error) {
        console.error('Error eliminando cita:', error);
        toast.error('Error al eliminar cita');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Citas</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setCitaEditar(null);
            setNuevaCita({
              mascota: '',
              veterinario: '',
              fecha_hora: '',
              motivo: '',
              observaciones: ''
            });
            setShowFormulario(true);
          }}
        >
          + Nueva Cita
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Mascota</th>
              <th>Tutor</th>
              <th>Veterinario</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{new Date(cita.fecha_hora).toLocaleString()}</td>
                <td>{cita.mascota_nombre}</td>
                <td>{cita.tutor_nombre}</td>
                <td>{cita.veterinario_nombre}</td>
                <td>{cita.motivo}</td>
                <td>
                  <span className={`badge badge-${cita.estado}`}>
                    {cita.estado}
                  </span>
                </td>
                <td>
                  {cita.estado === 'pendiente' && (
                    <button
                      className="btn-icon"
                      onClick={() => cambiarEstado(cita.id, 'confirmada')}
                      title="Confirmar cita"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="btn-icon"
                    onClick={() => abrirFormularioEditar(cita)}
                    title="Editar cita"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => eliminarCita(cita.id)}
                    title="Eliminar cita"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de formulario */}
      {showFormulario && (
        <div className="modal-overlay" onClick={() => setShowFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{citaEditar ? 'Editar Cita' : 'Nueva Cita'}</h2>
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
                  {mascotas.filter(m => m.activo).map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre} - {mascota.tutor_nombre}
                    </option>
                  ))}
                </select>
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
                      {vet.nombre_completo} - {vet.especialidad_display}
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
                />
              </div>

              <div className="form-group">
                <label>Motivo *</label>
                <textarea
                  name="motivo"
                  value={nuevaCita.motivo}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Descripción del motivo de la cita"
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={nuevaCita.observaciones}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Observaciones adicionales (opcional)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormulario(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {citaEditar ? 'Actualizar' : 'Crear'} Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCitas;
