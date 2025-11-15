"""
Serializer para Cita - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import Cita


class CitaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Cita"""
    mascota_nombre = serializers.CharField(source='mascota.nombre', read_only=True)
    veterinario_nombre = serializers.CharField(source='veterinario.nombre_completo', read_only=True)
    tutor_nombre = serializers.CharField(source='mascota.tutor.usuario.nombre_completo', read_only=True)

    class Meta:
        model = Cita
        fields = [
            'id', 'mascota', 'mascota_nombre', 'veterinario',
            'veterinario_nombre', 'tutor_nombre', 'fecha_hora',
            'motivo', 'estado', 'observaciones', 'created_at', 'updated_at'
        ]

    def validate_fecha_hora(self, value):
        """Valida que la fecha de la cita sea futura"""
        from django.utils import timezone
        if value < timezone.now() and not self.instance:
            raise serializers.ValidationError("La fecha de la cita debe ser futura")
        return value
