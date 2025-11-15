"""
Controller para el modelo Mascota.
Arquitectura MVC - Capa de Controladores
"""
from api.models import Mascota


class MascotaController:
    """
    Controlador para la lógica de negocio de Mascotas.
    """

    @staticmethod
    def get_all_pets(filters=None):
        """Obtiene todas las mascotas con filtros opcionales"""
        queryset = Mascota.objects.select_related('tutor__usuario').all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_pet_by_id(pet_id):
        """Obtiene una mascota por ID"""
        return Mascota.objects.select_related('tutor__usuario').get(id=pet_id)

    @staticmethod
    def get_pet_complete_history(pet_id):
        """Obtiene el historial completo de una mascota"""
        return Mascota.objects.prefetch_related(
            'historiales',
            'citas'
        ).select_related('tutor__usuario').get(id=pet_id)

    @staticmethod
    def create_pet(data):
        """Crea una nueva mascota"""
        return Mascota.objects.create(**data)

    @staticmethod
    def update_pet(pet_id, data):
        """Actualiza una mascota existente"""
        pet = Mascota.objects.get(id=pet_id)
        for key, value in data.items():
            setattr(pet, key, value)
        pet.save()
        return pet

    @staticmethod
    def delete_pet(pet_id):
        """Elimina una mascota (soft delete)"""
        pet = Mascota.objects.get(id=pet_id)
        pet.activo = False
        pet.save()
        return pet
