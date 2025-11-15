/**
 * Modelo Mascota (Pet)
 * Arquitectura MVC - Capa de Modelos
 */

class Pet {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tutor = data.tutor || null;
    this.tutor_nombre = data.tutor_nombre || '';
    this.nombre = data.nombre || '';
    this.especie = data.especie || '';
    this.raza = data.raza || '';
    this.fecha_nacimiento = data.fecha_nacimiento || '';
    this.edad_anos = data.edad_anos || null;
    this.sexo = data.sexo || '';
    this.color = data.color || '';
    this.peso_kg = data.peso_kg || '';
    this.foto_url = data.foto_url || null;
    this.activo = data.activo !== undefined ? data.activo : true;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromJSON(json) {
    return new Pet(json);
  }

  toJSON() {
    return {
      id: this.id,
      tutor: this.tutor,
      nombre: this.nombre,
      especie: this.especie,
      raza: this.raza,
      fecha_nacimiento: this.fecha_nacimiento,
      sexo: this.sexo,
      color: this.color,
      peso_kg: this.peso_kg,
      activo: this.activo
    };
  }
}

export default Pet;
