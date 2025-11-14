#!/usr/bin/env python
"""
Script para ELIMINAR TODO y crear datos nuevos con contraseñas funcionales
ADVERTENCIA: Esto borrará TODA la información existente
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()

from api.models import (
    Rol, Usuario, Tutor, Mascota, Cita, HistorialMedico,
    Inventario, MovimientoInventario, RecetaMedicamento
)
import bcrypt
from datetime import datetime, timedelta

# Colores para la consola
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_step(msg):
    print(f"\n{Colors.BLUE}➜ {msg}{Colors.RESET}")

def print_success(msg):
    print(f"  {Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"  {Colors.RED}✗ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"  {Colors.YELLOW}⚠ {msg}{Colors.RESET}")


def delete_all_data():
    """Elimina TODOS los datos existentes"""
    print_step("ELIMINANDO TODOS LOS DATOS EXISTENTES...")

    try:
        RecetaMedicamento.objects.all().delete()
        print_success("Recetas eliminadas")

        MovimientoInventario.objects.all().delete()
        print_success("Movimientos de inventario eliminados")

        Inventario.objects.all().delete()
        print_success("Inventario eliminado")

        HistorialMedico.objects.all().delete()
        print_success("Historiales médicos eliminados")

        Cita.objects.all().delete()
        print_success("Citas eliminadas")

        Mascota.objects.all().delete()
        print_success("Mascotas eliminadas")

        Tutor.objects.all().delete()
        print_success("Tutores eliminados")

        Usuario.objects.all().delete()
        print_success("Usuarios eliminados")

        Rol.objects.all().delete()
        print_success("Roles eliminados")

        print_success("TODOS LOS DATOS HAN SIDO ELIMINADOS")

    except Exception as e:
        print_error(f"Error al eliminar datos: {e}")
        raise


def generate_password_hash(password):
    """Genera un hash bcrypt para una contraseña"""
    password_bytes = password.encode('utf-8')
    hash_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hash_bytes.decode('utf-8')


def create_roles():
    """Crea los roles del sistema"""
    print_step("Creando roles...")

    roles = {}

    admin_rol = Rol.objects.create(
        nombre='administrador',
        descripcion='Administrador del sistema'
    )
    roles['administrador'] = admin_rol
    print_success(f"Rol creado: {admin_rol.nombre}")

    vet_rol = Rol.objects.create(
        nombre='veterinario',
        descripcion='Veterinario de la clínica'
    )
    roles['veterinario'] = vet_rol
    print_success(f"Rol creado: {vet_rol.nombre}")

    tutor_rol = Rol.objects.create(
        nombre='tutor',
        descripcion='Tutor/Dueño de mascotas'
    )
    roles['tutor'] = tutor_rol
    print_success(f"Rol creado: {tutor_rol.nombre}")

    return roles


def create_users(roles):
    """Crea usuarios con contraseñas funcionales"""
    print_step("Creando usuarios con password: admin123...")

    # Generar hash UNA SOLA VEZ para todos
    password_hash = generate_password_hash('admin123')
    print_success(f"Hash generado: {password_hash[:50]}...")

    usuarios = {}

    # 1. ADMINISTRADOR
    admin = Usuario.objects.create(
        email='admin@vetclinic.com',
        password_hash=password_hash,
        nombre_completo='Carlos Mendoza',
        telefono='0991234567',
        rol=roles['administrador'],
        activo=True
    )
    usuarios['admin'] = admin
    print_success(f"✓ ADMIN creado: {admin.email}")

    # 2. VETERINARIOS
    vet1 = Usuario.objects.create(
        email='dra.garcia@vetclinic.com',
        password_hash=password_hash,
        nombre_completo='Dra. María García Rodríguez',
        telefono='0992345678',
        rol=roles['veterinario'],
        especialidad='general',
        activo=True
    )
    usuarios['vet1'] = vet1
    print_success(f"✓ VETERINARIO creado: {vet1.email} - {vet1.get_especialidad_display()}")

    vet2 = Usuario.objects.create(
        email='dr.lopez@vetclinic.com',
        password_hash=password_hash,
        nombre_completo='Dr. Roberto López Martínez',
        telefono='0993456789',
        rol=roles['veterinario'],
        especialidad='cirugia',
        activo=True
    )
    usuarios['vet2'] = vet2
    print_success(f"✓ VETERINARIO creado: {vet2.email} - {vet2.get_especialidad_display()}")

    vet3 = Usuario.objects.create(
        email='dra.fernandez@vetclinic.com',
        password_hash=password_hash,
        nombre_completo='Dra. Ana Fernández Santos',
        telefono='0994567890',
        rol=roles['veterinario'],
        especialidad='dermatologia',
        activo=True
    )
    usuarios['vet3'] = vet3
    print_success(f"✓ VETERINARIO creado: {vet3.email} - {vet3.get_especialidad_display()}")

    # 3. TUTORES
    tutor1_user = Usuario.objects.create(
        email='juan.perez@gmail.com',
        password_hash=password_hash,
        nombre_completo='Juan Pérez González',
        telefono='0995678901',
        rol=roles['tutor'],
        activo=True
    )
    usuarios['tutor1_user'] = tutor1_user
    print_success(f"✓ TUTOR creado: {tutor1_user.email}")

    tutor2_user = Usuario.objects.create(
        email='maria.lopez@gmail.com',
        password_hash=password_hash,
        nombre_completo='María López Silva',
        telefono='0996789012',
        rol=roles['tutor'],
        activo=True
    )
    usuarios['tutor2_user'] = tutor2_user
    print_success(f"✓ TUTOR creado: {tutor2_user.email}")

    tutor3_user = Usuario.objects.create(
        email='carlos.martinez@gmail.com',
        password_hash=password_hash,
        nombre_completo='Carlos Martínez Rodríguez',
        telefono='0997890123',
        rol=roles['tutor'],
        activo=True
    )
    usuarios['tutor3_user'] = tutor3_user
    print_success(f"✓ TUTOR creado: {tutor3_user.email}")

    return usuarios


def create_tutores(usuarios):
    """Crea los perfiles de tutor"""
    print_step("Creando perfiles de tutores...")

    tutores = {}

    tutor1 = Tutor.objects.create(
        usuario=usuarios['tutor1_user'],
        ci='1234567-1Q',
        direccion='Av. Amazonas N35-17 y República, Quito',
        fecha_nacimiento=datetime(1985, 3, 15).date()
    )
    tutores['tutor1'] = tutor1
    print_success(f"Tutor creado: {tutor1.usuario.nombre_completo} - CI: {tutor1.ci}")

    tutor2 = Tutor.objects.create(
        usuario=usuarios['tutor2_user'],
        ci='2345678-2Q',
        direccion='Calle González Suárez E7-35, Quito',
        fecha_nacimiento=datetime(1990, 7, 22).date()
    )
    tutores['tutor2'] = tutor2
    print_success(f"Tutor creado: {tutor2.usuario.nombre_completo} - CI: {tutor2.ci}")

    tutor3 = Tutor.objects.create(
        usuario=usuarios['tutor3_user'],
        ci='3456789-3Q',
        direccion='Av. 6 de Diciembre N34-150, Quito',
        fecha_nacimiento=datetime(1988, 11, 5).date()
    )
    tutores['tutor3'] = tutor3
    print_success(f"Tutor creado: {tutor3.usuario.nombre_completo} - CI: {tutor3.ci}")

    return tutores


def create_mascotas(tutores):
    """Crea mascotas de prueba"""
    print_step("Creando mascotas...")

    mascotas = []

    # Mascotas de tutor1
    m1 = Mascota.objects.create(
        nombre='Max',
        especie='Perro',
        raza='Golden Retriever',
        fecha_nacimiento=datetime(2020, 5, 10).date(),
        sexo='Macho',
        color='Dorado',
        peso_kg=30.5,
        tutor=tutores['tutor1'],
        activo=True
    )
    mascotas.append(m1)
    print_success(f"Mascota creada: {m1.nombre} ({m1.especie}) - Tutor: {m1.tutor.usuario.nombre_completo}")

    # Mascotas de tutor2
    m2 = Mascota.objects.create(
        nombre='Luna',
        especie='Gato',
        raza='Persa',
        fecha_nacimiento=datetime(2021, 2, 14).date(),
        sexo='Hembra',
        color='Blanco',
        peso_kg=4.2,
        tutor=tutores['tutor2'],
        activo=True
    )
    mascotas.append(m2)
    print_success(f"Mascota creada: {m2.nombre} ({m2.especie}) - Tutor: {m2.tutor.usuario.nombre_completo}")

    # Mascotas de tutor3
    m3 = Mascota.objects.create(
        nombre='Rocky',
        especie='Perro',
        raza='Pastor Alemán',
        fecha_nacimiento=datetime(2019, 8, 20).date(),
        sexo='Macho',
        color='Negro y marrón',
        peso_kg=35.0,
        tutor=tutores['tutor3'],
        activo=True
    )
    mascotas.append(m3)
    print_success(f"Mascota creada: {m3.nombre} ({m3.especie}) - Tutor: {m3.tutor.usuario.nombre_completo}")

    return mascotas


def verify_passwords(usuarios):
    """Verifica que las contraseñas funcionen"""
    print_step("Verificando contraseñas...")

    password = 'admin123'
    password_bytes = password.encode('utf-8')

    all_ok = True
    for key, usuario in usuarios.items():
        if usuario.rol.nombre in ['administrador', 'veterinario', 'tutor']:
            hash_bytes = usuario.password_hash.encode('utf-8')
            result = bcrypt.checkpw(password_bytes, hash_bytes)

            if result:
                print_success(f"✓ {usuario.email} - Password verificada correctamente")
            else:
                print_error(f"✗ {usuario.email} - Password NO funciona")
                all_ok = False

    return all_ok


def main():
    print("=" * 80)
    print("RECREACIÓN COMPLETA DE DATOS")
    print("=" * 80)
    print_warning("ADVERTENCIA: Esto eliminará TODOS los datos existentes")
    print_warning("Presiona Ctrl+C ahora para cancelar")
    print()

    try:
        # 1. Eliminar todo
        delete_all_data()

        # 2. Crear roles
        roles = create_roles()

        # 3. Crear usuarios
        usuarios = create_users(roles)

        # 4. Crear tutores
        tutores = create_tutores(usuarios)

        # 5. Crear mascotas
        mascotas = create_mascotas(tutores)

        # 6. Verificar contraseñas
        passwords_ok = verify_passwords(usuarios)

        # Resumen
        print("\n" + "=" * 80)
        print("RESUMEN FINAL")
        print("=" * 80)

        if passwords_ok:
            print_success("✓ TODAS LAS CONTRASEÑAS FUNCIONAN CORRECTAMENTE")
        else:
            print_error("✗ HAY PROBLEMAS CON ALGUNAS CONTRASEÑAS")

        print("\n" + "=" * 80)
        print("CREDENCIALES PARA LOGIN:")
        print("=" * 80)
        print(f"\n{Colors.YELLOW}PASSWORD PARA TODOS: admin123{Colors.RESET}\n")

        print(f"{Colors.RED}🔴 ADMINISTRADOR:{Colors.RESET}")
        print("   Email: admin@vetclinic.com")
        print("   Password: admin123")
        print()

        print(f"{Colors.BLUE}🔵 VETERINARIOS:{Colors.RESET}")
        print("   Email: dra.garcia@vetclinic.com (Medicina General)")
        print("   Email: dr.lopez@vetclinic.com (Cirugía)")
        print("   Email: dra.fernandez@vetclinic.com (Dermatología)")
        print("   Password: admin123")
        print()

        print(f"{Colors.GREEN}🟢 TUTORES:{Colors.RESET}")
        print("   Email: juan.perez@gmail.com")
        print("   Email: maria.lopez@gmail.com")
        print("   Email: carlos.martinez@gmail.com")
        print("   Password: admin123")
        print()

        print("=" * 80)
        print_success("¡TODO LISTO! Ahora puedes hacer login")
        print("=" * 80)

    except KeyboardInterrupt:
        print("\n\nOperación cancelada por el usuario")
    except Exception as e:
        print_error(f"Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
