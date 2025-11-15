/**
 * GestionUsuarios - CRUD COMPLETO de usuarios
 * El Admin puede crear, ver, editar y eliminar usuarios
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { usuariosAPI, rolesAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionUsuarios = () => {
  const { success, error: showError } = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password_hash: '',
    nombre_completo: '',
    telefono: '',
    rol: '',
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar usuarios
      const usuariosResponse = await usuariosAPI.getAll();
      setUsuarios(usuariosResponse);

      // Cargar roles
      const rolesResponse = await rolesAPI.getAll();
      setRoles(rolesResponse);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showError('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.email || !formData.nombre_completo || !formData.rol) {
      showError('Complete todos los campos requeridos');
      return;
    }

    if (!editingId && !formData.password_hash) {
      showError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    try {
      if (editingId) {
        // Actualizar usuario existente
        const updateData = { ...formData };
        // Solo enviar password si se cambió
        if (!updateData.password_hash) {
          delete updateData.password_hash;
        }

        await usuariosAPI.update(editingId, updateData);
        success('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        await usuariosAPI.create(formData);
        success('Usuario creado exitosamente');
      }

      // Cerrar modal y recargar
      setShowModal(false);
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      const errorMsg =
        error.response?.data?.error || 'Error al guardar el usuario';
      showError(errorMsg);
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    setFormData({
      email: usuario.email,
      password_hash: '', // No mostrar contraseña actual
      nombre_completo: usuario.nombre_completo,
      telefono: usuario.telefono || '',
      rol: usuario.rol.id,
      activo: usuario.activo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await usuariosAPI.delete(id);
      success('Usuario eliminado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      showError('Error al eliminar el usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password_hash: '',
      nombre_completo: '',
      telefono: '',
      rol: '',
      activo: true,
    });
    setEditingId(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const isFormValid = () => {
    if (!formData.email || !formData.nombre_completo || !formData.rol) {
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
        <h2>Cargando usuarios...</h2>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo Usuario
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="no-data">
          <p>No hay usuarios registrados.</p>
          <button className="btn btn-primary" onClick={handleNuevo}>
            Crear Primer Usuario
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre_completo}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono || '-'}</td>
                  <td>
                    <span className={`badge badge-${usuario.rol.nombre}`}>
                      {usuario.rol.nombre}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        usuario.activo ? 'badge-activo' : 'badge-inactivo'
                      }`}
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(usuario.id)}
                      style={{ marginLeft: '5px' }}
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
            <h2>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

            <form onSubmit={handleSubmit}>
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
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>
                  Contraseña {!editingId && <span className="required">*</span>}
                </label>
                <input
                  type="password"
                  name="password_hash"
                  value={formData.password_hash}
                  onChange={handleChange}
                  required={!editingId}
                  placeholder={
                    editingId
                      ? 'Dejar en blanco para mantener la actual'
                      : 'Contraseña'
                  }
                />
                {editingId && (
                  <small>Dejar en blanco si no desea cambiar la contraseña</small>
                )}
              </div>

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
                  placeholder="Nombre completo del usuario"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                />
              </div>

              <div className="form-group">
                <label>
                  Rol <span className="required">*</span>
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  Usuario Activo
                </label>
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

      {/* Estilos del modal */}
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
        .form-group select {
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

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: auto;
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

        .badge-administrador {
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-veterinario {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-tutor {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-activo {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .badge-inactivo {
          background: #9ca3af;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
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

export default GestionUsuarios;
