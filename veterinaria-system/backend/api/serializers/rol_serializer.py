"""
Serializer para Rol - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import Rol


class RolSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Rol"""

    class Meta:
        model = Rol
        fields = '__all__'
