"""
Serializer para el modelo Usuario.
Arquitectura MVC - Capa de Serialización
"""
from rest_framework import serializers
from api.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password_hash', 'nombre_completo',
            'telefono', 'rol', 'rol_nombre', 'activo',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password_hash': {'write_only': True}
        }


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar usuarios"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre_completo', 'telefono', 'rol_nombre', 'activo']
