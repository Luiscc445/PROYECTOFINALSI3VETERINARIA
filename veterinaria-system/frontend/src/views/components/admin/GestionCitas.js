/**
 * GestionCitas - CRUD COMPLETO de citas (Admin)
 * El Admin puede crear, ver, editar y eliminar citas en nombre de cualquier tutor
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { citasAPI, mascotasAPI, veterinariosAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionCitas = () => {
  const { success, error: showError } = useToast();

  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const [formData, setFormData] = useState({
    mascota: '',
    veterinario: '',
    fecha_hora: '',
    motivo: '',
    observaciones_tutor: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar citas, mascotas y veterinarios en paralelo
      const [citasData, mascotasData, veterinariosData] = await Promise.all([
        citasAPI.getAll(),
        mascotasAPI.getAll(),
        veterinariosAPI.getAll(),
      ]);

      setCitas(citasData);
      setMascotas(mascotasData);
      setVeterinarios(veterinariosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showError('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.mascota || !formData.veterinario || !formData.fecha_hora || !formData.motivo) {
      showError('Complete todos los campos requeridos');
      return;
    }

    // Validar que la fecha sea futura (solo para nuevas citas)
    if (!editingId) {
      const fechaSeleccionada = new Date(formData.fecha_hora);
      const ahora = new Date();
      if (fechaSeleccionada <= ahora) {
        showError('La fecha y hora deben ser futuras');
        return;
      }
    }

    try {
      const dataToSend = {
        mascota: parseInt(formData.mascota),
        veterinario: parseInt(formData.veterinario),
        fecha_hora: formData.fecha_hora,
        motivo: formData.motivo,
        observaciones_tutor: formData.observaciones_tutor,
        estado: formData.estado,
      };

      if (editingId) {
        await citasAPI.update(editingId, dataToSend);
        success('Cita actualizada exitosamente');
      } else {
        await citasAPI.create(dataToSend);
        success('Cita creada exitosamente');
      }

      setShowModal(false);
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error guardando cita:', error);
      const errorMsg = error.response?.data?.error || 'Error al guardar la cita';
      showError(errorMsg);
    }
  };

  const handleEdit = (cita) => {
    setEditingId(cita.id);
    // Formatear fecha para input datetime-local
    const fechaFormateada = new Date(cita.fecha_hora).toISOString().slice(0, 16);

    setFormData({
      mascota: cita.mascota.id,
      veterinario: cita.veterinario.id,
      fecha_hora: fechaFormateada,
      motivo: cita.motivo,
      observaciones_tutor: cita.observaciones_tutor || '',
      estado: cita.estado,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) {
      return;
    }

    try {
      await citasAPI.delete(id);
      success('Cita eliminada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando cita:', error);
      showError('Error al eliminar la cita');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Está seguro de cancelar esta cita?')) {
      return;
    }

    try {
      await citasAPI.cancelar(id);
      success('Cita cancelada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error cancelando cita:', error);
      showError('Error al cancelar la cita');
    }
  };

  const resetForm = () => {
    setFormData({
      mascota: '',
      veterinario: '',
      fecha_hora: '',
      motivo: '',
      observaciones_tutor: '',
      estado: 'pendiente',
    });
    setEditingId(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const isFormValid = () => {
    return formData.mascota && formData.veterinario && formData.fecha_hora && formData.motivo;
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'badge-warning';
      case 'confirmada':
        return 'badge-info';
      case 'completada':
        return 'badge-success';
      case 'cancelada':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  // Filtrar citas por estado
  const citasFiltradas = filtroEstado === 'todas'
    ? citas
    : citas.filter(c => c.estado === filtroEstado);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando citas...</h2>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Citas</h1>
        <button className="btn btn-primary" onClick={handleNuevo}>
          + Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <label>Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="filter-select"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {citasFiltradas.length === 0 ? (
        <div className="no-data">
          <p>No hay citas{filtroEstado !== 'todas' ? ` con estado "${filtroEstado}"` : ' registradas'}.</p>
          <button className="btn btn-primary" onClick={handleNuevo}>
            Crear Primera Cita
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mascota</th>
                <th>Tutor</th>
                <th>Veterinario</th>
                <th>Fecha y Hora</th>
                <th>Motivo</th>
                <th className="observaciones-header">Observaciones</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.id}</td>
                  <td>{cita.mascota.nombre}</td>
                  <td>{cita.mascota.tutor.usuario.nombre_completo}</td>
                  <td>{cita.veterinario.usuario.nombre_completo}</td>
                  <td>{formatFecha(cita.fecha_hora)}</td>
                  <td>{cita.motivo}</td>
                  <td className="observaciones-cell">
                    {cita.observaciones_tutor || '-'}
                  </td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(cita)}
                      style={{ marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    {cita.estado === 'pendiente' && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleCancelar(cita.id)}
                        style={{ marginRight: '5px' }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(cita.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Cita' : 'Nueva Cita'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Mascota <span className="required">*</span>
                </label>
                <select
                  name="mascota"
                  value={formData.mascota}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una mascota</option>
                  {mascotas.map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre} - Tutor: {mascota.tutor.usuario.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Veterinario <span className="required">*</span>
                </label>
                <select
                  name="veterinario"
                  value={formData.veterinario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un veterinario</option>
                  {veterinarios.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.usuario.nombre_completo} - {vet.especialidad || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Fecha y Hora <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="fecha_hora"
                  value={formData.fecha_hora}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Motivo de la Consulta <span className="required">*</span>
                </label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describa el motivo de la cita"
                />
              </div>

              <div className="form-group">
                <label>Observaciones del Tutor</label>
                <textarea
                  name="observaciones_tutor"
                  value={formData.observaciones_tutor}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Observaciones adicionales (opcional)"
                />
              </div>

              {editingId && (
                <div className="form-group">
                  <label>
                    Estado <span className="required">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isFormValid()}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Estilos del modal y componente */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          min-width: 600px;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .required {
          color: red;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: flex-end;
        }

        .filters-container {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .observaciones-header {
          background-color: #fef3c7;
          font-weight: bold;
        }

        .observaciones-cell {
          background-color: #fffbeb;
          max-width: 200px;
          white-space: normal;
          word-wrap: break-word;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-warning {
          background: #fbbf24;
          color: #78350f;
        }

        .badge-info {
          background: #3b82f6;
          color: white;
        }

        .badge-success {
          background: #10b981;
          color: white;
        }

        .badge-danger {
          background: #ef4444;
          color: white;
        }

        .badge-secondary {
          background: #9ca3af;
          color: white;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .no-data p {
          margin-bottom: 20px;
          color: #666;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default GestionCitas;
