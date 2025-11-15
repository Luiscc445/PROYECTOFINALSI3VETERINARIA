"""
Modelo Inventario - Arquitectura MVC
"""
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


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
