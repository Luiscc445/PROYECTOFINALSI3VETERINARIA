/**
 * Modelo Movimiento de Inventario (InventoryMovement)
 * Arquitectura MVC - Capa de Modelos
 */

class InventoryMovement {
  constructor(data = {}) {
    this.id = data.id || null;
    this.inventario = data.inventario || null;
    this.inventario_nombre = data.inventario_nombre || '';
    this.usuario = data.usuario || null;
    this.usuario_nombre = data.usuario_nombre || '';
    this.tipo_movimiento = data.tipo_movimiento || '';
    this.cantidad = data.cantidad || 0;
    this.motivo = data.motivo || '';
    this.fecha = data.fecha || '';
  }

  static fromJSON(json) {
    return new InventoryMovement(json);
  }

  toJSON() {
    return {
      id: this.id,
      inventario: this.inventario,
      usuario: this.usuario,
      tipo_movimiento: this.tipo_movimiento,
      cantidad: this.cantidad,
      motivo: this.motivo
    };
  }

  isEntry() {
    return this.tipo_movimiento === 'entrada';
  }

  isExit() {
    return this.tipo_movimiento === 'salida';
  }

  isAdjustment() {
    return this.tipo_movimiento === 'ajuste';
  }
}

export default InventoryMovement;
