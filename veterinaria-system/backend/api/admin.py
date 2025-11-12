"""
Configuración del panel administrativo de Django.
Registra todos los modelos para su gestión.
"""
from django.contrib import admin
from .models import (
    Rol, Usuario, Tutor, Mascota, Cita,
    HistorialMedico, Inventario, MovimientoInventario, RecetaMedicamento
)


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'created_at')
    search_fields = ('nombre',)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'nombre_completo', 'rol', 'activo', 'created_at')
    list_filter = ('rol', 'activo')
    search_fields = ('email', 'nombre_completo')
    ordering = ('-created_at',)


@admin.register(Tutor)
class TutorAdmin(admin.ModelAdmin):
    list_display = ('ci', 'get_nombre', 'get_email', 'fecha_nacimiento')
    search_fields = ('ci', 'usuario__nombre_completo', 'usuario__email')
    ordering = ('-created_at',)

    def get_nombre(self, obj):
        return obj.usuario.nombre_completo
    get_nombre.short_description = 'Nombre'

    def get_email(self, obj):
        return obj.usuario.email
    get_email.short_description = 'Email'


@admin.register(Mascota)
class MascotaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'especie', 'raza', 'get_tutor', 'sexo', 'activo')
    list_filter = ('especie', 'sexo', 'activo')
    search_fields = ('nombre', 'tutor__usuario__nombre_completo')
    ordering = ('-created_at',)

    def get_tutor(self, obj):
        return obj.tutor.usuario.nombre_completo
    get_tutor.short_description = 'Tutor'


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ('get_mascota', 'get_veterinario', 'fecha_hora', 'estado')
    list_filter = ('estado', 'fecha_hora')
    search_fields = ('mascota__nombre', 'veterinario__nombre_completo')
    ordering = ('-fecha_hora',)

    def get_mascota(self, obj):
        return obj.mascota.nombre
    get_mascota.short_description = 'Mascota'

    def get_veterinario(self, obj):
        return obj.veterinario.nombre_completo
    get_veterinario.short_description = 'Veterinario'


@admin.register(HistorialMedico)
class HistorialMedicoAdmin(admin.ModelAdmin):
    list_display = ('get_mascota', 'fecha', 'tipo', 'get_veterinario')
    list_filter = ('tipo', 'fecha')
    search_fields = ('mascota__nombre', 'diagnostico')
    ordering = ('-fecha',)

    def get_mascota(self, obj):
        return obj.mascota.nombre
    get_mascota.short_description = 'Mascota'

    def get_veterinario(self, obj):
        return obj.veterinario.nombre_completo
    get_veterinario.short_description = 'Veterinario'


@admin.register(Inventario)
class InventarioAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'categoria', 'cantidad', 'stock_minimo', 'necesita_reposicion', 'activo')
    list_filter = ('categoria', 'activo')
    search_fields = ('codigo', 'nombre')
    ordering = ('nombre',)


@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('get_producto', 'tipo_movimiento', 'cantidad', 'get_usuario', 'fecha')
    list_filter = ('tipo_movimiento', 'fecha')
    search_fields = ('inventario__nombre', 'motivo')
    ordering = ('-fecha',)

    def get_producto(self, obj):
        return obj.inventario.nombre
    get_producto.short_description = 'Producto'

    def get_usuario(self, obj):
        return obj.usuario.nombre_completo
    get_usuario.short_description = 'Usuario'


@admin.register(RecetaMedicamento)
class RecetaMedicamentoAdmin(admin.ModelAdmin):
    list_display = ('get_mascota', 'get_medicamento', 'cantidad', 'dosis', 'duracion_dias', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('historial_medico__mascota__nombre', 'inventario__nombre')
    ordering = ('-created_at',)

    def get_mascota(self, obj):
        return obj.historial_medico.mascota.nombre
    get_mascota.short_description = 'Mascota'

    def get_medicamento(self, obj):
        return obj.inventario.nombre
    get_medicamento.short_description = 'Medicamento'
