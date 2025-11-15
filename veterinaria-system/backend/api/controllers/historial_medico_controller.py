"""
Controller para el modelo HistorialMedico.
Arquitectura MVC - Capa de Controladores
"""
from api.models import HistorialMedico


class HistorialMedicoController:
    """
    Controlador para la lógica de negocio de Historiales Médicos.
    """

    @staticmethod
    def get_all_medical_records(filters=None):
        """Obtiene todos los historiales médicos con filtros opcionales"""
        queryset = HistorialMedico.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_medical_record_by_id(record_id):
        """Obtiene un historial médico por ID"""
        return HistorialMedico.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).get(id=record_id)

    @staticmethod
    def get_pet_medical_history(pet_id):
        """Obtiene todo el historial médico de una mascota"""
        return HistorialMedico.objects.filter(
            mascota_id=pet_id
        ).select_related('veterinario').order_by('-fecha')

    @staticmethod
    def create_medical_record(data):
        """Crea un nuevo historial médico"""
        return HistorialMedico.objects.create(**data)

    @staticmethod
    def update_medical_record(record_id, data):
        """Actualiza un historial médico existente"""
        record = HistorialMedico.objects.get(id=record_id)
        for key, value in data.items():
            setattr(record, key, value)
        record.save()
        return record

    @staticmethod
    def delete_medical_record(record_id):
        """Elimina un historial médico"""
        record = HistorialMedico.objects.get(id=record_id)
        record.delete()
