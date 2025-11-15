"""
Serializer para HistorialMedico - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import HistorialMedico


class HistorialMedicoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo HistorialMedico"""
    mascota_nombre = serializers.CharField(source='mascota.nombre', read_only=True)
    veterinario_nombre = serializers.CharField(source='veterinario.nombre_completo', read_only=True)

    class Meta:
        model = HistorialMedico
        fields = [
            'id', 'mascota', 'mascota_nombre', 'veterinario',
            'veterinario_nombre', 'fecha', 'tipo', 'diagnostico',
            'tratamiento', 'medicamentos', 'peso_kg', 'temperatura_c',
            'observaciones', 'proxima_visita', 'created_at'
        ]
