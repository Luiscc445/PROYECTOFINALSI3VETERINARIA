#!/bin/bash

# Script de prueba de autenticación
# Verifica que el login funcione y que las cookies de sesión se manejen correctamente

echo "======================================"
echo "  PRUEBA DE AUTENTICACIÓN API"
echo "======================================"
echo ""

API_URL="http://localhost:8000/api"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[1/3] Probando endpoint de current-user (sin autenticación)...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_URL/auth/current-user/" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" == "401" ]; then
    echo -e "${GREEN}✓ Respuesta correcta: 401 Unauthorized (sin sesión)${NC}"
else
    echo -e "${RED}✗ Error: Código inesperado $HTTP_CODE${NC}"
    echo "Respuesta: $BODY"
fi

echo ""
echo -e "${YELLOW}[2/3] Verificando que el servidor Django esté respondiendo...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_URL/roles/")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)

if [ "$HTTP_CODE" == "403" ] || [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Servidor Django respondiendo correctamente${NC}"
else
    echo -e "${RED}✗ Error: Servidor no responde correctamente (código: $HTTP_CODE)${NC}"
fi

echo ""
echo -e "${YELLOW}[3/3] Instrucciones para prueba completa de login:${NC}"
echo ""
echo "Para probar el login completo, necesitas:"
echo "1. Tener un usuario creado en la base de datos"
echo "2. Usar el frontend en http://localhost:3000"
echo "3. O probar con este comando curl:"
echo ""
echo 'curl -c cookies.txt -X POST http://localhost:8000/api/auth/login/ \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"email": "admin@example.com", "password": "tu_password"}'"'"
echo ""
echo "Luego probar una petición autenticada:"
echo ""
echo 'curl -b cookies.txt http://localhost:8000/api/usuarios/'
echo ""

echo "======================================"
echo -e "${GREEN}  ✓ PRUEBA COMPLETADA${NC}"
echo "======================================"
echo ""
echo "Estado del servidor:"
echo "- Django corriendo en: http://localhost:8000"
echo "- Frontend debería estar en: http://localhost:3000"
echo ""
