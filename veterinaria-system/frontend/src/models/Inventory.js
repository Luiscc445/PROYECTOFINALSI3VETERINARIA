/**
 * Modelo Inventario (Inventory)
 * Arquitectura MVC - Capa de Modelos
 */

class Inventory {
  constructor(data = {}) {
    this.id = data.id || null;
    this.codigo = data.codigo || '';
    this.nombre = data.nombre || '';
    this.categoria = data.categoria || '';
    this.descripcion = data.descripcion || '';
    this.cantidad = data.cantidad || 0;
    this.unidad_medida = data.unidad_medida || '';
    this.precio_unitario = data.precio_unitario || 0;
    this.stock_minimo = data.stock_minimo || 0;
    this.fecha_vencimiento = data.fecha_vencimiento || null;
    this.proveedor = data.proveedor || '';
    this.necesita_reposicion = data.necesita_reposicion || false;
    this.activo = data.activo !== undefined ? data.activo : true;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromJSON(json) {
    return new Inventory(json);
  }

  toJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre,
      categoria: this.categoria,
      descripcion: this.descripcion,
      cantidad: this.cantidad,
      unidad_medida: this.unidad_medida,
      precio_unitario: this.precio_unitario,
      stock_minimo: this.stock_minimo,
      fecha_vencimiento: this.fecha_vencimiento,
      proveedor: this.proveedor,
      activo: this.activo
    };
  }

  needsRestock() {
    return this.necesita_reposicion;
  }
}

export default Inventory;
