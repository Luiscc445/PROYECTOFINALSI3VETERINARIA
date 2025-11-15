/**
 * GestionMascotas - CRUD COMPLETO de mascotas
 * El Admin puede crear, ver, editar y eliminar mascotas
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { mascotasAPI, tutoresAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionMascotas = () => {
  const { success, error: showError } = useToast();

  const [mascotas, setMascotas] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad_anios: '',
    color: '',
    peso_kg: '',
    tutor: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar mascotas y tutores en paralelo
      const [mascotasData, tutoresData] = await Promise.all([
        mascotasAPI.getAll(),
        tutoresAPI.getAll(),
      ]);

      setMascotas(mascotasData);
      setTutores(tutoresData);
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
    if (!formData.nombre || !formData.especie || !formData.tutor) {
      showError('Complete todos los campos requeridos');
      return;
    }

    try {
      const dataToSend = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        edad_anios: formData.edad_anios ? parseInt(formData.edad_anios) : null,
        color: formData.color,
        peso_kg: formData.peso_kg ? parseFloat(formData.peso_kg) : null,
        tutor: parseInt(formData.tutor),
      };

      if (editingId) {
        await mascotasAPI.update(editingId, dataToSend);
        success('Mascota actualizada exitosamente');
      } else {
        await mascotasAPI.create(dataToSend);
        success('Mascota creada exitosamente');
      }

      setShowModal(false);
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error guardando mascota:', error);
      const errorMsg = error.response?.data?.error || 'Error al guardar la mascota';
      showError(errorMsg);
    }
  };

  const handleEdit = (mascota) => {
    setEditingId(mascota.id);
    setFormData({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza || '',
      edad_anios: mascota.edad_anios || '',
      color: mascota.color || '',
      peso_kg: mascota.peso_kg || '',
      tutor: mascota.tutor.id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta mascota?')) {
      return;
    }

    try {
      await mascotasAPI.delete(id);
      success('Mascota eliminada exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      showError('Error al eliminar la mascota');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad_anios: '',
      color: '',
      peso_kg: '',
      tutor: '',
    });
    setEditingId(null);
  };

  const handleNuevo = () => {
    resetForm();
    setShowModal(true);
  };

  const isFormValid = () => {
    return formData.nombre && formData.especie && formData.tutor;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando mascotas...</h2>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Mascotas</h1>
        <button className="btn btn-primary" onClick={handleNuevo}>
          + Nueva Mascota
        </button>
      </div>

      {mascotas.length === 0 ? (
        <div className="no-data">
          <p>No hay mascotas registradas.</p>
          <button className="btn btn-primary" onClick={handleNuevo}>
            Crear Primera Mascota
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Color</th>
                <th>Peso (kg)</th>
                <th>Tutor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((mascota) => (
                <tr key={mascota.id}>
                  <td>{mascota.id}</td>
                  <td>{mascota.nombre}</td>
                  <td>{mascota.especie}</td>
                  <td>{mascota.raza || '-'}</td>
                  <td>{mascota.edad_anios ? `${mascota.edad_anios} años` : '-'}</td>
                  <td>{mascota.color || '-'}</td>
                  <td>{mascota.peso_kg || '-'}</td>
                  <td>{mascota.tutor.usuario.nombre_completo}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(mascota)}
                      style={{ marginRight: '5px' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(mascota.id)}
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
            <h2>{editingId ? 'Editar Mascota' : 'Nueva Mascota'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Nombre de la mascota"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Especie <span className="required">*</span>
                  </label>
                  <select
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Reptil">Reptil</option>
                    <option value="Roedor">Roedor</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Raza</label>
                  <input
                    type="text"
                    name="raza"
                    value={formData.raza}
                    onChange={handleChange}
                    placeholder="Raza de la mascota"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Edad (años)</label>
                  <input
                    type="number"
                    name="edad_anios"
                    value={formData.edad_anios}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Edad en años"
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Color de la mascota"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    name="peso_kg"
                    value={formData.peso_kg}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="Peso en kilogramos"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Tutor <span className="required">*</span>
                  </label>
                  <select
                    name="tutor"
                    value={formData.tutor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un tutor</option>
                    {tutores.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.usuario.nombre_completo} (CI: {tutor.ci})
                      </option>
                    ))}
                  </select>
                </div>
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
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
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

export default GestionMascotas;
