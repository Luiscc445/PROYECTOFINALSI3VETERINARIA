"""
Controller para el modelo Tutor.
Arquitectura MVC - Capa de Controladores
"""
from api.models import Tutor


class TutorController:
    """
    Controlador para la lógica de negocio de Tutores.
    """

    @staticmethod
    def get_all_tutors():
        """Obtiene todos los tutores"""
        return Tutor.objects.select_related('usuario').all()

    @staticmethod
    def get_tutor_by_id(tutor_id):
        """Obtiene un tutor por ID"""
        return Tutor.objects.select_related('usuario').get(id=tutor_id)

    @staticmethod
    def get_tutor_by_ci(ci):
        """Obtiene un tutor por cédula de identidad"""
        return Tutor.objects.filter(ci=ci).select_related('usuario').first()

    @staticmethod
    def get_tutor_pets(tutor_id):
        """Obtiene todas las mascotas de un tutor"""
        tutor = Tutor.objects.get(id=tutor_id)
        return tutor.mascotas.filter(activo=True)

    @staticmethod
    def create_tutor(data):
        """Crea un nuevo tutor"""
        return Tutor.objects.create(**data)

    @staticmethod
    def update_tutor(tutor_id, data):
        """Actualiza un tutor existente"""
        tutor = Tutor.objects.get(id=tutor_id)
        for key, value in data.items():
            setattr(tutor, key, value)
        tutor.save()
        return tutor

    @staticmethod
    def delete_tutor(tutor_id):
        """Elimina un tutor"""
        tutor = Tutor.objects.get(id=tutor_id)
        tutor.delete()
