/**
 * GestionCitas - CRUD completo de citas
 */
import React, { useState, useEffect } from 'react';
import { citasAPI, mascotasAPI, usuariosAPI } from '../../services/api';
import '../../styles/Tables.css';

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    mascota: '',
    veterinario: '',
    fecha_hora: '',
    motivo: '',
    estado: 'pendiente',
    observaciones: '',
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
      setVeterinarios(vetsRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (cita = null) => {
    if (cita) {
      // Formato de fecha para input datetime-local
      const fechaHora = cita.fecha_hora ?
        new Date(cita.fecha_hora).toISOString().slice(0, 16) : '';

      setFormData({
        mascota: cita.mascota_id,
        veterinario: cita.veterinario_id,
        fecha_hora: fechaHora,
        motivo: cita.motivo,
        estado: cita.estado,
        observaciones: cita.observaciones || '',
      });
      setEditingId(cita.id);
    } else {
      setFormData({
        mascota: '',
        veterinario: '',
        fecha_hora: '',
        motivo: '',
        estado: 'pendiente',
        observaciones: '',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await citasAPI.update(editingId, formData);
      } else {
        await citasAPI.create(formData);
      }
      cargarDatos();
      cerrarModal();
      alert(editingId ? 'Cita actualizada' : 'Cita creada exitosamente');
    } catch (error) {
      console.error('Error guardando cita:', error);
      alert('Error al guardar cita');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de cancelar/eliminar esta cita?')) {
      try {
        await citasAPI.delete(id);
        cargarDatos();
        alert('Cita eliminada');
      } catch (error) {
        console.error('Error eliminando cita:', error);
        alert('Error al eliminar cita');
      }
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await citasAPI.cambiarEstado(id, nuevoEstado);
      cargarDatos();
      alert(`Cita marcada como ${nuevoEstado}`);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'pendiente': 'badge-warning',
      'confirmada': 'badge-info',
      'completada': 'badge-success',
      'cancelada': 'badge-danger'
    };
    return classes[estado] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Citas</h1>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          + Nueva Cita
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mascota</th>
              <th>Tutor</th>
              <th>Veterinario</th>
              <th>Fecha/Hora</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.mascota_nombre || 'N/A'}</td>
                <td>{cita.tutor_nombre || 'N/A'}</td>
                <td>{cita.veterinario_nombre || 'N/A'}</td>
                <td>{formatearFecha(cita.fecha_hora)}</td>
                <td>{cita.motivo}</td>
                <td>
                  <span className={`badge ${getEstadoBadgeClass(cita.estado)}`}>
                    {cita.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => abrirModal(cita)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  {cita.estado === 'pendiente' && (
                    <button
                      className="btn-icon"
                      onClick={() => cambiarEstado(cita.id, 'confirmada')}
                      title="Confirmar"
                      style={{ color: '#3498db' }}
                    >
                      ✓
                    </button>
                  )}
                  {cita.estado === 'confirmada' && (
                    <button
                      className="btn-icon"
                      onClick={() => cambiarEstado(cita.id, 'completada')}
                      title="Completar"
                      style={{ color: '#2ecc71' }}
                    >
                      ✓✓
                    </button>
                  )}
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(cita.id)}
                    title="Cancelar/Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Cita' : 'Nueva Cita'}</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mascota *</label>
                <select
                  value={formData.mascota}
                  onChange={(e) => setFormData({ ...formData, mascota: e.target.value })}
                  required
                >
                  <option value="">Seleccione una mascota</option>
                  {mascotas.filter(m => m.activo).map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre} ({mascota.especie}) - Tutor: {mascota.tutor_nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Veterinario *</label>
                <select
                  value={formData.veterinario}
                  onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                  required
                >
                  <option value="">Seleccione un veterinario</option>
                  {veterinarios.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  value={formData.fecha_hora}
                  onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Motivo *</label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  required
                  placeholder="Control de rutina, vacunación, consulta..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Estado *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
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
