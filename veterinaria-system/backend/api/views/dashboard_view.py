"""
ViewSet para el Dashboard.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.controllers import DashboardController


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
        statistics = DashboardController.get_statistics()
        return Response(statistics)
