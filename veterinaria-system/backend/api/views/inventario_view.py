"""
ViewSet para el modelo Inventario.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.controllers import InventarioController
from api.serializers import InventarioSerializer


class InventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar inventario.
    Endpoints:
    - GET /api/inventario/
    - POST /api/inventario/
    - GET /api/inventario/{id}/
    - PUT /api/inventario/{id}/
    - DELETE /api/inventario/{id}/
    - GET /api/inventario/bajo_stock/ (custom action)
    - POST /api/inventario/{id}/registrar_movimiento/ (custom action)
    """
    serializer_class = InventarioSerializer
    filterset_fields = ['categoria', 'activo', 'codigo']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return InventarioController.get_all_products()

    @action(detail=False, methods=['get'])
    def bajo_stock(self, request):
        """
        Retorna productos con stock bajo o igual al mínimo.
        GET /api/inventario/bajo_stock/
        """
        products = InventarioController.get_low_stock_products()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def registrar_movimiento(self, request, pk=None):
        """
        Registra un movimiento de inventario y actualiza el stock.
        POST /api/inventario/{id}/registrar_movimiento/
        Body: {
            "tipo_movimiento": "entrada|salida|ajuste",
            "cantidad": 10,
            "motivo": "Razón del movimiento",
            "usuario_id": 1
        }
        """
        tipo_movimiento = request.data.get('tipo_movimiento')
        cantidad = request.data.get('cantidad')
        motivo = request.data.get('motivo')
        usuario_id = request.data.get('usuario_id')

        # Validaciones básicas
        if not all([tipo_movimiento, cantidad, motivo, usuario_id]):
            return Response(
                {'error': 'Todos los campos son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cantidad = int(cantidad)
            result = InventarioController.register_movement(
                product_id=pk,
                movement_type=tipo_movimiento,
                quantity=cantidad,
                reason=motivo,
                user_id=usuario_id
            )
            return Response(result)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Datos inválidos'},
                status=status.HTTP_400_BAD_REQUEST
            )
