"""
Serializer para el modelo Inventario.
Arquitectura MVC - Capa de Serialización
"""
from rest_framework import serializers
from api.models import Inventario


class InventarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Inventario"""
    necesita_reposicion = serializers.BooleanField(read_only=True)

    class Meta:
        model = Inventario
        fields = [
            'id', 'codigo', 'nombre', 'categoria', 'descripcion',
            'cantidad', 'unidad_medida', 'precio_unitario',
            'stock_minimo', 'fecha_vencimiento', 'proveedor',
            'necesita_reposicion', 'activo', 'created_at', 'updated_at'
        ]

    def validate_cantidad(self, value):
        """Valida que la cantidad no sea negativa"""
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa")
        return value

    def validate_precio_unitario(self, value):
        """Valida que el precio sea positivo"""
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value
