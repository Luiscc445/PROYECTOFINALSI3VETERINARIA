"""
Modelos del sistema de gestión veterinaria.
Incluye 8 modelos principales para el manejo completo de la clínica.
"""
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from datetime import date


class Rol(models.Model):
    """
    Modelo para definir los roles de usuario en el sistema.
    """
    ROLES_CHOICES = [
        ('administrador', 'Administrador'),
        ('veterinario', 'Veterinario'),
        ('tutor', 'Tutor'),
    ]

    nombre = models.CharField(max_length=50, unique=True, choices=ROLES_CHOICES)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    """
    Modelo para los usuarios del sistema.
    Puede ser administrador, veterinario o tutor.
    """
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='usuarios')
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"


class Tutor(models.Model):
    """
    Modelo para los tutores (dueños) de mascotas.
    Tiene relación ONE-TO-ONE con Usuario.
    """
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='tutor')
    ci = models.CharField(max_length=20, unique=True, verbose_name='Cédula de Identidad')
    direccion = models.TextField()
    fecha_nacimiento = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Tutor'
        verbose_name_plural = 'Tutores'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.usuario.nombre_completo} - CI: {self.ci}"

    @property
    def edad(self):
        """Calcula la edad del tutor"""
        today = date.today()
        return today.year - self.fecha_nacimiento.year - (
            (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )


class Mascota(models.Model):
    """
    Modelo para las mascotas registradas en el sistema.
    """
    SEXO_CHOICES = [
        ('Macho', 'Macho'),
        ('Hembra', 'Hembra'),
    ]

    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='mascotas')
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=10, choices=SEXO_CHOICES)
    color = models.CharField(max_length=50)
    peso_kg = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    foto_url = models.ImageField(upload_to='fotos_mascotas/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Mascota'
        verbose_name_plural = 'Mascotas'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nombre} ({self.especie} - {self.raza})"

    @property
    def edad_anos(self):
        """Calcula la edad de la mascota en años"""
        today = date.today()
        return today.year - self.fecha_nacimiento.year - (
            (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )


class Cita(models.Model):
    """
    Modelo para las citas veterinarias.
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]

    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='citas')
    veterinario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='citas_veterinario')
    fecha_hora = models.DateTimeField()
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    observaciones = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-fecha_hora']

    def __str__(self):
        return f"Cita: {self.mascota.nombre} - {self.fecha_hora.strftime('%d/%m/%Y %H:%M')}"


class HistorialMedico(models.Model):
    """
    Modelo para el historial médico de las mascotas.
    """
    TIPO_CHOICES = [
        ('consulta', 'Consulta'),
        ('vacunacion', 'Vacunación'),
        ('cirugia', 'Cirugía'),
        ('emergencia', 'Emergencia'),
    ]

    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='historiales')
    veterinario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='historiales_realizados')
    fecha = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    diagnostico = models.TextField()
    tratamiento = models.TextField()
    medicamentos = models.TextField(blank=True)
    peso_kg = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        blank=True,
        null=True
    )
    temperatura_c = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )
    observaciones = models.TextField(blank=True)
    proxima_visita = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Historial Médico'
        verbose_name_plural = 'Historiales Médicos'
        ordering = ['-fecha']

    def __str__(self):
        return f"Historial: {self.mascota.nombre} - {self.fecha.strftime('%d/%m/%Y')} - {self.tipo}"


class Inventario(models.Model):
    """
    Modelo para el inventario de productos de la veterinaria.
    """
    CATEGORIA_CHOICES = [
        ('medicamento', 'Medicamento'),
        ('alimento', 'Alimento'),
        ('accesorio', 'Accesorio'),
        ('equipamiento', 'Equipamiento'),
    ]

    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES)
    descripcion = models.TextField(blank=True)
    cantidad = models.IntegerField(validators=[MinValueValidator(0)])
    unidad_medida = models.CharField(max_length=50)
    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    stock_minimo = models.IntegerField(validators=[MinValueValidator(0)])
    fecha_vencimiento = models.DateField(blank=True, null=True)
    proveedor = models.CharField(max_length=200, blank=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Producto de Inventario'
        verbose_name_plural = 'Inventario'
        ordering = ['nombre']

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

    @property
    def necesita_reposicion(self):
        """Indica si el producto necesita reposición"""
        return self.cantidad <= self.stock_minimo


class MovimientoInventario(models.Model):
    """
    Modelo para registrar movimientos del inventario.
    """
    TIPO_MOVIMIENTO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
    ]

    inventario = models.ForeignKey(Inventario, on_delete=models.CASCADE, related_name='movimientos')
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='movimientos_inventario')
    tipo_movimiento = models.CharField(max_length=20, choices=TIPO_MOVIMIENTO_CHOICES)
    cantidad = models.IntegerField()
    motivo = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Movimiento de Inventario'
        verbose_name_plural = 'Movimientos de Inventario'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.inventario.nombre} - {self.cantidad} - {self.fecha.strftime('%d/%m/%Y')}"


class RecetaMedicamento(models.Model):
    """
    Modelo para las recetas médicas de medicamentos.
    Asociada a un historial médico y un medicamento del inventario.
    """
    historial_medico = models.ForeignKey(
        HistorialMedico,
        on_delete=models.CASCADE,
        related_name='recetas'
    )
    medicamento = models.ForeignKey(
        Inventario,
        on_delete=models.PROTECT,
        related_name='recetas',
        limit_choices_to={'categoria': 'medicamento'}
    )
    dosis = models.CharField(max_length=100, help_text='Ej: 1 tableta, 5ml, etc.')
    frecuencia = models.CharField(max_length=100, help_text='Ej: Cada 8 horas, 2 veces al día, etc.')
    duracion = models.CharField(max_length=100, help_text='Ej: 7 días, 2 semanas, etc.')
    instrucciones = models.TextField(blank=True, help_text='Instrucciones adicionales')
    cantidad_total = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text='Cantidad total de unidades recetadas'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Receta de Medicamento'
        verbose_name_plural = 'Recetas de Medicamentos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Receta: {self.medicamento.nombre} - {self.historial_medico.mascota.nombre}"
