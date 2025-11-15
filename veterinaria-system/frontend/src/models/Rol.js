/**
 * Modelo Rol
 * Arquitectura MVC - Capa de Modelos
 */

class Rol {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.created_at = data.created_at || null;
  }

  static fromJSON(json) {
    return new Rol(json);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion
    };
  }
}

export default Rol;
