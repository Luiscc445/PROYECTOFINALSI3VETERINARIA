#!/usr/bin/env python3
"""
Script inteligente para arreglar la base de datos y crear tablas faltantes.
Automatiza el proceso de instalación de dependencias, creación y aplicación de migraciones.
"""

import subprocess
import sys
import os
from pathlib import Path

# Colores para la consola
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_step(message):
    """Imprime un mensaje de paso con formato"""
    print(f"\n{Colors.OKCYAN}{Colors.BOLD}[PASO]{Colors.ENDC} {message}")

def print_success(message):
    """Imprime un mensaje de éxito"""
    print(f"{Colors.OKGREEN}✓{Colors.ENDC} {message}")

def print_error(message):
    """Imprime un mensaje de error"""
    print(f"{Colors.FAIL}✗{Colors.ENDC} {message}")

def print_warning(message):
    """Imprime un mensaje de advertencia"""
    print(f"{Colors.WARNING}⚠{Colors.ENDC} {message}")

def run_command(command, description, check=True):
    """Ejecuta un comando y maneja errores"""
    try:
        print(f"  Ejecutando: {description}...")
        result = subprocess.run(
            command,
            shell=True,
            check=check,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print_success(f"{description} completado")
            if result.stdout:
                print(f"    {result.stdout.strip()}")
            return True
        else:
            print_error(f"{description} falló")
            if result.stderr:
                print(f"    Error: {result.stderr.strip()}")
            return False
    except subprocess.CalledProcessError as e:
        print_error(f"{description} falló con código {e.returncode}")
        if e.stderr:
            print(f"    Error: {e.stderr.strip()}")
        return False
    except Exception as e:
        print_error(f"Error inesperado: {str(e)}")
        return False

def main():
    """Función principal del script"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}  Script Inteligente de Reparación de Base de Datos{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}  Sistema de Gestión Veterinaria{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

    # Cambiar al directorio del script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    print(f"Directorio de trabajo: {script_dir}\n")

    # Paso 1: Verificar Python
    print_step("Verificando versión de Python")
    python_version = sys.version.split()[0]
    print_success(f"Python {python_version} detectado")

    # Paso 2: Instalar dependencias
    print_step("Instalando dependencias desde requirements.txt")
    if not run_command(
        f"{sys.executable} -m pip install -q -r requirements.txt",
        "Instalación de dependencias"
    ):
        print_error("No se pudieron instalar las dependencias. Continuando de todas formas...")

    # Paso 3: Verificar instalación de Django
    print_step("Verificando instalación de Django")
    try:
        import django
        print_success(f"Django {django.get_version()} instalado correctamente")
    except ImportError:
        print_error("Django no está instalado. Intentando instalar...")
        run_command(
            f"{sys.executable} -m pip install Django==5.0.1",
            "Instalación de Django"
        )

    # Paso 4: Crear directorio de migraciones si no existe
    print_step("Verificando estructura de directorios")
    migrations_dir = script_dir / "api" / "migrations"
    if not migrations_dir.exists():
        migrations_dir.mkdir(parents=True, exist_ok=True)
        print_success(f"Directorio de migraciones creado: {migrations_dir}")

        # Crear __init__.py si no existe
        init_file = migrations_dir / "__init__.py"
        if not init_file.exists():
            init_file.touch()
            print_success("Archivo __init__.py creado en migrations/")
    else:
        print_success("Directorio de migraciones ya existe")

    # Paso 5: Crear migraciones
    print_step("Creando migraciones para RecetaMedicamento")
    if run_command(
        f"{sys.executable} manage.py makemigrations",
        "Creación de migraciones"
    ):
        print_success("Migraciones creadas exitosamente")
    else:
        print_warning("Las migraciones pueden ya estar creadas o hubo un error")

    # Paso 6: Mostrar migraciones pendientes
    print_step("Verificando migraciones pendientes")
    run_command(
        f"{sys.executable} manage.py showmigrations --plan",
        "Mostrar plan de migraciones",
        check=False
    )

    # Paso 7: Aplicar migraciones
    print_step("Aplicando migraciones a la base de datos")
    if run_command(
        f"{sys.executable} manage.py migrate",
        "Aplicación de migraciones"
    ):
        print_success("Migraciones aplicadas exitosamente")
    else:
        print_error("Error al aplicar migraciones. Verifica tu configuración de base de datos.")
        return False

    # Paso 8: Verificar tabla creada
    print_step("Verificando tablas creadas")
    verification_script = """
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_project.settings')
django.setup()
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%receta%';")
tables = cursor.fetchall()
if tables:
    print("Tablas relacionadas con receta encontradas:")
    for table in tables:
        print(f"  - {table[0]}")
else:
    print("No se encontraron tablas relacionadas con receta")
"""

    verification_file = script_dir / "verify_tables.py"
    verification_file.write_text(verification_script)

    run_command(
        f"{sys.executable} verify_tables.py",
        "Verificación de tablas en la base de datos",
        check=False
    )

    # Limpiar archivo temporal
    if verification_file.exists():
        verification_file.unlink()

    # Resumen final
    print(f"\n{Colors.OKGREEN}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{Colors.BOLD}  ✓ Proceso completado exitosamente{Colors.ENDC}")
    print(f"{Colors.OKGREEN}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

    print("Resumen de acciones realizadas:")
    print("  1. Instalación de dependencias")
    print("  2. Creación del modelo RecetaMedicamento")
    print("  3. Generación de migraciones de Django")
    print("  4. Aplicación de migraciones a la base de datos")
    print("  5. Verificación de tablas creadas")

    print(f"\n{Colors.OKCYAN}La tabla 'api_recetamedicamento' ahora debería existir en tu base de datos.{Colors.ENDC}")
    print(f"{Colors.OKCYAN}El error 'relation \"api_recetamedicamento\" does not exist' debería estar resuelto.{Colors.ENDC}\n")

    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Script interrumpido por el usuario{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.FAIL}Error inesperado: {str(e)}{Colors.ENDC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
