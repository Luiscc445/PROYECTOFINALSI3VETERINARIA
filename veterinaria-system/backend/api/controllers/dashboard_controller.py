"""
Controller para el Dashboard.
Arquitectura MVC - Capa de Controladores
"""
from django.utils import timezone
from django.db import models
from api.models import Mascota, Tutor, Cita, Inventario


class DashboardController:
    """
    Controlador para la lógica de negocio del Dashboard.
    """

    @staticmethod
    def get_statistics():
        """
        Obtiene estadísticas generales del sistema.

        Returns:
            dict: Diccionario con las estadísticas
        """
        today = timezone.now().date()

        statistics = {
            'total_mascotas': Mascota.objects.filter(activo=True).count(),
            'total_tutores': Tutor.objects.count(),
            'citas_pendientes': Cita.objects.filter(estado='pendiente').count(),
            'citas_hoy': Cita.objects.filter(fecha_hora__date=today).count(),
            'productos_bajo_stock': Inventario.objects.filter(
                cantidad__lte=models.F('stock_minimo'),
                activo=True
            ).count()
        }

        return statistics

    @staticmethod
    def get_recent_appointments(limit=10):
        """Obtiene las citas recientes"""
        return Cita.objects.select_related(
            'mascota',
            'veterinario'
        ).order_by('-created_at')[:limit]

    @staticmethod
    def get_today_appointments():
        """Obtiene las citas del día actual"""
        today = timezone.now().date()
        return Cita.objects.filter(
            fecha_hora__date=today
        ).select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).order_by('fecha_hora')
