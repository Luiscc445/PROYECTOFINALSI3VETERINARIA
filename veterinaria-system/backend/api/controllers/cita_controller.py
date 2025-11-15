"""
Controller para el modelo Cita.
Arquitectura MVC - Capa de Controladores
SISTEMA COMPLETO DE CITAS - NO SIMULADO
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

    @staticmethod
    def posponer_cita(appointment_id, nueva_fecha_hora):
        """
        Pospone una cita cambiando su fecha/hora y volviendo a estado pendiente.

        Args:
            appointment_id: ID de la cita
            nueva_fecha_hora: Nueva fecha y hora (datetime object)

        Returns:
            Cita actualizada
        """
        appointment = Cita.objects.get(id=appointment_id)
        appointment.fecha_hora = nueva_fecha_hora
        appointment.estado = 'pendiente'  # Vuelve a pendiente al posponer
        appointment.save()
        return appointment

    @staticmethod
    def get_citas_by_veterinario(veterinario_id, filters=None):
        """
        Obtiene todas las citas de un veterinario específico.
        IMPORTANTE: Filtrar por ID, NO por nombre.

        Args:
            veterinario_id: ID del veterinario
            filters: Filtros adicionales opcionales

        Returns:
            QuerySet de citas del veterinario
        """
        queryset = Cita.objects.filter(
            veterinario_id=veterinario_id  # Usar ID, no nombre!
        ).select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).order_by('-fecha_hora')

        if filters:
            queryset = queryset.filter(**filters)

        return queryset

    @staticmethod
    def get_citas_by_tutor(tutor_id, filters=None):
        """
        Obtiene todas las citas de las mascotas de un tutor.

        Args:
            tutor_id: ID del tutor
            filters: Filtros adicionales opcionales

        Returns:
            QuerySet de citas del tutor
        """
        queryset = Cita.objects.filter(
            mascota__tutor_id=tutor_id
        ).select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).order_by('-fecha_hora')

        if filters:
            queryset = queryset.filter(**filters)

        return queryset

    @staticmethod
    def get_citas_pendientes_veterinario(veterinario_id):
        """
        Obtiene solo las citas PENDIENTES de un veterinario.
        Para mostrar en la sección destacada del VetHome.

        Args:
            veterinario_id: ID del veterinario

        Returns:
            QuerySet de citas pendientes
        """
        return Cita.objects.filter(
            veterinario_id=veterinario_id,
            estado='pendiente'
        ).select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).order_by('fecha_hora')

    @staticmethod
    def aceptar_cita(appointment_id):
        """
        Acepta una cita cambiando su estado a 'confirmada'.

        Args:
            appointment_id: ID de la cita

        Returns:
            Cita actualizada
        """
        return CitaController.change_appointment_status(appointment_id, 'confirmada')

    @staticmethod
    def cancelar_cita(appointment_id):
        """
        Cancela una cita cambiando su estado a 'cancelada'.

        Args:
            appointment_id: ID de la cita

        Returns:
            Cita actualizada
        """
        return CitaController.change_appointment_status(appointment_id, 'cancelada')

    @staticmethod
    def completar_cita(appointment_id):
        """
        Completa una cita cambiando su estado a 'completada'.
        Se usa después de crear el historial médico.

        Args:
            appointment_id: ID de la cita

        Returns:
            Cita actualizada
        """
        return CitaController.change_appointment_status(appointment_id, 'completada')
