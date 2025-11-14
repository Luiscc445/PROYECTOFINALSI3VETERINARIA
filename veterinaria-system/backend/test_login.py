#!/usr/bin/env python
"""
Script para probar el login de todos los usuarios en la base de datos
"""
import os
import sys
import django
import requests

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()

from api.models import Usuario

def test_login_endpoint():
    """Prueba el endpoint de login con todos los usuarios"""
    print("=" * 80)
    print("TEST DE LOGIN - TODOS LOS USUARIOS")
    print("=" * 80)

    # URL del endpoint
    login_url = "http://localhost:8000/api/auth/login/"

    # Obtener todos los usuarios
    usuarios = Usuario.objects.all()

    if not usuarios.exists():
        print("\n❌ NO HAY USUARIOS EN LA BASE DE DATOS")
        print("   Ejecuta primero: python seed_realistic_data.py")
        return

    print(f"\n✓ Encontrados {usuarios.count()} usuarios en la base de datos\n")

    # Contraseñas comunes a probar
    # NOTA: Todos los usuarios del seed usan 'admin123'
    passwords_to_try = [
        'admin123',  # Esta es la correcta para todos
        'vet123',
        'tutor123',
        'password',
        '123456'
    ]

    resultados_exitosos = []
    resultados_fallidos = []

    for usuario in usuarios:
        print(f"\n{'='*80}")
        print(f"USUARIO: {usuario.email}")
        print(f"Nombre: {usuario.nombre_completo}")
        print(f"Rol: {usuario.rol.nombre if usuario.rol else 'Sin rol'}")
        print(f"Password Hash en DB: {usuario.password_hash}")
        print(f"-" * 80)

        # Probar con el password_hash directo (si está en texto plano)
        for password in [usuario.password_hash] + passwords_to_try:
            try:
                response = requests.post(
                    login_url,
                    json={
                        'email': usuario.email,
                        'password': password
                    },
                    headers={'Content-Type': 'application/json'}
                )

                if response.status_code == 200:
                    print(f"   ✅ LOGIN EXITOSO con password: '{password}'")
                    data = response.json()
                    print(f"   Respuesta: {data}")
                    resultados_exitosos.append({
                        'email': usuario.email,
                        'password': password,
                        'rol': usuario.rol.nombre if usuario.rol else 'Sin rol'
                    })
                    break  # Si funciona, no probar más contraseñas
                else:
                    print(f"   ❌ Falló con password: '{password}' - Status: {response.status_code}")
                    if password == usuario.password_hash:
                        print(f"      Respuesta: {response.text[:200]}")

            except Exception as e:
                print(f"   ⚠ Error al probar password '{password}': {str(e)}")
        else:
            # Si no funcionó ninguna contraseña
            resultados_fallidos.append({
                'email': usuario.email,
                'rol': usuario.rol.nombre if usuario.rol else 'Sin rol',
                'password_hash': usuario.password_hash
            })

    # Resumen final
    print("\n" + "=" * 80)
    print("RESUMEN FINAL")
    print("=" * 80)

    if resultados_exitosos:
        print(f"\n✅ LOGINS EXITOSOS ({len(resultados_exitosos)}):")
        print("-" * 80)
        for resultado in resultados_exitosos:
            print(f"   Email: {resultado['email']}")
            print(f"   Password: {resultado['password']}")
            print(f"   Rol: {resultado['rol']}")
            print()

    if resultados_fallidos:
        print(f"\n❌ LOGINS FALLIDOS ({len(resultados_fallidos)}):")
        print("-" * 80)
        for resultado in resultados_fallidos:
            print(f"   Email: {resultado['email']}")
            print(f"   Rol: {resultado['rol']}")
            print(f"   Password Hash: {resultado['password_hash']}")
            print()

    # Recomendaciones
    print("\n" + "=" * 80)
    print("CREDENCIALES PARA PROBAR EN EL FRONTEND:")
    print("=" * 80)
    if resultados_exitosos:
        for resultado in resultados_exitosos[:3]:  # Mostrar solo los primeros 3
            print(f"   Email: {resultado['email']}")
            print(f"   Password: {resultado['password']}")
            print()


def check_database_connection():
    """Verifica la conexión a la base de datos"""
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✓ Conexión a la base de datos: OK")
        return True
    except Exception as e:
        print(f"✗ Error de conexión a la base de datos: {e}")
        return False


def check_server_running():
    """Verifica si el servidor Django está corriendo"""
    try:
        response = requests.get("http://localhost:8000/api/", timeout=2)
        print("✓ Servidor Django corriendo en http://localhost:8000")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Servidor Django NO está corriendo")
        print("   Ejecuta: python manage.py runserver")
        return False
    except Exception as e:
        print(f"⚠ Error al verificar servidor: {e}")
        return False


if __name__ == '__main__':
    print("Verificando precondiciones...")
    print()

    # 1. Verificar conexión a BD
    if not check_database_connection():
        sys.exit(1)

    # 2. Verificar servidor corriendo
    if not check_server_running():
        sys.exit(1)

    print()

    # 3. Ejecutar tests
    test_login_endpoint()
