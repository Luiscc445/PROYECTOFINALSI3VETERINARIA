# 🔧 Solución de Problemas - Login

Si el login no funciona, sigue estos pasos en orden:

---

## ✅ Paso 1: Verificar que el Backend esté corriendo

### Windows (PowerShell):
```powershell
cd veterinaria-system\backend
.\venv\Scripts\activate
python manage.py runserver
```

### Linux/Mac:
```bash
cd veterinaria-system/backend
source venv/bin/activate
python manage.py runserver
```

**Deberías ver:**
```
Starting development server at http://127.0.0.1:8000/
```

Si no ves esto, el backend NO está corriendo y el login no funcionará.

---

## ✅ Paso 2: Verificar que el Frontend esté corriendo

En **otra terminal**:

```bash
cd veterinaria-system/frontend
npm start
```

**Deberías ver:**
```
Compiled successfully!
You can now view veterinaria-frontend in the browser.
Local: http://localhost:3000
```

---

## ✅ Paso 3: Diagnosticar los usuarios en la BD

Ejecuta el script de diagnóstico:

```bash
cd veterinaria-system/backend
python manage.py check_auth
```

**Salida esperada:**
```
🔍 DIAGNÓSTICO DE AUTENTICACIÓN
======================================================================

1️⃣  Verificando roles...
  ✓ administrador
  ✓ veterinario
  ✓ tutor

2️⃣  Verificando usuarios...
  ✓ admin@vet.com - administrador - Activo: True
  ✓ vet@vet.com - veterinario - Activo: True
  ✓ tutor@vet.com - tutor - Activo: True

  Total: 6 usuarios

3️⃣  Verificando hashes de contraseñas...
  Usuario: admin@vet.com
  ✓ Formato de hash correcto (pbkdf2_sha256)
  ✓ Contraseña "admin123" verifica correctamente

  ...
```

### Si ves errores:
- **"No hay usuarios en la BD"** → Ejecuta `python manage.py rebuild_database`
- **"Contraseña NO verifica"** → Los hashes están mal, ejecuta `python manage.py rebuild_database`

---

## ✅ Paso 4: Reconstruir la base de datos

Si el diagnóstico muestra problemas:

```bash
python manage.py rebuild_database
```

Esto creará:
- ✅ 6 usuarios con contraseñas hasheadas correctamente
- ✅ 3 tutores
- ✅ 5 mascotas
- ✅ 4 productos
- ✅ 4 citas
- ✅ 3 historiales

---

## ✅ Paso 5: Probar el Login

1. Ve a http://localhost:3000
2. Selecciona el rol: **Administrador** (👨‍💼)
3. Email: `admin@vet.com`
4. Password: `admin123`
5. Click en "Iniciar Sesión como Administrador"

### Mensajes de error comunes:

#### ❌ "No se pudo conectar con el servidor"
**Causa:** El backend no está corriendo en http://localhost:8000

**Solución:**
```bash
cd veterinaria-system/backend
python manage.py runserver
```

#### ❌ "Credenciales inválidas"
**Causa:** Email o contraseña incorrectos, o el hash no funciona

**Solución:**
```bash
# Reconstruir BD
python manage.py rebuild_database

# Luego intenta:
# Email: admin@vet.com
# Password: admin123
```

#### ❌ "Este usuario no tiene permisos de Administrador"
**Causa:** Estás intentando hacer login con un usuario que tiene un rol diferente

**Solución:**
- Si usas `admin@vet.com`, selecciona rol **Administrador**
- Si usas `vet@vet.com`, selecciona rol **Veterinario**
- Si usas `tutor@vet.com`, selecciona rol **Tutor**

---

## ✅ Paso 6: Verificar en la Consola del Navegador

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Busca los mensajes que empiecen con:
   - `Error completo:`
   - `Response:`

Estos te dirán exactamente qué está fallando.

---

## 📝 Credenciales Correctas

### Opción 1: Solo 3 usuarios
Si ejecutaste `python manage.py reset_users`:
- Admin: `admin@vet.com / admin123`
- Veterinario: `vet@vet.com / vet123`
- Tutor: `tutor@vet.com / tutor123`

### Opción 2: Base de datos completa
Si ejecutaste `python manage.py rebuild_database`:
- Admin: `admin@vet.com / admin123`
- Veterinario 1: `vet@vet.com / vet123`
- Veterinario 2: `vet2@vet.com / vet123`
- Tutor 1: `tutor@vet.com / tutor123`
- Tutor 2: `tutor2@vet.com / tutor123`
- Tutor 3: `tutor3@vet.com / tutor123`

---

## 🐛 Aún no funciona?

### Verifica PostgreSQL

```bash
# Ver si PostgreSQL está corriendo
# Windows:
Get-Service postgresql*

# Linux:
sudo systemctl status postgresql

# Mac:
brew services list
```

Si PostgreSQL NO está corriendo, inícialo:
```bash
# Windows:
Start-Service postgresql-x64-14  # (o tu versión)

# Linux:
sudo systemctl start postgresql

# Mac:
brew services start postgresql
```

### Verifica la conexión a la BD

```bash
cd veterinaria-system/backend
python manage.py dbshell
```

Si esto funciona, estás conectado a la BD. Sal con `\q`

---

## 💡 Resumen Rápido

```bash
# 1. Iniciar backend
cd veterinaria-system/backend
python manage.py runserver

# 2. Iniciar frontend (en otra terminal)
cd veterinaria-system/frontend
npm start

# 3. Si el login falla, diagnosticar:
cd veterinaria-system/backend
python manage.py check_auth

# 4. Si hay problemas, reconstruir:
python manage.py rebuild_database

# 5. Probar login:
# http://localhost:3000
# admin@vet.com / admin123
```

---

## ✅ Lista de Verificación

- [ ] Backend corriendo en http://localhost:8000
- [ ] Frontend corriendo en http://localhost:3000
- [ ] PostgreSQL corriendo
- [ ] Base de datos reconstruida con `rebuild_database`
- [ ] Usando las credenciales correctas
- [ ] Seleccionado el rol correcto en el login

Si todo está marcado y aún no funciona, revisa la consola del navegador para ver el error específico.
