"""
Controller para el modelo Cita.
Arquitectura MVC - Capa de Controladores
"""
from django.utils import timezone
from datetime import timedelta
from api.models import Cita


class CitaController:
    """
    Controlador para la lógica de negocio de Citas.
    """

    @staticmethod
    def get_all_appointments(filters=None):
        """Obtiene todas las citas con filtros opcionales"""
        queryset = Cita.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_appointment_by_id(appointment_id):
        """Obtiene una cita por ID"""
        return Cita.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).get(id=appointment_id)

    @staticmethod
    def get_upcoming_appointments(days=7):
        """Obtiene las citas de los próximos N días"""
        now = timezone.now()
        end_date = now + timedelta(days=days)
        return Cita.objects.filter(
            fecha_hora__gte=now,
            fecha_hora__lte=end_date,
            estado__in=['pendiente', 'confirmada']
        ).select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).order_by('fecha_hora')

    @staticmethod
    def create_appointment(data):
        """Crea una nueva cita"""
        return Cita.objects.create(**data)

    @staticmethod
    def update_appointment(appointment_id, data):
        """Actualiza una cita existente"""
        appointment = Cita.objects.get(id=appointment_id)
        for key, value in data.items():
            setattr(appointment, key, value)
        appointment.save()
        return appointment

    @staticmethod
    def change_appointment_status(appointment_id, new_status):
        """Cambia el estado de una cita"""
        valid_statuses = ['pendiente', 'confirmada', 'completada', 'cancelada']
        if new_status not in valid_statuses:
            raise ValueError(f'Estado inválido. Debe ser uno de: {valid_statuses}')

        appointment = Cita.objects.get(id=appointment_id)
        appointment.estado = new_status
        appointment.save()
        return appointment

    @staticmethod
    def delete_appointment(appointment_id):
        """Elimina una cita"""
        appointment = Cita.objects.get(id=appointment_id)
        appointment.delete()
