/**
 * MisMascotas - Vista de las mascotas del tutor con capacidad de registro
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI, tutoresAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const MisMascotas = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mascotaDetalle, setMascotaDetalle] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [tutorData, setTutorData] = useState(null);
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    fecha_nacimiento: '',
    sexo: 'Macho',
    color: '',
    peso_kg: ''
  });

  useEffect(() => {
    cargarTutorYMascotas();
  }, [user]);

  const cargarTutorYMascotas = async () => {
    try {
      // Obtener datos del tutor actual usando la sesión autenticada
      const tutorResponse = await tutoresAPI.getMe();
      setTutorData(tutorResponse.data);

      // Cargar mascotas del tutor
      const mascotasResponse = await mascotasAPI.getMisMascotas(tutorResponse.data.id);
      setMascotas(mascotasResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar mascotas. Por favor, recargue la página.');
    } finally {
      setLoading(false);
    }
  };

  const verHistorial = async (id) => {
    try {
      const response = await mascotasAPI.getHistorialCompleto(id);
      setMascotaDetalle(response.data);
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error al cargar el historial de la mascota');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMascota(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tutorData) {
      toast.error('Error: No se pudo identificar el tutor');
      return;
    }

    try {
      const mascotaData = {
        ...nuevaMascota,
        tutor: tutorData.id,
        peso_kg: parseFloat(nuevaMascota.peso_kg),
        activo: true
      };

      await mascotasAPI.create(mascotaData);
      toast.success(`¡Mascota ${nuevaMascota.nombre} registrada exitosamente!`);

      // Resetear formulario y recargar mascotas
      setNuevaMascota({
        nombre: '',
        especie: 'Perro',
        raza: '',
        fecha_nacimiento: '',
        sexo: 'Macho',
        color: '',
        peso_kg: ''
      });
      setShowFormulario(false);
      cargarTutorYMascotas();
    } catch (error) {
      console.error('Error registrando mascota:', error);
      toast.error('Error al registrar la mascota. Verifique los datos e intente nuevamente');
    }
  };

  if (loading) {
    return <div className="loading">Cargando mascotas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Mis Mascotas</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowFormulario(true)}
        >
          + Registrar Mascota
        </button>
      </div>

      {mascotas.length === 0 ? (
        <div className="empty-state">
          <p>No tienes mascotas registradas aún.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowFormulario(true)}
          >
            Registrar mi primera mascota
          </button>
        </div>
      ) : (
        <div className="mascotas-grid">
          {mascotas.map((mascota) => (
            <div key={mascota.id} className="mascota-card">
              {mascota.foto_url && (
                <img src={mascota.foto_url} alt={mascota.nombre} className="mascota-foto" />
              )}
              <h3>{mascota.nombre}</h3>
              <p><strong>Especie:</strong> {mascota.especie}</p>
              <p><strong>Raza:</strong> {mascota.raza}</p>
              <p><strong>Edad:</strong> {mascota.edad_anos} años</p>
              <p><strong>Sexo:</strong> {mascota.sexo}</p>
              <p><strong>Peso:</strong> {mascota.peso_kg} kg</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => verHistorial(mascota.id)}
              >
                Ver Ficha Médica
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showFormulario && (
        <div className="modal-overlay" onClick={() => setShowFormulario(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Nueva Mascota</h2>
              <button className="modal-close" onClick={() => setShowFormulario(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevaMascota.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Max, Luna, Rocky"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Especie *</label>
                  <select
                    name="especie"
                    value={nuevaMascota.especie}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Hamster">Hamster</option>
                    <option value="Tortuga">Tortuga</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Raza *</label>
                  <input
                    type="text"
                    name="raza"
                    value={nuevaMascota.raza}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Golden Retriever, Siamés"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={nuevaMascota.fecha_nacimiento}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Sexo *</label>
                  <select
                    name="sexo"
                    value={nuevaMascota.sexo}
                    onChange={handleInputChange}
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
                    name="color"
                    value={nuevaMascota.color}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Dorado, Negro, Blanco"
                  />
                </div>

                <div className="form-group">
                  <label>Peso (kg) *</label>
                  <input
                    type="number"
                    name="peso_kg"
                    value={nuevaMascota.peso_kg}
                    onChange={handleInputChange}
                    required
                    min="0.1"
                    step="0.1"
                    placeholder="Ej: 15.5"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormulario(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar Mascota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de historial/ficha médica */}
      {mascotaDetalle && (
        <div className="modal-overlay" onClick={() => setMascotaDetalle(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ficha Médica de {mascotaDetalle.nombre}</h2>
              <button className="modal-close" onClick={() => setMascotaDetalle(null)}>×</button>
            </div>

            <div className="ficha-info">
              <h3>Información General</h3>
              <div className="info-grid">
                <div><strong>Especie:</strong> {mascotaDetalle.especie}</div>
                <div><strong>Raza:</strong> {mascotaDetalle.raza}</div>
                <div><strong>Edad:</strong> {mascotaDetalle.edad_anos} años</div>
                <div><strong>Sexo:</strong> {mascotaDetalle.sexo}</div>
                <div><strong>Color:</strong> {mascotaDetalle.color}</div>
                <div><strong>Peso:</strong> {mascotaDetalle.peso_kg} kg</div>
              </div>
            </div>

            <div className="historial-section">
              <h3>Historiales Médicos</h3>
              {mascotaDetalle.historiales?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Diagnóstico</th>
                      <th>Tratamiento</th>
                      <th>Veterinario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.historiales.map((h) => (
                      <tr key={h.id}>
                        <td>{new Date(h.fecha).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${h.tipo}`}>{h.tipo}</span></td>
                        <td>{h.diagnostico}</td>
                        <td>{h.tratamiento}</td>
                        <td>{h.veterinario_nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">Sin historiales médicos registrados</p>
              )}
            </div>

            <div className="historial-section">
              <h3>Citas Médicas</h3>
              {mascotaDetalle.citas?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>Motivo</th>
                      <th>Estado</th>
                      <th>Veterinario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.citas.map((c) => (
                      <tr key={c.id}>
                        <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                        <td>{c.motivo}</td>
                        <td>
                          <span className={`badge badge-${c.estado}`}>{c.estado}</span>
                        </td>
                        <td>{c.veterinario_nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">Sin citas programadas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisMascotas;
