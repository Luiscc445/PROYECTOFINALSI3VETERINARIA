"""
Controller para el modelo MovimientoInventario.
Arquitectura MVC - Capa de Controladores
"""
from api.models import MovimientoInventario


class MovimientoInventarioController:
    """
    Controlador para la lógica de negocio de Movimientos de Inventario.
    """

    @staticmethod
    def get_all_movements(filters=None):
        """Obtiene todos los movimientos con filtros opcionales"""
        queryset = MovimientoInventario.objects.select_related(
            'inventario',
            'usuario'
        ).all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_movement_by_id(movement_id):
        """Obtiene un movimiento por ID"""
        return MovimientoInventario.objects.select_related(
            'inventario',
            'usuario'
        ).get(id=movement_id)

    @staticmethod
    def get_product_movements(product_id):
        """Obtiene todos los movimientos de un producto"""
        return MovimientoInventario.objects.filter(
            inventario_id=product_id
        ).select_related('usuario').order_by('-fecha')
