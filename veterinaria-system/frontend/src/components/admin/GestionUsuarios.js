/**
 * GestionUsuarios - CRUD de usuarios
 */
import React, { useState, useEffect } from 'react';
import { usuariosAPI, rolesAPI } from '../../services/api';
import Toast from '../Toast';
import '../../styles/Tables.css';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password_hash: '',
    nombre_completo: '',
    telefono: '',
    rol: '',
    activo: true,
  });
  const [editingId, setEditingId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await usuariosAPI.getAll();
      setUsuarios(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await rolesAPI.getAll();
      console.log('Respuesta de roles:', response);

      // Manejar diferentes formatos de respuesta
      const rolesData = response.data.results || response.data;
      setRoles(rolesData);

      if (!rolesData || rolesData.length === 0) {
        showToast('⚠️ No hay roles disponibles en el sistema', 'warning');
      }
    } catch (error) {
      console.error('Error cargando roles:', error);
      console.error('Detalles del error:', error.response);

      const errorMsg = error.response?.data?.detail ||
                       error.response?.statusText ||
                       'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
      showToast(`✕ Error al cargar roles: ${errorMsg}`, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usuariosAPI.update(editingId, formData);
        showToast('✓ Usuario actualizado exitosamente', 'success');
      } else {
        await usuariosAPI.create(formData);
        showToast('✓ Usuario creado exitosamente', 'success');
      }
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      const errorMsg = error.response?.data?.error ||
                       error.response?.data?.email?.[0] ||
                       error.response?.data?.message ||
                       'Error al guardar usuario';
      showToast(`✕ ${errorMsg}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usuariosAPI.delete(id);
        showToast('✓ Usuario eliminado exitosamente', 'success');
        cargarUsuarios();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        const errorMsg = error.response?.data?.error ||
                         error.response?.data?.message ||
                         'Error al eliminar usuario. Puede tener dependencias.';
        showToast(`✕ ${errorMsg}`, 'error');
      }
    }
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      // FIX: Obtener el ID del rol correctamente
      const rolId = usuario.rol_id || usuario.rol?.id || usuario.rol;

      setFormData({
        email: usuario.email,
        password_hash: '',
        nombre_completo: usuario.nombre_completo,
        telefono: usuario.telefono || '',
        rol: rolId, // ← FIX: Usar el ID del rol, no el objeto
        activo: usuario.activo,
      });
      setEditingId(usuario.id);
    } else {
      setFormData({
        email: '',
        password_hash: '',
        nombre_completo: '',
        telefono: '',
        rol: '',
        activo: true,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="gestion-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="gestion-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nombre Completo</th>
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
                <td>{usuario.email}</td>
                <td>{usuario.nombre_completo}</td>
                <td>{usuario.telefono || '-'}</td>
                <td>
                  <span className={`badge badge-${usuario.rol_nombre}`}>
                    {usuario.rol_nombre}
                  </span>
                </td>
                <td>
                  <span className={`status ${usuario.activo ? 'status-active' : 'status-inactive'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => abrirModal(usuario)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(usuario.id)}
                    title="Eliminar"
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
              <h2>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Contraseña {!editingId && '*'}</label>
                <input
                  type="password"
                  value={formData.password_hash}
                  onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                  required={!editingId}
                  placeholder={editingId ? 'Dejar en blanco para no cambiar' : 'Contraseña segura'}
                />
              </div>

              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="77123456"
                />
              </div>

              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  />
                  {' '}Activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
