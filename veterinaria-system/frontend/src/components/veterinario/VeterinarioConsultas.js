/**
 * VeterinarioConsultas - Componente para gestionar consultas y recetas médicas
 */
import React, { useState, useEffect } from 'react';
import { citasAPI, mascotasAPI, inventarioAPI, historialesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../Toast';
import '../../styles/Tables.css';

const VeterinarioConsultas = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mascota, setMascota] = useState(null);
  const [medicamentosDisponibles, setMedicamentosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [historialId, setHistorialId] = useState(null);
  const [toast, setToast] = useState(null);

  const [formHistorial, setFormHistorial] = useState({
    tipo: 'consulta',
    diagnostico: '',
    tratamiento: '',
    peso_kg: '',
    temperatura_c: '',
    observaciones: '',
    proxima_visita: '',
  });

  const [medicamentosRecetados, setMedicamentosRecetados] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    cargarCitas();
    cargarMedicamentos();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await citasAPI.getAll({ veterinario: user.id });
      const todasCitas = response.data.results || response.data;

      // Filtrar solo citas confirmadas o completadas
      const citasFiltradas = todasCitas.filter(
        c => c.estado === 'confirmada' || c.estado === 'completada'
      );

      setCitas(citasFiltradas);
    } catch (error) {
      console.error('Error cargando citas:', error);
      showToast('✕ Error al cargar citas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarMedicamentos = async () => {
    try {
      const response = await inventarioAPI.getMedicamentos();
      setMedicamentosDisponibles(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando medicamentos:', error);
      showToast('✕ Error al cargar medicamentos', 'error');
    }
  };

  const abrirConsulta = async (cita) => {
    try {
      // Cargar información completa de la mascota
      const responseMascota = await mascotasAPI.getById(cita.mascota);
      setMascota(responseMascota.data);

      setCitaSeleccionada(cita);
      setFormHistorial({
        tipo: 'consulta',
        diagnostico: '',
        tratamiento: '',
        peso_kg: responseMascota.data.peso_kg || '',
        temperatura_c: '',
        observaciones: '',
        proxima_visita: '',
      });
      setMedicamentosRecetados([]);
      setShowModal(true);
    } catch (error) {
      console.error('Error abriendo consulta:', error);
      showToast('✕ Error al cargar información de la mascota', 'error');
    }
  };

  const agregarMedicamento = () => {
    setMedicamentosRecetados([
      ...medicamentosRecetados,
      {
        inventario: '',
        cantidad: 1,
        dosis: '',
        duracion_dias: 1,
        indicaciones: '',
      }
    ]);
  };

  const actualizarMedicamento = (index, campo, valor) => {
    const nuevosMedicamentos = [...medicamentosRecetados];
    nuevosMedicamentos[index][campo] = valor;
    setMedicamentosRecetados(nuevosMedicamentos);
  };

  const eliminarMedicamento = (index) => {
    const nuevosMedicamentos = medicamentosRecetados.filter((_, i) => i !== index);
    setMedicamentosRecetados(nuevosMedicamentos);
  };

  const guardarHistorial = async (e) => {
    e.preventDefault();

    if (!formHistorial.diagnostico.trim() || !formHistorial.tratamiento.trim()) {
      showToast('✕ El diagnóstico y tratamiento son obligatorios', 'error');
      return;
    }

    try {
      const data = {
        mascota: citaSeleccionada.mascota,
        veterinario: user.id,
        fecha: new Date().toISOString().split('T')[0],
        tipo: formHistorial.tipo,
        diagnostico: formHistorial.diagnostico,
        tratamiento: formHistorial.tratamiento,
        peso_kg: formHistorial.peso_kg || null,
        temperatura_c: formHistorial.temperatura_c || null,
        observaciones: formHistorial.observaciones,
        proxima_visita: formHistorial.proxima_visita || null,
        medicamentos_recetados: medicamentosRecetados.map(med => ({
          inventario: parseInt(med.inventario),
          cantidad: parseInt(med.cantidad),
          dosis: med.dosis,
          duracion_dias: parseInt(med.duracion_dias),
          indicaciones: med.indicaciones,
        })),
      };

      const response = await historialesAPI.crearConMedicamentos(data);

      // Cambiar estado de la cita a completada
      await citasAPI.cambiarEstado(citaSeleccionada.id, 'completada');

      // Guardar ID del historial para descargar PDF
      setHistorialId(response.data.historial_id || response.data.id);

      showToast('✓ Historial médico creado exitosamente', 'success');
      cerrarModal();
      setShowSuccessModal(true); // Mostrar modal de éxito con opción de PDF
      cargarCitas();
      cargarMedicamentos(); // Recargar para actualizar stocks
    } catch (error) {
      console.error('Error guardando historial:', error);
      const errorMsg = error.response?.data?.error ||
                       error.response?.data?.message ||
                       'Error al guardar historial médico';
      showToast(`✕ ${errorMsg}`, 'error');
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setCitaSeleccionada(null);
    setMascota(null);
  };

  const descargarPDF = async () => {
    try {
      const response = await historialesAPI.descargarRecetaPDF(historialId);

      // Crear un enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receta_${mascota?.nombre || 'mascota'}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast('✓ PDF descargado exitosamente', 'success');
    } catch (error) {
      console.error('Error descargando PDF:', error);
      showToast('✕ Error al descargar PDF', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Cargando consultas...</div>;
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
        <h1>Mis Consultas</h1>
        <button className="btn btn-secondary" onClick={cargarCitas}>
          🔄 Actualizar
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Mascota</th>
              <th>Tutor</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No tienes citas pendientes de atención
                </td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{new Date(cita.fecha_hora).toLocaleString('es-BO')}</td>
                  <td>{cita.mascota_nombre}</td>
                  <td>{cita.tutor_nombre}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <span className={`badge badge-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td>
                    {cita.estado === 'confirmada' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => abrirConsulta(cita)}
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        🩺 Atender
                      </button>
                    )}
                    {cita.estado === 'completada' && (
                      <span style={{ color: '#4CAF50', fontSize: '12px' }}>
                        ✓ Atendida
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <h2>📋 Consulta Médica</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>

            {mascota && (
              <div style={{ background: '#f8f9fa', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Información del Paciente</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div><strong>Nombre:</strong> {mascota.nombre}</div>
                  <div><strong>Especie:</strong> {mascota.especie}</div>
                  <div><strong>Raza:</strong> {mascota.raza}</div>
                  <div><strong>Edad:</strong> {mascota.edad_anos} años</div>
                  <div><strong>Sexo:</strong> {mascota.sexo}</div>
                  <div><strong>Tutor:</strong> {mascota.tutor_nombre}</div>
                </div>
              </div>
            )}

            <form onSubmit={guardarHistorial}>
              <h3>Datos de la Consulta</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Consulta *</label>
                  <select
                    value={formHistorial.tipo}
                    onChange={(e) => setFormHistorial({ ...formHistorial, tipo: e.target.value })}
                    required
                  >
                    <option value="consulta">Consulta</option>
                    <option value="vacunacion">Vacunación</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="emergencia">Emergencia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formHistorial.peso_kg}
                    onChange={(e) => setFormHistorial({ ...formHistorial, peso_kg: e.target.value })}
                    placeholder="Ej: 12.5"
                  />
                </div>

                <div className="form-group">
                  <label>Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formHistorial.temperatura_c}
                    onChange={(e) => setFormHistorial({ ...formHistorial, temperatura_c: e.target.value })}
                    placeholder="Ej: 38.5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Diagnóstico *</label>
                <textarea
                  value={formHistorial.diagnostico}
                  onChange={(e) => setFormHistorial({ ...formHistorial, diagnostico: e.target.value })}
                  required
                  rows="3"
                  placeholder="Describe el diagnóstico de la mascota"
                />
              </div>

              <div className="form-group">
                <label>Tratamiento *</label>
                <textarea
                  value={formHistorial.tratamiento}
                  onChange={(e) => setFormHistorial({ ...formHistorial, tratamiento: e.target.value })}
                  required
                  rows="3"
                  placeholder="Describe el tratamiento recomendado"
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formHistorial.observaciones}
                  onChange={(e) => setFormHistorial({ ...formHistorial, observaciones: e.target.value })}
                  rows="2"
                  placeholder="Observaciones adicionales"
                />
              </div>

              <div className="form-group">
                <label>Próxima Visita</label>
                <input
                  type="date"
                  value={formHistorial.proxima_visita}
                  onChange={(e) => setFormHistorial({ ...formHistorial, proxima_visita: e.target.value })}
                />
              </div>

              <hr style={{ margin: '30px 0', border: '1px solid #ddd' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>💊 Receta Médica</h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={agregarMedicamento}
                >
                  + Agregar Medicamento
                </button>
              </div>

              {medicamentosRecetados.map((med, index) => (
                <div key={index} style={{
                  background: '#f0f8ff',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  position: 'relative'
                }}>
                  <button
                    type="button"
                    onClick={() => eliminarMedicamento(index)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕ Eliminar
                  </button>

                  <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Medicamento #{index + 1}</h4>

                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Medicamento *</label>
                      <select
                        value={med.inventario}
                        onChange={(e) => actualizarMedicamento(index, 'inventario', e.target.value)}
                        required
                      >
                        <option value="">Seleccione un medicamento</option>
                        {medicamentosDisponibles.map(medicamento => (
                          <option key={medicamento.id} value={medicamento.id}>
                            {medicamento.nombre} (Stock: {medicamento.cantidad} {medicamento.unidad_medida})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cantidad *</label>
                      <input
                        type="number"
                        min="1"
                        value={med.cantidad}
                        onChange={(e) => actualizarMedicamento(index, 'cantidad', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Duración (días) *</label>
                      <input
                        type="number"
                        min="1"
                        value={med.duracion_dias}
                        onChange={(e) => actualizarMedicamento(index, 'duracion_dias', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Dosis *</label>
                    <input
                      type="text"
                      value={med.dosis}
                      onChange={(e) => actualizarMedicamento(index, 'dosis', e.target.value)}
                      required
                      placeholder="Ej: 1 tableta cada 12 horas"
                    />
                  </div>

                  <div className="form-group">
                    <label>Indicaciones</label>
                    <textarea
                      value={med.indicaciones}
                      onChange={(e) => actualizarMedicamento(index, 'indicaciones', e.target.value)}
                      rows="2"
                      placeholder="Indicaciones adicionales para este medicamento"
                    />
                  </div>
                </div>
              ))}

              {medicamentosRecetados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontStyle: 'italic' }}>
                  No se han agregado medicamentos a la receta
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '30px' }}>
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Guardar Consulta y Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ padding: '30px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>¡Consulta Guardada Exitosamente!</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                El historial médico y la receta han sido registrados correctamente.
              </p>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={descargarPDF}
                  style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                  📄 Descargar Receta (PDF)
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSuccessModal(false)}
                  style={{ fontSize: '16px', padding: '12px 24px' }}
                >
                  Cerrar
                </button>
              </div>

              <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                💡 El PDF incluye toda la información de la consulta y será entregado al tutor
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeterinarioConsultas;
