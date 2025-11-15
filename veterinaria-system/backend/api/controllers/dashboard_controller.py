"""
Controller para Dashboard - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from ..models import Mascota, Tutor, Cita, Inventario


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet para estadísticas del dashboard.
    Endpoints:
    - GET /api/dashboard/estadisticas/
    """

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Retorna estadísticas generales del sistema.
        GET /api/dashboard/estadisticas/
        """
        hoy = timezone.now().date()

        estadisticas = {
            'total_mascotas': Mascota.objects.filter(activo=True).count(),
            'total_tutores': Tutor.objects.count(),
            'citas_pendientes': Cita.objects.filter(
                estado='pendiente'
            ).count(),
            'citas_hoy': Cita.objects.filter(
                fecha_hora__date=hoy
            ).count(),
            'total_productos': Inventario.objects.count(),
            'productos_bajo_stock': Inventario.objects.filter(
                cantidad__lte=models.F('stock_minimo')
            ).count()
        }

        return Response(estadisticas)
