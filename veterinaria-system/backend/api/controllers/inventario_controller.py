"""
Controller para el modelo Inventario.
Arquitectura MVC - Capa de Controladores
"""
from django.db import models
from api.models import Inventario, MovimientoInventario, Usuario


class InventarioController:
    """
    Controlador para la lógica de negocio de Inventario.
    """

    @staticmethod
    def get_all_products(filters=None):
        """Obtiene todos los productos con filtros opcionales"""
        queryset = Inventario.objects.all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_product_by_id(product_id):
        """Obtiene un producto por ID"""
        return Inventario.objects.get(id=product_id)

    @staticmethod
    def get_low_stock_products():
        """Obtiene productos con stock bajo o igual al mínimo"""
        return Inventario.objects.filter(
            cantidad__lte=models.F('stock_minimo'),
            activo=True
        )

    @staticmethod
    def get_medicamentos():
        """
        Obtiene solo medicamentos del inventario (para recetas).
        Filtra por categoría 'medicamento' y activos.
        """
        return Inventario.objects.filter(
            categoria='medicamento',
            activo=True
        ).order_by('nombre')

    @staticmethod
    def create_product(data):
        """Crea un nuevo producto"""
        return Inventario.objects.create(**data)

    @staticmethod
    def update_product(product_id, data):
        """Actualiza un producto existente"""
        product = Inventario.objects.get(id=product_id)
        for key, value in data.items():
            setattr(product, key, value)
        product.save()
        return product

    @staticmethod
    def delete_product(product_id):
        """Elimina un producto (soft delete)"""
        product = Inventario.objects.get(id=product_id)
        product.activo = False
        product.save()
        return product

    @staticmethod
    def register_movement(product_id, movement_type, quantity, reason, user_id):
        """
        Registra un movimiento de inventario y actualiza el stock.

        Args:
            product_id: ID del producto
            movement_type: 'entrada', 'salida' o 'ajuste'
            quantity: Cantidad del movimiento
            reason: Motivo del movimiento
            user_id: ID del usuario que realiza el movimiento

        Returns:
            dict: Diccionario con el resultado del movimiento
        """
        # Validar tipo de movimiento
        valid_types = ['entrada', 'salida', 'ajuste']
        if movement_type not in valid_types:
            raise ValueError(f'Tipo de movimiento inválido. Debe ser uno de: {valid_types}')

        # Obtener producto y usuario
        product = Inventario.objects.get(id=product_id)
        user = Usuario.objects.get(id=user_id)

        # Actualizar stock según tipo de movimiento
        if movement_type == 'entrada':
            product.cantidad += quantity
        elif movement_type == 'salida':
            if product.cantidad < quantity:
                raise ValueError(f'Stock insuficiente. Disponible: {product.cantidad}')
            product.cantidad -= quantity
        elif movement_type == 'ajuste':
            product.cantidad = quantity

        product.save()

        # Crear registro de movimiento
        movement = MovimientoInventario.objects.create(
            inventario=product,
            usuario=user,
            tipo_movimiento=movement_type,
            cantidad=quantity,
            motivo=reason
        )

        return {
            'success': True,
            'message': 'Movimiento registrado exitosamente',
            'stock_actual': product.cantidad,
            'movimiento_id': movement.id
        }
