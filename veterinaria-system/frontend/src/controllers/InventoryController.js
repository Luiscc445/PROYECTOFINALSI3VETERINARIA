/**
 * Controller para Inventario
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../services/api';
import { Inventory } from '../models';

class InventoryController {
  /**
   * Obtiene todos los productos del inventario
   * @returns {Promise<Inventory[]>} Lista de productos
   */
  static async getAll() {
    try {
      const response = await api.get('/inventario/');
      return response.data.map(item => Inventory.fromJSON(item));
    } catch (error) {
      throw new Error('Error al obtener inventario');
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Inventory>} Producto
   */
  static async getById(id) {
    try {
      const response = await api.get(`/inventario/${id}/`);
      return Inventory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener producto');
    }
  }

  /**
   * Obtiene productos con stock bajo
   * @returns {Promise<Inventory[]>} Lista de productos con stock bajo
   */
  static async getLowStock() {
    try {
      const response = await api.get('/inventario/bajo_stock/');
      return response.data.map(item => Inventory.fromJSON(item));
    } catch (error) {
      throw new Error('Error al obtener productos con stock bajo');
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Inventory>} Producto creado
   */
  static async create(productData) {
    try {
      const response = await api.post('/inventario/', productData);
      return Inventory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear producto');
    }
  }

  /**
   * Actualiza un producto
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos actualizados
   * @returns {Promise<Inventory>} Producto actualizado
   */
  static async update(id, productData) {
    try {
      const response = await api.put(`/inventario/${id}/`, productData);
      return Inventory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar producto');
    }
  }

  /**
   * Registra un movimiento de inventario
   * @param {number} productId - ID del producto
   * @param {Object} movementData - Datos del movimiento
   * @returns {Promise<Object>} Resultado del movimiento
   */
  static async registerMovement(productId, movementData) {
    try {
      const response = await api.post(`/inventario/${productId}/registrar_movimiento/`, movementData);
      return response.data;
    } catch (error) {
      throw new Error('Error al registrar movimiento');
    }
  }

  /**
   * Elimina un producto (soft delete)
   * @param {number} id - ID del producto
   */
  static async delete(id) {
    try {
      await api.delete(`/inventario/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar producto');
    }
  }
}

export default InventoryController;
