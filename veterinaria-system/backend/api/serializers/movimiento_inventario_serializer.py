"""
Serializer para MovimientoInventario - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import MovimientoInventario


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo MovimientoInventario"""
    inventario_nombre = serializers.CharField(source='inventario.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'id', 'inventario', 'inventario_nombre', 'usuario',
            'usuario_nombre', 'tipo_movimiento', 'cantidad',
            'motivo', 'fecha'
        ]
        read_only_fields = ['fecha']

    def validate(self, data):
        """Valida que haya suficiente stock para salidas"""
        if data.get('tipo_movimiento') == 'salida':
            inventario = data.get('inventario')
            cantidad = data.get('cantidad')
            if inventario.cantidad < cantidad:
                raise serializers.ValidationError(
                    f"No hay suficiente stock. Disponible: {inventario.cantidad}"
                )
        return data
