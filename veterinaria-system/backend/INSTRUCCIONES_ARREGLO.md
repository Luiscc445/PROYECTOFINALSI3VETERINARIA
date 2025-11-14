# Instrucciones para Arreglar la Tabla api_recetamedicamento

## Problema
La tabla `api_recetamedicamento` no existe o tiene una estructura incorrecta en Supabase.

## Solución en 3 Pasos

### PASO 1: Ejecutar SQL en Supabase

1. Abre tu proyecto en Supabase: https://supabase.com
2. Ve a **SQL Editor** (en el menú lateral izquierdo)
3. Crea una nueva query
4. Copia y pega TODO el contenido del archivo: `create_receta_table.sql`
5. Haz clic en **RUN** (o presiona Ctrl+Enter)
6. Deberías ver: "Success. No rows returned"

### PASO 2: Verificar que la tabla se creó correctamente

Ejecuta en tu terminal (con el venv activado):

```bash
python fix_migration_state.py
```

Este script verificará:
- ✓ Que la tabla existe
- ✓ Que tiene todas las columnas correctas
- ✓ Que la migración está marcada como aplicada

Si todo está bien, verás: "✓ TODO ESTÁ CORRECTO"

### PASO 3: Poblar la base de datos con datos realistas

Una vez que el paso 2 muestre todo correcto, ejecuta:

```bash
python seed_realistic_data.py
```

Esto creará:
- 3 tutores realistas (con CI y direcciones de Quito)
- 5 veterinarios con diferentes especialidades
- 7 mascotas asignadas a los tutores
- 10 citas médicas
- 8 historiales médicos
- 4 productos de inventario

## Credenciales para Probar

Después de ejecutar el seed, puedes iniciar sesión con:

**Tutores:**
- Email: maria.lopez@gmail.com | Password: tutor123
- Email: carlos.mendez@gmail.com | Password: tutor123
- Email: ana.rodriguez@gmail.com | Password: tutor123

**Veterinarios:**
- Email: dra.martinez@veterinaria.com | Password: vet123 (Cirugía)
- Email: dr.gomez@veterinaria.com | Password: vet123 (Medicina General)

**Admin:**
- Email: admin@veterinaria.com | Password: admin123

## ¿Algo salió mal?

Si en el PASO 2 ves errores:
1. Vuelve a ejecutar el SQL del PASO 1 en Supabase
2. Asegúrate de copiar TODO el contenido del archivo create_receta_table.sql
3. Verifica que no haya errores de sintaxis en el SQL Editor

Si el seed_realistic_data.py da error:
1. Revisa que el PASO 2 haya pasado correctamente
2. Verifica tu conexión a Supabase en el archivo .env
