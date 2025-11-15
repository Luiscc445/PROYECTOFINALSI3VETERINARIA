/**
 * Modelo Tutor
 * Arquitectura MVC - Capa de Modelos
 */

class Tutor {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario = data.usuario || null;
    this.ci = data.ci || '';
    this.direccion = data.direccion || '';
    this.fecha_nacimiento = data.fecha_nacimiento || '';
    this.edad = data.edad || null;
    this.nombre_completo = data.nombre_completo || '';
    this.email = data.email || '';
    this.telefono = data.telefono || '';
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromJSON(json) {
    return new Tutor(json);
  }

  toJSON() {
    return {
      id: this.id,
      usuario_id: this.usuario,
      ci: this.ci,
      direccion: this.direccion,
      fecha_nacimiento: this.fecha_nacimiento
    };
  }
}

export default Tutor;
