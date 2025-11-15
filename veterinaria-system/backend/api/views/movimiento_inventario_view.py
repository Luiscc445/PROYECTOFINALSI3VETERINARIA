"""
ViewSet para el modelo MovimientoInventario.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from api.controllers import MovimientoInventarioController
from api.serializers import MovimientoInventarioSerializer


class MovimientoInventarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para movimientos de inventario.
    Endpoints:
    - GET /api/movimientos/
    - GET /api/movimientos/{id}/
    """
    serializer_class = MovimientoInventarioSerializer
    filterset_fields = ['inventario', 'usuario', 'tipo_movimiento']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return MovimientoInventarioController.get_all_movements()
