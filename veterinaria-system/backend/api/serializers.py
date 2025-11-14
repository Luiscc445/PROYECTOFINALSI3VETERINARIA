"""
Serializers para la API REST del sistema veterinaria.
Incluye serializers para los 9 modelos principales.
"""
from rest_framework import serializers
from .models import (
    Rol, Usuario, Tutor, Mascota, Cita,
    HistorialMedico, Inventario, MovimientoInventario, RecetaMedicamento
)


class RolSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Rol"""

    class Meta:
        model = Rol
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    especialidad_display = serializers.CharField(source='get_especialidad_display', read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'password_hash', 'nombre_completo',
            'telefono', 'rol', 'rol_nombre', 'especialidad',
            'especialidad_display', 'activo',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password_hash': {'write_only': True}
        }


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar usuarios"""
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    especialidad_display = serializers.CharField(source='get_especialidad_display', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre_completo', 'telefono', 'rol_nombre', 'especialidad', 'especialidad_display', 'activo']


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


class MascotaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Mascota"""
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


class InventarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Inventario"""
    necesita_reposicion = serializers.BooleanField(read_only=True)

    class Meta:
        model = Inventario
        fields = [
            'id', 'codigo', 'nombre', 'categoria', 'descripcion',
            'cantidad', 'unidad_medida', 'precio_unitario',
            'stock_minimo', 'fecha_vencimiento', 'proveedor',
            'necesita_reposicion', 'activo', 'created_at', 'updated_at'
        ]

    def validate_cantidad(self, value):
        """Valida que la cantidad no sea negativa"""
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa")
        return value

    def validate_precio_unitario(self, value):
        """Valida que el precio sea positivo"""
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        return value


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo MovimientoInventario"""
    inventario_nombre = serializers.CharField(source='inventario.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'id', 'inventario', 'inventario_nombre', 'usuario',
            'usuario_nombre', 'tipo_movimiento', 'cantidad',
            'motivo', 'fecha'
        ]
        read_only_fields = ['fecha']

    def validate(self, data):
        """Valida que haya suficiente stock para salidas"""
        if data.get('tipo_movimiento') == 'salida':
            inventario = data.get('inventario')
            cantidad = data.get('cantidad')
            if inventario.cantidad < cantidad:
                raise serializers.ValidationError(
                    f"No hay suficiente stock. Disponible: {inventario.cantidad}"
                )
        return data


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


class MascotaHistorialCompletoSerializer(serializers.ModelSerializer):
    """Serializer con historial completo de la mascota"""
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
