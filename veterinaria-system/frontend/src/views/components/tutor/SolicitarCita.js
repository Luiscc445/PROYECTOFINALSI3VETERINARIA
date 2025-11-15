/**
 * SolicitarCita - Formulario para solicitar citas veterinarias
 * Los tutores solicitan citas directamente SIN intervención del admin
 * Arquitectura MVC - Vista de Tutor
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { mascotasAPI, citasAPI, usuariosAPI } from '../../../models/api';

const SolicitarCita = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    mascota: '',
    veterinario: '',
    fecha_hora: '',
    motivo: '',
    observaciones: '', // CAMPO IMPORTANTE - visible para el veterinario
  });

  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar mascotas del tutor y veterinarios disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        // Obtener mascotas del tutor
        const mascotasResponse = await mascotasAPI.getByTutor(user.tutor_id);
        setMascotas(mascotasResponse);

        // Obtener todos los veterinarios
        const usuariosResponse = await usuariosAPI.getAll();
        const vets = usuariosResponse.filter((u) => u.rol_nombre === 'veterinario');
        setVeterinarios(vets);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        showError('Error al cargar la información necesaria');
      } finally {
        setLoadingData(false);
      }
    };

    if (user && user.tutor_id) {
      loadData();
    }
  }, [user, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!formData.mascota) {
        showError('Debe seleccionar una mascota');
        setLoading(false);
        return;
      }

      if (!formData.veterinario) {
        showError('Debe seleccionar un veterinario');
        setLoading(false);
        return;
      }

      if (!formData.fecha_hora) {
        showError('Debe seleccionar fecha y hora');
        setLoading(false);
        return;
      }

      if (!formData.motivo.trim()) {
        showError('Debe indicar el motivo de la consulta');
        setLoading(false);
        return;
      }

      // Validar que la fecha no sea en el pasado
      const selectedDate = new Date(formData.fecha_hora);
      const now = new Date();
      if (selectedDate < now) {
        showError('La fecha y hora no puede ser en el pasado');
        setLoading(false);
        return;
      }

      // Crear la cita (estado pendiente por defecto en el backend)
      await citasAPI.create({
        mascota: parseInt(formData.mascota),
        veterinario: parseInt(formData.veterinario),
        fecha_hora: formData.fecha_hora,
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      });

      success('Cita solicitada exitosamente. El veterinario la revisará pronto.');

      // Resetear formulario
      setFormData({
        mascota: '',
        veterinario: '',
        fecha_hora: '',
        motivo: '',
        observaciones: '',
      });
    } catch (err) {
      console.error('Error al solicitar cita:', err);
      const errorMsg =
        err.response?.data?.error || 'Error al solicitar la cita. Por favor, intente nuevamente.';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha y hora mínima (ahora + 1 hora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  if (loadingData) {
    return (
      <div className="loading-container">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (mascotas.length === 0) {
    return (
      <div className="no-data-container">
        <h2>Solicitar Cita</h2>
        <div className="alert alert-info">
          <p>No tienes mascotas registradas.</p>
          <p>Por favor, registra una mascota primero para poder solicitar una cita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitar-cita-container">
      <div className="page-header">
        <h2>Solicitar Cita Veterinaria</h2>
        <p>Complete el formulario para solicitar una cita para su mascota</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="cita-form">
          {/* Seleccionar Mascota */}
          <div className="form-group">
            <label htmlFor="mascota">
              Mascota <span className="required">*</span>
            </label>
            <select
              id="mascota"
              name="mascota"
              value={formData.mascota}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccione una mascota</option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre} - {mascota.especie} ({mascota.raza})
                </option>
              ))}
            </select>
          </div>

          {/* Seleccionar Veterinario */}
          <div className="form-group">
            <label htmlFor="veterinario">
              Veterinario <span className="required">*</span>
            </label>
            <select
              id="veterinario"
              name="veterinario"
              value={formData.veterinario}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccione un veterinario</option>
              {veterinarios.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  Dr(a). {vet.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="form-group">
            <label htmlFor="fecha_hora">
              Fecha y Hora <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="fecha_hora"
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleChange}
              min={getMinDateTime()}
              required
              disabled={loading}
            />
            <small>Seleccione la fecha y hora deseada para la consulta</small>
          </div>

          {/* Motivo de la Consulta */}
          <div className="form-group">
            <label htmlFor="motivo">
              Motivo de la Consulta <span className="required">*</span>
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows="4"
              required
              disabled={loading}
              placeholder="Ej: Control de rutina, vacunación, problema de salud..."
            />
            <small>Describa brevemente el motivo de la consulta</small>
          </div>

          {/* Observaciones (CAMPO IMPORTANTE) */}
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones Adicionales</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              placeholder="Síntomas, comportamiento, dudas o información adicional que el veterinario deba conocer..."
            />
            <small>
              <strong>Importante:</strong> El veterinario verá estas observaciones al revisar la
              cita
            </small>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Solicitando...' : 'Solicitar Cita'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setFormData({
                  mascota: '',
                  veterinario: '',
                  fecha_hora: '',
                  motivo: '',
                  observaciones: '',
                })
              }
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Información Adicional */}
        <div className="info-box">
          <h3>Información Importante</h3>
          <ul>
            <li>La cita quedará en estado PENDIENTE hasta que el veterinario la confirme</li>
            <li>Recibirá una notificación cuando su cita sea confirmada o pospuesta</li>
            <li>Puede ver el estado de sus citas en la sección "Mis Citas"</li>
            <li>
              Si necesita cancelar, puede hacerlo desde "Mis Citas" hasta 24 horas antes de la
              consulta
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SolicitarCita;
