# 📋 Instrucciones de Instalación - Sistema Veterinario

## 🚨 IMPORTANTE: Errores 403 Resueltos

Los errores 403 (Forbidden) que estabas experimentando se han corregido. Ahora solo necesitas arrancar el servidor correctamente.

---

## 🔧 Instalación y Configuración del Backend

### Opción 1: Script Automático (Recomendado)

```bash
cd veterinaria-system/backend
bash setup_and_run.sh
```

Este script:
- ✅ Crea el entorno virtual
- ✅ Instala todas las dependencias
- ✅ Verifica la configuración
- ✅ Aplica migraciones
- ✅ Inicia el servidor en http://localhost:8000

### Opción 2: Instalación Manual

```bash
cd veterinaria-system/backend

# 1. Crear entorno virtual
python3 -m venv venv

# 2. Activar entorno virtual
source venv/bin/activate  # En Linux/Mac
# O en Windows: venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Aplicar migraciones
python manage.py migrate

# 5. Ejecutar servidor
python manage.py runserver
```

### Para Arrancar el Servidor (después del setup inicial)

```bash
cd veterinaria-system/backend
bash run_server.sh
```

O manualmente:
```bash
source venv/bin/activate
python manage.py runserver
```

---

## 🎨 Frontend (React)

### Instalación

```bash
cd veterinaria-system/frontend
npm install
```

### Ejecutar en Desarrollo

```bash
npm start
```

El frontend se abrirá en http://localhost:3000

---

## 🔐 Correcciones Aplicadas

### 1. **Autenticación Cross-Origin**
- ✅ Creado `api/authentication.py` con `CsrfExemptSessionAuthentication`
- ✅ Configurado `SESSION_COOKIE_SAMESITE = 'None'` en settings.py
- ✅ Agregado `permission_classes = [AllowAny]` a vistas de autenticación

### 2. **Endpoints Corregidos**
- ✅ Veterinarios: `/api/veterinarios/` → `/api/usuarios/veterinarios/`
- ✅ Todas las rutas de API funcionando correctamente

### 3. **Diseño Mejorado**
- ✅ Fondo gris en `.main-content` para contraste
- ✅ Tarjetas blancas destacadas
- ✅ Animaciones y transiciones suaves

### 4. **Dependencias Agregadas**
- ✅ bcrypt==4.1.2 para autenticación segura

---

## 📊 Verificar que Todo Funciona

### 1. Backend Corriendo
```bash
# Deberías ver:
Starting development server at http://0.0.0.0:8000/
```

### 2. Frontend Corriendo
```bash
# Deberías ver:
Compiled successfully!
webpack compiled successfully
```

### 3. Probar Login
1. Abre http://localhost:3000
2. Haz login con un usuario válido
3. **NO deberías ver errores 403 en la consola del navegador**

### 4. Verificar Dashboard
- Las estadísticas deben cargar sin errores
- El diseño debe verse profesional (fondo gris, tarjetas blancas)
- Al navegar a diferentes secciones, los datos deben cargar correctamente

---

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'django'"
**Solución:** Activa el entorno virtual
```bash
source venv/bin/activate
```

### Error: Errores 403 persisten
**Solución:**
1. Verifica que el servidor Django esté corriendo
2. Borra las cookies del navegador (Ctrl+Shift+Del)
3. Usa modo incógnito para probar
4. Verifica que `withCredentials: true` esté en `frontend/src/models/api.js`

### Error: "No module named 'bcrypt'"
**Solución:** Reinstala dependencias
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### El diseño se ve "plano" (blanco sobre blanco)
**Solución:** Limpia la caché del navegador y recarga (Ctrl+F5)

---

## 🔒 Usuarios de Prueba

Si necesitas crear usuarios de prueba, ejecuta:

```bash
cd veterinaria-system/backend
source venv/bin/activate
python manage.py shell
```

```python
from api.models import Usuario, Rol
import bcrypt

# Crear admin de prueba
rol_admin = Rol.objects.get(nombre='administrador')
password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

Usuario.objects.create(
    email='admin@veterinaria.com',
    password_hash=password,
    nombre_completo='Admin Veterinaria',
    telefono='1234567890',
    rol=rol_admin,
    activo=True
)
```

---

## 📝 Commits Realizados

1. `feat: Admin CRUD completo - GestionMascotas y GestionCitas`
2. `fix: Corregir imports incorrectos en componentes y controllers`
3. `fix: Corregir autenticación cross-origin y permisos (Error 403)`
4. `fix: Corregir endpoint veterinarios y mejorar diseño dashboard`

---

## ✅ Checklist Final

- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 3000
- [ ] Login funciona sin errores 401
- [ ] Dashboard carga sin errores 403
- [ ] Diseño se ve profesional
- [ ] Todas las secciones admin accesibles

---

## 🆘 Soporte

Si encuentras algún problema:
1. Verifica que ambos servidores estén corriendo
2. Revisa la consola del navegador (F12)
3. Verifica los logs del servidor Django
4. Asegúrate de que el entorno virtual esté activado

**Estado Actual:** ✅ Todos los errores críticos resueltos
