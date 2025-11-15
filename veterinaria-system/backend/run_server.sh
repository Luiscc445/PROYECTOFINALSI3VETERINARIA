#!/bin/bash

# Script rápido para ejecutar el servidor Django
# (Asume que el setup ya fue completado)

cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    echo "❌ Error: Entorno virtual no encontrado"
    echo "Por favor ejecuta primero: bash setup_and_run.sh"
    exit 1
fi

echo "Activando entorno virtual..."
source venv/bin/activate

echo "Iniciando servidor Django en http://localhost:8000..."
echo "Presiona Ctrl+C para detener"
echo ""

python manage.py runserver 0.0.0.0:8000
