#!/usr/bin/env python
"""
Script para probar la verificación de bcrypt localmente
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

def test_bcrypt():
    """Prueba la verificación de bcrypt con los usuarios de la BD"""
    print("=" * 80)
    print("TEST DE VERIFICACIÓN BCRYPT")
    print("=" * 80)

    # Obtener un usuario de ejemplo
    try:
        usuario = Usuario.objects.first()
        if not usuario:
            print("\n❌ No hay usuarios en la base de datos")
            return

        print(f"\n✓ Usuario de prueba: {usuario.email}")
        print(f"  Nombre: {usuario.nombre_completo}")
        print(f"  Hash almacenado: {usuario.password_hash}")
        print()

        # Contraseñas a probar
        passwords_to_test = ['admin123', 'password', 'test']

        print("Probando contraseñas:\n")
        for password in passwords_to_test:
            print(f"  Probando: '{password}'")

            # Convertir a bytes
            password_bytes = password.encode('utf-8')
            hash_bytes = usuario.password_hash.encode('utf-8')

            # Verificar
            try:
                result = bcrypt.checkpw(password_bytes, hash_bytes)
                if result:
                    print(f"    ✅ CORRECTO - Esta es la contraseña válida!")
                else:
                    print(f"    ❌ Incorrecto")
            except Exception as e:
                print(f"    ⚠ Error al verificar: {e}")
            print()

        # Generar un hash nuevo para comparar
        print("\n" + "=" * 80)
        print("GENERANDO HASH NUEVO PARA 'admin123':")
        print("=" * 80)
        new_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        print(f"Hash generado: {new_hash.decode('utf-8')}")
        print(f"\nVerificando hash nuevo con 'admin123':")
        print(f"  Resultado: {bcrypt.checkpw('admin123'.encode('utf-8'), new_hash)}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    test_bcrypt()
