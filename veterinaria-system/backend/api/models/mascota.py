"""
Modelo Mascota - Arquitectura MVC
"""
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from datetime import date
from .tutor import Tutor


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
