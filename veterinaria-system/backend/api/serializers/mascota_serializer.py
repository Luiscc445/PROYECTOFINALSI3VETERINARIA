"""
Serializer para Mascota - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import Mascota


class MascotaSerializer(serializers.ModelSerializer):
    """Serializer completo para el modelo Mascota"""
    tutor_nombre = serializers.CharField(source='tutor.usuario.nombre_completo', read_only=True)
    edad_anos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Mascota
        fields = [
            'id', 'tutor', 'tutor_nombre', 'nombre', 'especie', 'raza',
            'fecha_nacimiento', 'edad_anos', 'sexo', 'color', 'peso_kg',
            'foto_url', 'activo', 'created_at', 'updated_at'
        ]

    def validate_peso_kg(self, value):
        """Valida que el peso sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El peso debe ser mayor a 0")
        return value


class MascotaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar mascotas"""
    tutor_nombre = serializers.CharField(source='tutor.usuario.nombre_completo', read_only=True)
    edad_anos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Mascota
        fields = [
            'id', 'nombre', 'especie', 'raza', 'edad_anos',
            'sexo', 'tutor_nombre', 'activo'
        ]


class MascotaHistorialCompletoSerializer(serializers.ModelSerializer):
    """Serializer con historial completo de la mascota"""
    from .cita_serializer import CitaSerializer
    from .historial_medico_serializer import HistorialMedicoSerializer

    tutor_nombre = serializers.CharField(source='tutor.usuario.nombre_completo', read_only=True)
    edad_anos = serializers.IntegerField(read_only=True)
    historiales = HistorialMedicoSerializer(many=True, read_only=True)
    citas = CitaSerializer(many=True, read_only=True)

    class Meta:
        model = Mascota
        fields = [
            'id', 'nombre', 'especie', 'raza', 'fecha_nacimiento',
            'edad_anos', 'sexo', 'color', 'peso_kg', 'foto_url',
            'tutor_nombre', 'historiales', 'citas'
        ]
