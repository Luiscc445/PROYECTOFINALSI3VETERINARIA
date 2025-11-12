/**
 * GestionMascotas - CRUD completo de mascotas
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI, tutoresAPI } from '../../services/api';
import '../../styles/Tables.css';

const GestionMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tutor: '',
    nombre: '',
    especie: 'Perro',
    raza: '',
    fecha_nacimiento: '',
    sexo: 'Macho',
    color: '',
    peso_kg: '',
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [mascotasRes, tutoresRes] = await Promise.all([
        mascotasAPI.getAll(),
        tutoresAPI.getAll()
      ]);
      setMascotas(mascotasRes.data.results || mascotasRes.data);
      setTutores(tutoresRes.data.results || tutoresRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (mascota = null) => {
    if (mascota) {
      setFormData({
        tutor: mascota.tutor_id,
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza,
        fecha_nacimiento: mascota.fecha_nacimiento,
        sexo: mascota.sexo,
        color: mascota.color,
        peso_kg: mascota.peso_kg,
        activo: mascota.activo,
      });
      setEditingId(mascota.id);
    } else {
      setFormData({
        tutor: '',
        nombre: '',
        especie: 'Perro',
        raza: '',
        fecha_nacimiento: '',
        sexo: 'Macho',
        color: '',
        peso_kg: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await mascotasAPI.update(editingId, formData);
      } else {
        await mascotasAPI.create(formData);
      }
      cargarDatos();
      cerrarModal();
      alert(editingId ? 'Mascota actualizada' : 'Mascota creada exitosamente');
    } catch (error) {
      console.error('Error guardando mascota:', error);
      alert('Error al guardar mascota');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta mascota?')) {
      try {
        await mascotasAPI.delete(id);
        cargarDatos();
        alert('Mascota eliminada');
      } catch (error) {
        console.error('Error eliminando mascota:', error);
        alert('Error al eliminar mascota');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando mascotas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Mascotas</h1>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          + Nueva Mascota
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Tutor</th>
              <th>Sexo</th>
              <th>Peso (kg)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((mascota) => (
              <tr key={mascota.id}>
                <td>{mascota.id}</td>
                <td>{mascota.nombre}</td>
                <td>{mascota.especie}</td>
                <td>{mascota.raza}</td>
                <td>{mascota.tutor_nombre_completo || 'N/A'}</td>
                <td>{mascota.sexo}</td>
                <td>{mascota.peso_kg}</td>
                <td>
                  <span className={`status ${mascota.activo ? 'status-active' : 'status-inactive'}`}>
                    {mascota.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => abrirModal(mascota)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(mascota.id)}
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
              <h2>{editingId ? 'Editar Mascota' : 'Nueva Mascota'}</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tutor *</label>
                <select
                  value={formData.tutor}
                  onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                  required
                >
                  <option value="">Seleccione un tutor</option>
                  {tutores.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.nombre_completo} - CI: {tutor.ci}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Rocky"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Especie *</label>
                  <select
                    value={formData.especie}
                    onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                    required
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Raza *</label>
                  <input
                    type="text"
                    value={formData.raza}
                    onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                    required
                    placeholder="Labrador"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sexo *</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    required
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color *</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                    placeholder="Dorado"
                  />
                </div>

                <div className="form-group">
                  <label>Peso (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.peso_kg}
                    onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })}
                    required
                    placeholder="25.5"
                  />
                </div>
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

export default GestionMascotas;
