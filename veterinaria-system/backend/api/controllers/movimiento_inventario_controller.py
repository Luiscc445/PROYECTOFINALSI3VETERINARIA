"""
Controller para MovimientoInventario - Arquitectura MVC
"""
from rest_framework import viewsets
from ..models import MovimientoInventario
from ..serializers import MovimientoInventarioSerializer


class MovimientoInventarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para movimientos de inventario.
    Endpoints:
    - GET /api/movimientos/
    - GET /api/movimientos/{id}/
    """
    queryset = MovimientoInventario.objects.select_related(
        'inventario',
        'usuario'
    ).all()
    serializer_class = MovimientoInventarioSerializer
    filterset_fields = ['inventario', 'usuario', 'tipo_movimiento']
