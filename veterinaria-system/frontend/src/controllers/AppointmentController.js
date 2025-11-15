/**
 * Controller para Citas
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../models/api';
import { Appointment } from '../models';

class AppointmentController {
  /**
   * Obtiene todas las citas
   * @returns {Promise<Appointment[]>} Lista de citas
   */
  static async getAll() {
    try {
      const response = await api.get('/citas/');
      return response.data.map(appointment => Appointment.fromJSON(appointment));
    } catch (error) {
      throw new Error('Error al obtener citas');
    }
  }

  /**
   * Obtiene una cita por ID
   * @param {number} id - ID de la cita
   * @returns {Promise<Appointment>} Cita
   */
  static async getById(id) {
    try {
      const response = await api.get(`/citas/${id}/`);
      return Appointment.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener cita');
    }
  }

  /**
   * Obtiene las citas próximas (7 días)
   * @returns {Promise<Appointment[]>} Lista de citas próximas
   */
  static async getUpcoming() {
    try {
      const response = await api.get('/citas/proximas/');
      return response.data.map(appointment => Appointment.fromJSON(appointment));
    } catch (error) {
      throw new Error('Error al obtener citas próximas');
    }
  }

  /**
   * Crea una nueva cita
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Appointment>} Cita creada
   */
  static async create(appointmentData) {
    try {
      const response = await api.post('/citas/', appointmentData);
      return Appointment.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear cita');
    }
  }

  /**
   * Actualiza una cita
   * @param {number} id - ID de la cita
   * @param {Object} appointmentData - Datos actualizados
   * @returns {Promise<Appointment>} Cita actualizada
   */
  static async update(id, appointmentData) {
    try {
      const response = await api.put(`/citas/${id}/`, appointmentData);
      return Appointment.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar cita');
    }
  }

  /**
   * Cambia el estado de una cita
   * @param {number} id - ID de la cita
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<Appointment>} Cita actualizada
   */
  static async changeStatus(id, newStatus) {
    try {
      const response = await api.post(`/citas/${id}/cambiar_estado/`, {
        estado: newStatus
      });
      return Appointment.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al cambiar estado de cita');
    }
  }

  /**
   * Elimina una cita
   * @param {number} id - ID de la cita
   */
  static async delete(id) {
    try {
      await api.delete(`/citas/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar cita');
    }
  }
}

export default AppointmentController;
