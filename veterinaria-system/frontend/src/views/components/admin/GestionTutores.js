/**
 * GestionTutores - CRUD COMPLETO de tutores (dueños de mascotas)
 * El Admin puede crear, ver, editar y eliminar tutores
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { tutoresAPI, usuariosAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionTutores = () => {
  const { success, error: showError } = useToast();

  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    ci: '',
    direccion: '',
    fecha_nacimiento: '',
    // Datos del usuario asociado
    email: '',
    password_hash: '',
    nombre_completo: '',
    telefono: '',
  });

  useEffect(() => {
    cargarTutores();
  }, []);

  const cargarTutores = async () => {
    try {
      setLoading(true);
      const tutores = await tutoresAPI.getAll();
      setTutores(tutores);
    } catch (error) {
      console.error('Error cargando tutores:', error);
      showError('Error al cargar los tutores');
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
    if (!formData.ci || !formData.email || !formData.nombre_completo) {
      showError('Complete todos los campos requeridos');
      return;
    }

    if (!editingId && !formData.password_hash) {
      showError('La contraseña es requerida para nuevos tutores');
      return;
    }

    try {
      if (editingId) {
        // Actualizar tutor existente
        const updateData = {
          ci: formData.ci,
          direccion: formData.direccion,
          fecha_nacimiento: formData.fecha_nacimiento,
        };

        await tutoresAPI.update(editingId, updateData);
        success('Tutor actualizado exitosamente');
      } else {
        // Crear nuevo tutor (incluye crear usuario)
        const newTutorData = {
          ci: formData.ci,
          direccion: formData.direccion,
          fecha_nacimiento: formData.fecha_nacimiento,
          usuario: {
            email: formData.email,
            password_hash: formData.password_hash,
            nombre_completo: formData.nombre_completo,
            telefono: formData.telefono,
          },
        };

        await tutoresAPI.create(newTutorData);
        success('Tutor creado exitosamente');
      }

      setShowModal(false);
      resetForm();
      cargarTutores();
    } catch (error) {
      console.error('Error guardando tutor:', error);
      const errorMsg = error.response?.data?.error || 'Error al guardar el tutor';
      showError(errorMsg);
    }
  };

  const handleEdit = (tutor) => {
    setEditingId(tutor.id);
    setFormData({
      ci: tutor.ci,
      direccion: tutor.direccion || '',
      fecha_nacimiento: tutor.fecha_nacimiento || '',
      // Para editar solo mostramos datos del tutor, no del usuario
      email: tutor.usuario.email,
      password_hash: '',
      nombre_completo: tutor.usuario.nombre_completo,
      telefono: tutor.usuario.telefono || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este tutor? Esto también eliminará sus mascotas asociadas.')) {
      return;
    }

    try {
      await tutoresAPI.delete(id);
      success('Tutor eliminado exitosamente');
      cargarTutores();
    } catch (error) {
      console.error('Error eliminando tutor:', error);
      showError('Error al eliminar el tutor');
    }
  };

  const resetForm = () => {
    setFormData({
      ci: '',
      direccion: '',
      fecha_nacimiento: '',
      email: '',
      password_hash: '',
      nombre_completo: '',
      telefono: '',
    });
    setEditingId(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const isFormValid = () => {
    if (!formData.ci || !formData.email || !formData.nombre_completo) {
      return false;
    }
    if (!editingId && !formData.password_hash) {
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando tutores...</h2>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Tutores</h1>
        <button className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo Tutor
        </button>
      </div>

      {tutores.length === 0 ? (
        <div className="no-data">
          <p>No hay tutores registrados.</p>
          <button className="btn btn-primary" onClick={handleNuevo}>
            Crear Primer Tutor
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>CI</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Fecha Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tutores.map((tutor) => (
                <tr key={tutor.id}>
                  <td>{tutor.ci}</td>
                  <td>{tutor.usuario.nombre_completo}</td>
                  <td>{tutor.usuario.email}</td>
                  <td>{tutor.usuario.telefono || '-'}</td>
                  <td>{tutor.direccion || '-'}</td>
                  <td>
                    {tutor.fecha_nacimiento
                      ? new Date(tutor.fecha_nacimiento).toLocaleDateString('es-ES')
                      : '-'}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(tutor)}
                      style={{ marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(tutor.id)}
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
            <h2>{editingId ? 'Editar Tutor' : 'Nuevo Tutor'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  CI <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                  placeholder="Número de cédula de identidad"
                  disabled={editingId} // No se puede cambiar el CI al editar
                />
              </div>

              {!editingId && (
                <>
                  <div className="form-group">
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Contraseña <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      name="password_hash"
                      value={formData.password_hash}
                      onChange={handleChange}
                      required
                      placeholder="Contraseña"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>
                  Nombre Completo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  required
                  placeholder="Nombre completo del tutor"
                  disabled={editingId} // Para editar usuario, usar GestionUsuarios
                />
                {editingId && (
                  <small>Para editar el nombre, use Gestión de Usuarios</small>
                )}
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                  disabled={editingId}
                />
                {editingId && (
                  <small>Para editar el teléfono, use Gestión de Usuarios</small>
                )}
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Dirección completa"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>

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

      {/* Estilos del modal (reutilizamos del componente GestionUsuarios) */}
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
          min-width: 500px;
          max-width: 600px;
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

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
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

export default GestionTutores;
