/**
 * Controller para Dashboard
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../models/api';

class DashboardController {
  /**
   * Obtiene las estadísticas generales del sistema
   * @returns {Promise<Object>} Estadísticas
   */
  static async getStatistics() {
    try {
      const response = await api.get('/dashboard/estadisticas/');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener estadísticas');
    }
  }
}

export default DashboardController;
