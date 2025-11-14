#!/usr/bin/env python3
"""
Script para limpiar la base de datos e inyectar datos realistas.
Crea un sistema veterinario completo con usuarios, mascotas y citas reales.
"""

import os
import django
import sys
from datetime import datetime, timedelta
from decimal import Decimal
import random

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()

from django.utils import timezone
from api.models import (
    Rol, Usuario, Tutor, Mascota, Cita,
    HistorialMedico, Inventario, MovimientoInventario
)

# Colores para consola
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_step(message):
    print(f"\n{Colors.OKCYAN}{Colors.BOLD}[PASO]{Colors.ENDC} {message}")

def print_success(message):
    print(f"{Colors.OKGREEN}✓{Colors.ENDC} {message}")

def print_warning(message):
    print(f"{Colors.WARNING}⚠{Colors.ENDC} {message}")

def limpiar_base_datos():
    """Limpia todos los datos existentes"""
    print_step("Limpiando base de datos existente...")

    # Eliminar en orden correcto por dependencias
    MovimientoInventario.objects.all().delete()
    HistorialMedico.objects.all().delete()
    Cita.objects.all().delete()
    Mascota.objects.all().delete()
    Tutor.objects.all().delete()
    Inventario.objects.all().delete()
    Usuario.objects.all().delete()
    Rol.objects.all().delete()

    print_success("Base de datos limpiada")

def crear_roles():
    """Crea los roles del sistema"""
    print_step("Creando roles...")

    roles_data = [
        {'nombre': 'administrador', 'descripcion': 'Administrador del sistema con acceso completo'},
        {'nombre': 'veterinario', 'descripcion': 'Veterinario con acceso a consultas y historiales'},
        {'nombre': 'tutor', 'descripcion': 'Tutor de mascotas con acceso limitado'},
    ]

    roles = {}
    for rol_data in roles_data:
        rol = Rol.objects.create(**rol_data)
        roles[rol.nombre] = rol
        print_success(f"Rol creado: {rol.nombre}")

    return roles

def crear_usuarios(roles):
    """Crea usuarios realistas"""
    print_step("Creando usuarios...")

    usuarios = {}

    # Administrador
    admin = Usuario.objects.create(
        email='admin@vetclinic.com',
        password_hash='$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BlUd08J2K',  # password: admin123
        nombre_completo='Carlos Mendoza',
        telefono='0991234567',
        rol=roles['administrador'],
        activo=True
    )
    usuarios['admin'] = admin
    print_success(f"Admin creado: {admin.nombre_completo}")

    # Veterinarios con especialidades
    veterinarios_data = [
        {
            'email': 'dra.garcia@vetclinic.com',
            'nombre_completo': 'María García Rodríguez',
            'telefono': '0987654321',
            'especialidad': 'general'
        },
        {
            'email': 'dr.lopez@vetclinic.com',
            'nombre_completo': 'Roberto López Martínez',
            'telefono': '0998765432',
            'especialidad': 'cirugia'
        },
        {
            'email': 'dra.fernandez@vetclinic.com',
            'nombre_completo': 'Ana Fernández Santos',
            'telefono': '0976543210',
            'especialidad': 'dermatologia'
        },
        {
            'email': 'dr.torres@vetclinic.com',
            'nombre_completo': 'Diego Torres Ramírez',
            'telefono': '0965432109',
            'especialidad': 'cardiologia'
        },
        {
            'email': 'dra.morales@vetclinic.com',
            'nombre_completo': 'Patricia Morales Vega',
            'telefono': '0954321098',
            'especialidad': 'odontologia'
        }
    ]

    for vet_data in veterinarios_data:
        vet = Usuario.objects.create(
            email=vet_data['email'],
            password_hash='$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BlUd08J2K',  # password: vet123
            nombre_completo=vet_data['nombre_completo'],
            telefono=vet_data['telefono'],
            rol=roles['veterinario'],
            especialidad=vet_data['especialidad'],
            activo=True
        )
        usuarios[f"vet_{vet_data['especialidad']}"] = vet
        print_success(f"Veterinario creado: Dr(a). {vet.nombre_completo} - {vet.get_especialidad_display()}")

    # Tutores
    tutores_data = [
        {
            'email': 'juan.perez@email.com',
            'nombre_completo': 'Juan Pérez González',
            'telefono': '0991234000',
        },
        {
            'email': 'maria.rodriguez@email.com',
            'nombre_completo': 'María Rodríguez Silva',
            'telefono': '0991234001',
        },
        {
            'email': 'carlos.martinez@email.com',
            'nombre_completo': 'Carlos Martínez López',
            'telefono': '0991234002',
        }
    ]

    for tutor_data in tutores_data:
        tutor_user = Usuario.objects.create(
            email=tutor_data['email'],
            password_hash='$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BlUd08J2K',  # password: tutor123
            nombre_completo=tutor_data['nombre_completo'],
            telefono=tutor_data['telefono'],
            rol=roles['tutor'],
            activo=True
        )
        usuarios[f"tutor_{tutor_data['email'].split('@')[0]}"] = tutor_user
        print_success(f"Tutor creado: {tutor_user.nombre_completo}")

    return usuarios

def crear_tutores(usuarios):
    """Crea registros de tutores con datos detallados"""
    print_step("Creando registros de tutores...")

    tutores_detalle = [
        {
            'usuario_key': 'tutor_juan.perez',
            'ci': '1234567890',
            'direccion': 'Av. 6 de Diciembre N34-45 y Portugal, Quito',
            'fecha_nacimiento': datetime(1985, 3, 15).date()
        },
        {
            'usuario_key': 'tutor_maria.rodriguez',
            'ci': '0987654321',
            'direccion': 'Calle García Moreno 723 y Sucre, Quito',
            'fecha_nacimiento': datetime(1990, 7, 22).date()
        },
        {
            'usuario_key': 'tutor_carlos.martinez',
            'ci': '1122334455',
            'direccion': 'Av. América N33-89 y República, Quito',
            'fecha_nacimiento': datetime(1988, 11, 8).date()
        }
    ]

    tutores = {}
    for tutor_det in tutores_detalle:
        tutor = Tutor.objects.create(
            usuario=usuarios[tutor_det['usuario_key']],
            ci=tutor_det['ci'],
            direccion=tutor_det['direccion'],
            fecha_nacimiento=tutor_det['fecha_nacimiento']
        )
        tutores[tutor_det['usuario_key']] = tutor
        print_success(f"Registro tutor: {tutor.usuario.nombre_completo} - CI: {tutor.ci}")

    return tutores

def crear_mascotas(tutores):
    """Crea mascotas realistas asignadas a cada tutor"""
    print_step("Creando mascotas...")

    mascotas_data = {
        'tutor_juan.perez': [
            {
                'nombre': 'Max',
                'especie': 'Perro',
                'raza': 'Golden Retriever',
                'fecha_nacimiento': datetime(2020, 5, 10).date(),
                'sexo': 'Macho',
                'color': 'Dorado',
                'peso_kg': Decimal('28.5')
            },
            {
                'nombre': 'Luna',
                'especie': 'Gato',
                'raza': 'Siamés',
                'fecha_nacimiento': datetime(2021, 8, 22).date(),
                'sexo': 'Hembra',
                'color': 'Crema con puntos oscuros',
                'peso_kg': Decimal('4.2')
            }
        ],
        'tutor_maria.rodriguez': [
            {
                'nombre': 'Rocky',
                'especie': 'Perro',
                'raza': 'Bulldog Francés',
                'fecha_nacimiento': datetime(2019, 3, 15).date(),
                'sexo': 'Macho',
                'color': 'Atigrado',
                'peso_kg': Decimal('12.8')
            },
            {
                'nombre': 'Mia',
                'especie': 'Gato',
                'raza': 'Persa',
                'fecha_nacimiento': datetime(2022, 1, 5).date(),
                'sexo': 'Hembra',
                'color': 'Blanco',
                'peso_kg': Decimal('3.5')
            },
            {
                'nombre': 'Coco',
                'especie': 'Conejo',
                'raza': 'Holland Lop',
                'fecha_nacimiento': datetime(2023, 4, 18).date(),
                'sexo': 'Macho',
                'color': 'Gris',
                'peso_kg': Decimal('1.8')
            }
        ],
        'tutor_carlos.martinez': [
            {
                'nombre': 'Toby',
                'especie': 'Perro',
                'raza': 'Labrador',
                'fecha_nacimiento': datetime(2018, 11, 30).date(),
                'sexo': 'Macho',
                'color': 'Negro',
                'peso_kg': Decimal('32.0')
            },
            {
                'nombre': 'Bella',
                'especie': 'Perro',
                'raza': 'Beagle',
                'fecha_nacimiento': datetime(2021, 6, 12).date(),
                'sexo': 'Hembra',
                'color': 'Tricolor',
                'peso_kg': Decimal('10.5')
            }
        ]
    }

    mascotas_creadas = []
    for tutor_key, mascotas_list in mascotas_data.items():
        tutor = tutores[tutor_key]
        for mascota_data in mascotas_list:
            mascota = Mascota.objects.create(
                tutor=tutor,
                **mascota_data,
                activo=True
            )
            mascotas_creadas.append(mascota)
            print_success(f"Mascota: {mascota.nombre} ({mascota.especie}) - Tutor: {tutor.usuario.nombre_completo}")

    return mascotas_creadas

def crear_citas(mascotas, veterinarios):
    """Crea citas médicas realistas"""
    print_step("Creando citas médicas...")

    estados = ['pendiente', 'confirmada', 'completada']
    motivos = [
        'Control general',
        'Vacunación anual',
        'Revisión post-cirugía',
        'Consulta por alergia',
        'Control dental',
        'Chequeo cardíaco',
        'Revisión dermatológica'
    ]

    citas = []
    hoy = timezone.now()

    # Crear algunas citas pasadas y futuras para cada mascota
    for mascota in mascotas[:5]:  # Solo las primeras 5 mascotas
        # Cita pasada (completada)
        fecha_pasada = hoy - timedelta(days=random.randint(15, 60))
        cita_pasada = Cita.objects.create(
            mascota=mascota,
            veterinario=random.choice(list(veterinarios.values())),
            fecha_hora=fecha_pasada,
            motivo=random.choice(motivos),
            estado='completada',
            observaciones='Consulta realizada exitosamente'
        )
        citas.append(cita_pasada)
        print_success(f"Cita pasada: {mascota.nombre} - {fecha_pasada.strftime('%d/%m/%Y')}")

        # Cita próxima (pendiente o confirmada)
        fecha_futura = hoy + timedelta(days=random.randint(1, 30))
        cita_futura = Cita.objects.create(
            mascota=mascota,
            veterinario=random.choice(list(veterinarios.values())),
            fecha_hora=fecha_futura,
            motivo=random.choice(motivos),
            estado=random.choice(['pendiente', 'confirmada']),
            observaciones=''
        )
        citas.append(cita_futura)
        print_success(f"Cita futura: {mascota.nombre} - {fecha_futura.strftime('%d/%m/%Y')}")

    return citas

def crear_historiales_medicos(mascotas, veterinarios):
    """Crea historiales médicos realistas"""
    print_step("Creando historiales médicos...")

    tipos = ['consulta', 'vacunacion', 'cirugia', 'emergencia']
    diagnosticos = [
        'Estado de salud óptimo',
        'Dermatitis alérgica leve',
        'Infección dental tratada',
        'Control post-vacunación exitoso',
        'Revisión cardiológica normal'
    ]
    tratamientos = [
        'Ninguno necesario',
        'Antihistamínicos por 7 días',
        'Limpieza dental y antibióticos',
        'Observación y seguimiento',
        'Dieta especial y ejercicio'
    ]

    historiales = []
    for mascota in mascotas[:5]:  # Solo las primeras 5
        num_historiales = random.randint(1, 3)
        for i in range(num_historiales):
            dias_atras = random.randint(30, 365)
            historial = HistorialMedico.objects.create(
                mascota=mascota,
                veterinario=random.choice(list(veterinarios.values())),
                fecha=(timezone.now() - timedelta(days=dias_atras)).date(),
                tipo=random.choice(tipos),
                diagnostico=random.choice(diagnosticos),
                tratamiento=random.choice(tratamientos),
                peso_kg=mascota.peso_kg + Decimal(random.uniform(-1, 1)),
                temperatura_c=Decimal(random.uniform(37.5, 39.5)),
                observaciones='Control rutinario sin novedades'
            )
            historiales.append(historial)
            print_success(f"Historial: {mascota.nombre} - {historial.tipo}")

    return historiales

def crear_inventario():
    """Crea inventario de medicamentos y productos"""
    print_step("Creando inventario...")

    productos = [
        {
            'codigo': 'MED-001',
            'nombre': 'Antibiótico Amoxicilina 500mg',
            'categoria': 'medicamento',
            'descripcion': 'Antibiótico de amplio espectro',
            'cantidad': 100,
            'unidad_medida': 'tabletas',
            'precio_unitario': Decimal('2.50'),
            'stock_minimo': 20
        },
        {
            'codigo': 'MED-002',
            'nombre': 'Antiinflamatorio Carprofeno 50mg',
            'categoria': 'medicamento',
            'descripcion': 'Antiinflamatorio no esteroideo',
            'cantidad': 80,
            'unidad_medida': 'tabletas',
            'precio_unitario': Decimal('3.00'),
            'stock_minimo': 15
        },
        {
            'codigo': 'VAC-001',
            'nombre': 'Vacuna Pentavalente',
            'categoria': 'medicamento',
            'descripcion': 'Vacuna contra 5 enfermedades',
            'cantidad': 50,
            'unidad_medida': 'dosis',
            'precio_unitario': Decimal('25.00'),
            'stock_minimo': 10
        },
        {
            'codigo': 'ALI-001',
            'nombre': 'Alimento Premium Adulto 15kg',
            'categoria': 'alimento',
            'descripcion': 'Alimento balanceado para perros adultos',
            'cantidad': 30,
            'unidad_medida': 'sacos',
            'precio_unitario': Decimal('45.00'),
            'stock_minimo': 5
        }
    ]

    inventarios = []
    for prod in productos:
        inv = Inventario.objects.create(**prod, activo=True)
        inventarios.append(inv)
        print_success(f"Producto: {inv.nombre} - Stock: {inv.cantidad}")

    return inventarios

def main():
    """Función principal"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}  Script de Limpieza e Inyección de Datos Realistas{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}  Sistema de Gestión Veterinaria{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

    print_warning("ADVERTENCIA: Este script eliminará TODOS los datos existentes")
    respuesta = input(f"\n¿Desea continuar? (si/no): ")

    if respuesta.lower() not in ['si', 's', 'yes', 'y']:
        print_warning("\nOperación cancelada por el usuario")
        return

    # Ejecutar proceso
    limpiar_base_datos()
    roles = crear_roles()
    usuarios = crear_usuarios(roles)
    tutores = crear_tutores(usuarios)
    mascotas = crear_mascotas(tutores)

    # Filtrar solo veterinarios para las citas
    veterinarios = {k: v for k, v in usuarios.items() if k.startswith('vet_')}

    citas = crear_citas(mascotas, veterinarios)
    historiales = crear_historiales_medicos(mascotas, veterinarios)
    inventarios = crear_inventario()

    # Resumen final
    print(f"\n{Colors.OKGREEN}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{Colors.BOLD}  ✓ Datos creados exitosamente{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

    print("Resumen de datos creados:")
    print(f"  • Roles: {Rol.objects.count()}")
    print(f"  • Usuarios: {Usuario.objects.count()}")
    print(f"  • Tutores: {Tutor.objects.count()}")
    print(f"  • Mascotas: {Mascota.objects.count()}")
    print(f"  • Citas: {Cita.objects.count()}")
    print(f"  • Historiales Médicos: {HistorialMedico.objects.count()}")
    print(f"  • Productos Inventario: {Inventario.objects.count()}")

    print(f"\n{Colors.OKCYAN}Credenciales de acceso:{Colors.ENDC}")
    print(f"  Admin: admin@vetclinic.com / admin123")
    print(f"  Veterinario: dra.garcia@vetclinic.com / vet123")
    print(f"  Tutor: juan.perez@email.com / tutor123")
    print(f"  Tutor: maria.rodriguez@email.com / tutor123")
    print(f"  Tutor: carlos.martinez@email.com / tutor123\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Script interrumpido por el usuario{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.FAIL}Error: {str(e)}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
