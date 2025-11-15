#!/usr/bin/env python3
"""
Script para agregar verificación de autenticación a componentes admin
"""
import re
import os

COMPONENTS_PATH = "/home/user/PROYECTOFINALSI3VETERINARIA/veterinaria-system/frontend/src/views/components/admin"

# Archivos a arreglar
FILES_TO_FIX = [
    "GestionUsuarios.js",
    "GestionTutores.js",
    "GestionMascotas.js",
    "GestionCitas.js",
    "GestionInventario.js"
]

def fix_component(filepath):
    """Arregla un componente agregando verificación de autenticación"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Agregar import de useAuth si no existe
    if 'useAuth' not in content:
        # Buscar la línea de import de useToast
        content = re.sub(
            r"(import { useToast } from '../../../context/ToastContext';)",
            r"\1\nimport { useAuth } from '../../../context/AuthContext';",
            content
        )

    # 2. Agregar const { user } = useAuth(); después del useToast
    if 'const { user } = useAuth()' not in content:
        content = re.sub(
            r"(const { [^}]+ } = useToast\(\);)",
            r"\1\n  const { user } = useAuth();",
            content
        )

    # 3. Modificar useEffect para verificar user
    # Buscar: useEffect(() => { cargarDatos(); }, []);
    # Reemplazar con verificación de user
    content = re.sub(
        r"useEffect\(\(\) => {\s+cargarDatos\(\);\s+}, \[\]\);",
        r"""useEffect(() => {
    // Solo cargar datos si hay usuario autenticado
    if (user) {
      cargarDatos();
    }
  }, [user]); // Ejecutar cuando cambie el usuario""",
        content,
        flags=re.MULTILINE
    )

    # Similar para cargarTutores, cargarProductos, etc.
    content = re.sub(
        r"useEffect\(\(\) => {\s+(cargarTutores|cargarProductos|cargarMascotas)\(\);\s+}, \[\]\);",
        r"""useEffect(() => {
    // Solo cargar datos si hay usuario autenticado
    if (user) {
      \1();
    }
  }, [user]); // Ejecutar cuando cambie el usuario""",
        content,
        flags=re.MULTILINE
    )

    # 4. Para GestionInventario que ya tiene useAuth pero no verifica
    if 'GestionInventario' in filepath:
        content = re.sub(
            r"useEffect\(\(\) => {\s+cargarProductos\(\);\s+}, \[\]\);",
            r"""useEffect(() => {
    // Solo cargar datos si hay usuario autenticado
    if (user) {
      cargarProductos();
    }
  }, [user]); // Ejecutar cuando cambie el usuario""",
            content,
            flags=re.MULTILINE
        )

    # Guardar solo si hubo cambios
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🔧 Arreglando componentes admin...")
    print("")

    fixed_count = 0
    for filename in FILES_TO_FIX:
        filepath = os.path.join(COMPONENTS_PATH, filename)
        if os.path.exists(filepath):
            if fix_component(filepath):
                print(f"  ✅ {filename} - Arreglado")
                fixed_count += 1
            else:
                print(f"  ⏭️  {filename} - Sin cambios necesarios")
        else:
            print(f"  ❌ {filename} - No encontrado")

    print("")
    print("=" * 50)
    print(f"✨ {fixed_count} archivos modificados")
    print("=" * 50)

if __name__ == "__main__":
    main()
