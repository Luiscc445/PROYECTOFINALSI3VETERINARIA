"""
Serializer para el modelo Tutor.
Arquitectura MVC - Capa de Serialización
"""
from rest_framework import serializers
from api.models import Tutor, Usuario
from .usuario_serializer import UsuarioSerializer


class TutorSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Tutor"""
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuario',
        write_only=True
    )
    edad = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tutor
        fields = [
            'id', 'usuario', 'usuario_id', 'ci', 'direccion',
            'fecha_nacimiento', 'edad', 'created_at', 'updated_at'
        ]


class TutorListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar tutores"""
    nombre_completo = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    telefono = serializers.CharField(source='usuario.telefono', read_only=True)

    class Meta:
        model = Tutor
        fields = ['id', 'nombre_completo', 'email', 'telefono', 'ci', 'direccion']
