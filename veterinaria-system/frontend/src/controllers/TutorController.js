/**
 * Controller para Tutores
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../services/api';
import { Tutor, Pet } from '../models';

class TutorController {
  /**
   * Obtiene todos los tutores
   * @returns {Promise<Tutor[]>} Lista de tutores
   */
  static async getAll() {
    try {
      const response = await api.get('/tutores/');
      return response.data.map(tutor => Tutor.fromJSON(tutor));
    } catch (error) {
      throw new Error('Error al obtener tutores');
    }
  }

  /**
   * Obtiene un tutor por ID
   * @param {number} id - ID del tutor
   * @returns {Promise<Tutor>} Tutor
   */
  static async getById(id) {
    try {
      const response = await api.get(`/tutores/${id}/`);
      return Tutor.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener tutor');
    }
  }

  /**
   * Obtiene las mascotas de un tutor
   * @param {number} tutorId - ID del tutor
   * @returns {Promise<Pet[]>} Lista de mascotas
   */
  static async getPets(tutorId) {
    try {
      const response = await api.get(`/tutores/${tutorId}/mascotas/`);
      return response.data.map(pet => Pet.fromJSON(pet));
    } catch (error) {
      throw new Error('Error al obtener mascotas del tutor');
    }
  }

  /**
   * Crea un nuevo tutor
   * @param {Object} tutorData - Datos del tutor
   * @returns {Promise<Tutor>} Tutor creado
   */
  static async create(tutorData) {
    try {
      const response = await api.post('/tutores/', tutorData);
      return Tutor.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear tutor');
    }
  }

  /**
   * Actualiza un tutor
   * @param {number} id - ID del tutor
   * @param {Object} tutorData - Datos actualizados
   * @returns {Promise<Tutor>} Tutor actualizado
   */
  static async update(id, tutorData) {
    try {
      const response = await api.put(`/tutores/${id}/`, tutorData);
      return Tutor.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar tutor');
    }
  }

  /**
   * Elimina un tutor
   * @param {number} id - ID del tutor
   */
  static async delete(id) {
    try {
      await api.delete(`/tutores/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar tutor');
    }
  }
}

export default TutorController;
