/**
 * GestionTutores - Gestión de tutores (dueños de mascotas)
 */
import React, { useState, useEffect } from 'react';
import { tutoresAPI, usuariosAPI, rolesAPI } from '../../services/api';
import '../../styles/Tables.css';

const GestionTutores = () => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    // Datos de Usuario
    email: '',
    password_hash: '',
    nombre_completo: '',
    telefono: '',
    // Datos de Tutor
    ci: '',
    direccion: '',
    fecha_nacimiento: '',
  });

  useEffect(() => {
    cargarTutores();
    cargarRoles();
  }, []);

  const cargarTutores = async () => {
    try {
      const response = await tutoresAPI.getAll();
      setTutores(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando tutores:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await rolesAPI.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  const abrirModal = () => {
    setFormData({
      email: '',
      password_hash: '',
      nombre_completo: '',
      telefono: '',
      ci: '',
      direccion: '',
      fecha_nacimiento: '',
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Paso 1: Buscar el rol "tutor"
      const rolTutor = roles.find(r => r.nombre === 'tutor');
      if (!rolTutor) {
        alert('Error: No se encontró el rol "tutor"');
        return;
      }

      // Paso 2: Crear el usuario con rol de tutor
      const usuarioData = {
        email: formData.email,
        password_hash: formData.password_hash,
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono,
        rol: rolTutor.id,
        activo: true,
      };

      const responseUsuario = await usuariosAPI.create(usuarioData);
      const nuevoUsuario = responseUsuario.data;

      // Paso 3: Crear el tutor vinculado al usuario creado
      const tutorData = {
        usuario: nuevoUsuario.id,
        ci: formData.ci,
        direccion: formData.direccion,
        fecha_nacimiento: formData.fecha_nacimiento,
      };

      await tutoresAPI.create(tutorData);

      // Recargar la lista de tutores y cerrar modal
      cargarTutores();
      cerrarModal();
      alert('Tutor creado exitosamente');
    } catch (error) {
      console.error('Error guardando tutor:', error);
      if (error.response && error.response.data) {
        const errorMsg = JSON.stringify(error.response.data);
        alert(`Error al guardar tutor: ${errorMsg}`);
      } else {
        alert('Error al guardar tutor');
      }
    }
  };

  const verMascotas = async (id) => {
    try {
      const response = await tutoresAPI.getMascotas(id);
      const mascotas = response.data;
      alert(`Mascotas: ${mascotas.map(m => m.nombre).join(', ') || 'Sin mascotas'}`);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
    }
  };

  if (loading) {
    return <div className="loading">Cargando tutores...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Tutores</h1>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          + Nuevo Tutor
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>CI</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tutores.map((tutor) => (
              <tr key={tutor.id}>
                <td>{tutor.id}</td>
                <td>{tutor.nombre_completo}</td>
                <td>{tutor.email}</td>
                <td>{tutor.telefono || '-'}</td>
                <td>{tutor.ci}</td>
                <td>{tutor.direccion}</td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => verMascotas(tutor.id)}
                    title="Ver mascotas"
                  >
                    🐕
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
              <h2>Nuevo Tutor</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <h3>Datos de Usuario</h3>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="tutor@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={formData.password_hash}
                  onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                  required
                  placeholder="Contraseña del usuario"
                />
              </div>

              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  required
                  placeholder="Juan Pérez García"
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

              <h3>Datos de Tutor</h3>

              <div className="form-group">
                <label>CI *</label>
                <input
                  type="text"
                  value={formData.ci}
                  onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                  required
                  placeholder="1234567 LP"
                />
              </div>

              <div className="form-group">
                <label>Dirección *</label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                  placeholder="Av. Principal #123, Ciudad"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTutores;
