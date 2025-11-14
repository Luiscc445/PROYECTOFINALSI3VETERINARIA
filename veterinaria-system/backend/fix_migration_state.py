#!/usr/bin/env python
"""
Script para verificar y arreglar el estado de la migración de RecetaMedicamento.
Ejecutar después de crear la tabla manualmente con create_receta_table.sql
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'veterinaria_system.settings')
django.setup()

from django.db import connection
from django.db.migrations.recorder import MigrationRecorder


def check_table_exists():
    """Verifica si la tabla api_recetamedicamento existe"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'api_recetamedicamento'
            );
        """)
        return cursor.fetchone()[0]


def check_migration_applied():
    """Verifica si la migración 0001_initial está marcada como aplicada"""
    recorder = MigrationRecorder(connection)
    return recorder.migration_qs.filter(
        app='api',
        name='0001_initial'
    ).exists()


def mark_migration_as_applied():
    """Marca la migración 0001_initial como aplicada"""
    recorder = MigrationRecorder(connection)
    recorder.record_applied('api', '0001_initial')
    print("✓ Migración 0001_initial marcada como aplicada")


def main():
    print("=" * 60)
    print("VERIFICACIÓN DE MIGRACIÓN - RecetaMedicamento")
    print("=" * 60)

    # 1. Verificar si la tabla existe
    print("\n1. Verificando si la tabla existe...")
    table_exists = check_table_exists()

    if table_exists:
        print("   ✓ La tabla api_recetamedicamento EXISTE en la base de datos")
    else:
        print("   ✗ La tabla api_recetamedicamento NO EXISTE")
        print("\n   ACCIÓN REQUERIDA:")
        print("   1. Ve a Supabase SQL Editor")
        print("   2. Ejecuta el archivo: create_receta_table.sql")
        print("   3. Vuelve a ejecutar este script")
        return

    # 2. Verificar si la migración está marcada como aplicada
    print("\n2. Verificando estado de la migración...")
    migration_applied = check_migration_applied()

    if migration_applied:
        print("   ✓ La migración 0001_initial YA está marcada como aplicada")
    else:
        print("   ⚠ La migración 0001_initial NO está marcada como aplicada")
        print("   → Marcando la migración...")
        mark_migration_as_applied()

    # 3. Verificar columnas de la tabla
    print("\n3. Verificando estructura de la tabla...")
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'api_recetamedicamento'
            ORDER BY ordinal_position;
        """)
        columns = cursor.fetchall()

    print("   Columnas encontradas:")
    for col_name, col_type in columns:
        print(f"   - {col_name}: {col_type}")

    # Verificar que tenga las columnas esenciales
    column_names = [col[0] for col in columns]
    required_columns = [
        'id', 'historial_medico_id', 'medicamento_id',
        'dosis', 'frecuencia', 'duracion', 'instrucciones',
        'cantidad_total', 'created_at'
    ]

    missing_columns = [col for col in required_columns if col not in column_names]

    if missing_columns:
        print(f"\n   ✗ FALTAN COLUMNAS: {', '.join(missing_columns)}")
        print("   → Ejecuta create_receta_table.sql nuevamente")
    else:
        print("\n   ✓ Todas las columnas requeridas están presentes")

    print("\n" + "=" * 60)
    print("RESUMEN FINAL")
    print("=" * 60)

    if table_exists and not missing_columns:
        print("✓ TODO ESTÁ CORRECTO")
        print("✓ Puedes ejecutar: python seed_realistic_data.py")
    else:
        print("✗ REQUIERE CORRECCIÓN")
        print("→ Ejecuta create_receta_table.sql en Supabase")

    print("=" * 60)


if __name__ == '__main__':
    main()
