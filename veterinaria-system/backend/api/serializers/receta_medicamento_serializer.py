"""
Serializer para RecetaMedicamento - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import RecetaMedicamento


class RecetaMedicamentoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo RecetaMedicamento"""
    medicamento_nombre = serializers.CharField(source='medicamento.nombre', read_only=True)
    mascota_nombre = serializers.CharField(source='historial_medico.mascota.nombre', read_only=True)

    class Meta:
        model = RecetaMedicamento
        fields = [
            'id', 'historial_medico', 'medicamento', 'medicamento_nombre',
            'mascota_nombre', 'dosis', 'frecuencia', 'duracion',
            'instrucciones', 'cantidad_total', 'created_at'
        ]
        read_only_fields = ['created_at']

    def validate_cantidad_total(self, value):
        """Valida que la cantidad total sea positiva"""
        if value <= 0:
            raise serializers.ValidationError("La cantidad total debe ser mayor a 0")
        return value
