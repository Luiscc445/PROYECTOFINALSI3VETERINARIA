"""
Controller para Inventario - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from ..models import Inventario, MovimientoInventario
from ..serializers import InventarioSerializer


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
    - GET /api/inventario/medicamentos/ (custom action)
    - POST /api/inventario/{id}/registrar_movimiento/ (custom action)
    """
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    filterset_fields = ['categoria', 'activo', 'codigo']

    @action(detail=False, methods=['get'])
    def bajo_stock(self, request):
        """
        Retorna productos con stock bajo o igual al mínimo.
        GET /api/inventario/bajo_stock/
        """
        productos = self.queryset.filter(
            cantidad__lte=models.F('stock_minimo'),
            activo=True
        )
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def medicamentos(self, request):
        """
        Retorna solo los productos de categoría medicamento.
        GET /api/inventario/medicamentos/
        """
        medicamentos = self.queryset.filter(
            categoria='medicamento',
            activo=True
        ).order_by('nombre')
        serializer = self.get_serializer(medicamentos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def registrar_movimiento(self, request, pk=None):
        """
        Registra un movimiento de inventario y actualiza el stock.
        POST /api/inventario/{id}/registrar_movimiento/
        Body: {
            "tipo_movimiento": "entrada|salida|ajuste",
            "cantidad": 10,
            "motivo": "Razón del movimiento"
        }
        """
        inventario = self.get_object()
        tipo_movimiento = request.data.get('tipo_movimiento')
        cantidad = request.data.get('cantidad')
        motivo = request.data.get('motivo')

        # Obtener usuario de la sesión (request.user viene del authentication personalizado)
        usuario = request.user

        # Validaciones
        if not all([tipo_movimiento, cantidad, motivo]):
            return Response(
                {'error': 'Todos los campos son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cantidad = int(cantidad)
        except ValueError:
            return Response(
                {'error': 'Cantidad debe ser un número válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizar stock según tipo de movimiento
        if tipo_movimiento == 'entrada':
            inventario.cantidad += cantidad
        elif tipo_movimiento == 'salida':
            if inventario.cantidad < cantidad:
                return Response(
                    {'error': f'Stock insuficiente. Disponible: {inventario.cantidad}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            inventario.cantidad -= cantidad
        elif tipo_movimiento == 'ajuste':
            inventario.cantidad = cantidad
        else:
            return Response(
                {'error': 'Tipo de movimiento inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        inventario.save()

        # Crear registro de movimiento
        movimiento = MovimientoInventario.objects.create(
            inventario=inventario,
            usuario=usuario,
            tipo_movimiento=tipo_movimiento,
            cantidad=cantidad,
            motivo=motivo
        )

        return Response({
            'mensaje': 'Movimiento registrado exitosamente',
            'stock_actual': inventario.cantidad,
            'movimiento_id': movimiento.id
        })
