#!/usr/bin/env python
"""
Script para ver todos los usuarios en la base de datos y sus contraseñas
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()

from api.models import Usuario

def mostrar_usuarios():
    """Muestra todos los usuarios y sus credenciales"""
    print("=" * 80)
    print("USUARIOS EN LA BASE DE DATOS")
    print("=" * 80)

    usuarios = Usuario.objects.all().select_related('rol')

    if not usuarios.exists():
        print("\n❌ NO HAY USUARIOS EN LA BASE DE DATOS")
        print("   Ejecuta: python seed_realistic_data.py")
        return

    print(f"\n✓ Total de usuarios: {usuarios.count()}\n")

    for i, usuario in enumerate(usuarios, 1):
        print(f"\n{i}. {'='*76}")
        print(f"   Email: {usuario.email}")
        print(f"   Nombre: {usuario.nombre_completo}")
        print(f"   Rol: {usuario.rol.nombre if usuario.rol else 'Sin rol'}")
        print(f"   Password Hash: {usuario.password_hash}")
        print(f"   Activo: {'Sí' if usuario.activo else 'No'}")
        if usuario.especialidad:
            print(f"   Especialidad: {usuario.get_especialidad_display()}")
        print(f"   {'='*76}")

    print("\n" + "=" * 80)
    print("CREDENCIALES PARA COPIAR Y PEGAR:")
    print("=" * 80)

    # Agrupar por rol
    admin_users = usuarios.filter(rol__nombre='administrador')
    vet_users = usuarios.filter(rol__nombre='veterinario')
    tutor_users = usuarios.filter(rol__nombre='tutor')

    if admin_users.exists():
        print("\n🔑 ADMINISTRADORES:")
        for user in admin_users:
            print(f"   Email: {user.email}")
            print(f"   Password: {user.password_hash}")
            print()

    if vet_users.exists():
        print("🔑 VETERINARIOS:")
        for user in vet_users:
            print(f"   Email: {user.email}")
            print(f"   Password: {user.password_hash}")
            print(f"   Especialidad: {user.get_especialidad_display() if user.especialidad else 'N/A'}")
            print()

    if tutor_users.exists():
        print("🔑 TUTORES:")
        for user in tutor_users:
            print(f"   Email: {user.email}")
            print(f"   Password: {user.password_hash}")
            print()

    print("=" * 80)


if __name__ == '__main__':
    try:
        mostrar_usuarios()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
