#!/usr/bin/env python
"""
Script para resetear todas las contraseñas a 'admin123'
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()

from api.models import Usuario
import bcrypt

def reset_all_passwords():
    """Resetea todas las contraseñas a 'admin123'"""
    print("=" * 80)
    print("RESETEO DE CONTRASEÑAS")
    print("=" * 80)

    # Nueva contraseña
    new_password = 'admin123'

    # Generar hash
    password_bytes = new_password.encode('utf-8')
    new_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    new_hash_str = new_hash.decode('utf-8')

    print(f"\n✓ Nueva contraseña para todos: {new_password}")
    print(f"✓ Hash generado: {new_hash_str}")
    print()

    # Obtener todos los usuarios
    usuarios = Usuario.objects.all()

    if not usuarios.exists():
        print("❌ No hay usuarios en la base de datos")
        return

    print(f"Actualizando {usuarios.count()} usuarios...\n")

    # Actualizar cada usuario
    for usuario in usuarios:
        old_hash = usuario.password_hash
        usuario.password_hash = new_hash_str
        usuario.save()

        print(f"✅ {usuario.email}")
        print(f"   Nombre: {usuario.nombre_completo}")
        print(f"   Rol: {usuario.rol.nombre if usuario.rol else 'Sin rol'}")
        print(f"   Hash anterior: {old_hash[:50]}...")
        print(f"   Hash nuevo: {new_hash_str[:50]}...")
        print()

    print("=" * 80)
    print("CONTRASEÑAS ACTUALIZADAS")
    print("=" * 80)
    print(f"\n✅ Todos los usuarios ahora tienen la contraseña: {new_password}\n")

    # Verificar que funciona
    print("Verificando un usuario al azar...")
    test_user = usuarios.first()
    test_result = bcrypt.checkpw(password_bytes, test_user.password_hash.encode('utf-8'))

    if test_result:
        print(f"✅ Verificación exitosa para {test_user.email}")
    else:
        print(f"❌ Error en la verificación para {test_user.email}")

    print("\n" + "=" * 80)
    print("CREDENCIALES PARA USAR:")
    print("=" * 80)
    print(f"\nCualquier email de usuario + Password: {new_password}\n")

    # Listar algunos usuarios
    print("Ejemplos:")
    for user in usuarios[:5]:
        print(f"  - {user.email} / {new_password} ({user.rol.nombre if user.rol else 'Sin rol'})")

    print("\n" + "=" * 80)


if __name__ == '__main__':
    try:
        reset_all_passwords()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
