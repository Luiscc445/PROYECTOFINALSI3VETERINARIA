"""
Serializer para Usuario - Arquitectura MVC
"""
from rest_framework import serializers
from ..models import Usuario, Tutor
import bcrypt
from datetime import date


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer completo para el modelo Usuario"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    especialidad_display = serializers.CharField(source='get_especialidad_display', read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password_hash', 'password', 'nombre_completo',
            'telefono', 'rol', 'rol_nombre', 'especialidad',
            'especialidad_display', 'activo',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password_hash': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        """
        Crear usuario hasheando la contraseña con bcrypt.
        Si el rol es 'tutor', crea automáticamente el registro de Tutor.
        """
        password = validated_data.pop('password', None)

        if password:
            # Hashear la contraseña con bcrypt
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            validated_data['password_hash'] = hashed.decode('utf-8')

        usuario = super().create(validated_data)

        # Si el rol es 'tutor', crear automáticamente el registro de Tutor
        if usuario.rol and usuario.rol.nombre == 'tutor':
            # Crear Tutor con valores por defecto que el usuario puede actualizar después
            # Generar un CI temporal único basado en el ID del usuario
            ci_temporal = f'TEMP-{usuario.id:06d}'
            Tutor.objects.create(
                usuario=usuario,
                ci=ci_temporal,  # CI temporal único, el usuario debe actualizarlo
                direccion='Pendiente de actualización',
                fecha_nacimiento=date(2000, 1, 1)  # Fecha por defecto
            )

        return usuario

    def update(self, instance, validated_data):
        """
        Actualizar usuario, hasheando la contraseña si se proporciona.
        """
        password = validated_data.pop('password', None)

        if password:
            # Hashear la nueva contraseña con bcrypt
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            validated_data['password_hash'] = hashed.decode('utf-8')

        return super().update(instance, validated_data)


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar usuarios"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    especialidad_display = serializers.CharField(source='get_especialidad_display', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre_completo', 'telefono', 'rol_nombre', 'especialidad', 'especialidad_display', 'activo']
