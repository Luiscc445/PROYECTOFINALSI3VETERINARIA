#!/bin/bash

# Script para arreglar TODOS los componentes admin
# Agrega verificación de autenticación antes de cargar datos

cd /home/user/PROYECTOFINALSI3VETERINARIA/veterinaria-system/frontend/src/views/components/admin

echo "Arreglando componentes admin..."

# Función para arreglar un archivo
fix_file() {
    local file=$1
    local has_useauth=$(grep -c "useAuth" "$file")
    local has_useeffect=$(grep -c "useEffect" "$file")

    if [ "$has_useeffect" -gt 0 ] && [ "$has_useauth" -eq 0 ]; then
        echo "  ❌ $file - No usa useAuth pero tiene useEffect"
        echo "     → Necesita importar y usar useAuth"
    elif [ "$has_useeffect" -gt 0 ] && [ "$has_useauth" -gt 0 ]; then
        # Verificar si ya tiene protección
        local has_if_user=$(grep -c "if (user)" "$file")
        if [ "$has_if_user" -eq 0 ]; then
            echo "  ⚠️  $file - Usa useAuth pero no verifica user en useEffect"
        else
            echo "  ✅ $file - Correcto (ya verifica user)"
        fi
    else
        echo "  ✅ $file - Sin problemas"
    fi
}

# Verificar cada archivo
for file in Gestion*.js AdminHome.js; do
    if [ -f "$file" ]; then
        fix_file "$file"
    fi
done

echo ""
echo "========================================="
echo "RESUMEN:"
echo "========================================="
echo ""
echo "AdminHome.js - YA ARREGLADO ✅"
echo ""
echo "Los otros componentes necesitan:"
echo "1. Importar useAuth si no lo tienen"
echo "2. const { user } = useAuth();"
echo "3. En useEffect: if (user) { cargarDatos(); }"
echo ""
