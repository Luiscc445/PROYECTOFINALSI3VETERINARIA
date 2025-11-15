"""
Serializer para el modelo Rol.
Arquitectura MVC - Capa de Serialización
"""
from rest_framework import serializers
from api.models import Rol


class RolSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Rol"""

    class Meta:
        model = Rol
        fields = '__all__'
