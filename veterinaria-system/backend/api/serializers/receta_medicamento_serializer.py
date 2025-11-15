"""
Serializer para el modelo RecetaMedicamento.
Arquitectura MVC - Capa de Serialización
"""
from rest_framework import serializers
from api.models import RecetaMedicamento


class RecetaMedicamentoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo RecetaMedicamento"""
    medicamento_nombre = serializers.CharField(source='medicamento.nombre', read_only=True)
    historial_id = serializers.IntegerField(source='historial.id', read_only=True)

    class Meta:
        model = RecetaMedicamento
        fields = [
            'id', 'historial', 'historial_id', 'medicamento',
            'medicamento_nombre', 'dosis', 'frecuencia',
            'duracion_dias', 'instrucciones', 'created_at'
        ]
        read_only_fields = ['created_at']
