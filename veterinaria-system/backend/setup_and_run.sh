#!/bin/bash

# Script para configurar y ejecutar el servidor Django
# Uso: bash setup_and_run.sh

set -e  # Salir si hay algún error

echo "=================================================="
echo "  SETUP Y EJECUCIÓN DEL BACKEND VETERINARIA"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}[1/5] Creando entorno virtual...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
else
    echo -e "${GREEN}[1/5] Entorno virtual ya existe${NC}"
fi

# 2. Activar entorno virtual
echo -e "${YELLOW}[2/5] Activando entorno virtual...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Entorno virtual activado${NC}"

# 3. Instalar/actualizar dependencias
echo -e "${YELLOW}[3/5] Instalando dependencias...${NC}"
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# 4. Verificar configuración de Django
echo -e "${YELLOW}[4/5] Verificando configuración de Django...${NC}"
python manage.py check
echo -e "${GREEN}✓ Configuración correcta${NC}"

# 5. Ejecutar migraciones (si es necesario)
echo -e "${YELLOW}[5/5] Aplicando migraciones...${NC}"
python manage.py migrate --noinput
echo -e "${GREEN}✓ Migraciones aplicadas${NC}"

echo ""
echo "=================================================="
echo -e "${GREEN}  ✓ SETUP COMPLETADO${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}Iniciando servidor Django en http://localhost:8000...${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener el servidor${NC}"
echo ""

# Ejecutar servidor
python manage.py runserver 0.0.0.0:8000
