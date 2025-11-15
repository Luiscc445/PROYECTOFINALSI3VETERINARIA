# 🎯 CÓMO PROBAR EL LOGIN - PASOS SIMPLES

## ✅ Estado Actual: El servidor Django YA está corriendo

No necesitas hacer nada con el backend. Ya está funcionando en puerto 8000.

---

## 📝 PASOS PARA PROBAR (3 pasos)

### **Paso 1: Limpia las cookies del navegador**

**Opción A (Recomendada):** Usa modo incógnito
- Chrome/Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

**Opción B:** Limpia las cookies
1. Presiona `F12` (abre DevTools)
2. Ve a la pestaña "Application" o "Aplicación"
3. En el panel izquierdo: Storage → Clear site data
4. Click en "Clear site data"

---

### **Paso 2: Abre el frontend**

```
http://localhost:3000
```

Si no está corriendo, ábrelo con:
```bash
cd veterinaria-system/frontend
npm start
```

---

### **Paso 3: Haz login**

Usa las credenciales de un usuario que **ya tenías creado antes**.

**Ejemplo:**
- Email: `admin@example.com` (o el que tú creaste)
- Password: `tu_password`

---

## ❓ ¿Qué Cambió?

**Antes:** Funcionaba normal

**Ahora:** Cambié la configuración de cookies de `SameSite=None` a `SameSite=Lax`

**¿Por qué?**
- `SameSite=None` requiere HTTPS (producción)
- `SameSite=Lax` funciona en localhost (desarrollo)
- Era eso lo que causaba los errores 403

---

## 🔍 ¿Cómo Saber Si Funciona?

### ✅ SI FUNCIONA, verás:
- Login exitoso
- Dashboard carga con datos
- **NO hay errores 403 en la consola** (F12)

### ❌ SI NO FUNCIONA, verás:
- Errores 403 en la consola
- Dashboard vacío
- No te deja entrar

---

## 🐛 Si Sigues Viendo Errores 403

**Opción 1:** Verifica que el servidor esté corriendo
```bash
curl http://localhost:8000/api/auth/current-user/
```

**Debería responder:**
```json
{"error":"No hay sesión activa"}
```

**Opción 2:** Asegúrate de que el frontend esté en localhost:3000

Abre DevTools (F12) → Network → ve la URL de las peticiones.
Deben ir a `http://localhost:8000/api/...`

**Opción 3:** Verifica que tengas un usuario creado

Si no tienes usuarios:
```bash
cd veterinaria-system/backend
source venv/bin/activate
python manage.py createsuperuser
```

---

## 📊 Resumen Visual

```
┌─────────────────┐
│   Navegador     │
│  (modo incóg)   │
│                 │
│ localhost:3000  │ ← Frontend React
└────────┬────────┘
         │
         │ API requests
         │ withCredentials: true
         ▼
┌─────────────────┐
│  Django Server  │
│                 │
│ localhost:8000  │ ← Backend (YA corriendo)
└─────────────────┘
```

---

## 🎯 LO MÁS IMPORTANTE

1. **Backend YA está corriendo** (no necesitas hacer nada)
2. **Solo necesitas:** Abrir modo incógnito + hacer login
3. **Si funcionaba antes**, debería funcionar ahora

---

## 💡 Explicación Técnica (opcional)

El error 403 era por la configuración de cookies:

**Antes (mi cambio que causó problemas):**
```python
SESSION_COOKIE_SAMESITE = 'None'  # ❌ Requiere HTTPS
```

**Ahora (arreglado):**
```python
SESSION_COOKIE_SAMESITE = 'Lax'   # ✅ Funciona en localhost
```

Las cookies con `SameSite=None` requieren `Secure=True` (HTTPS).
En desarrollo local no tenemos HTTPS, por eso fallaba.

---

## ✅ Checklist Rápido

- [ ] Modo incógnito abierto
- [ ] Frontend en http://localhost:3000
- [ ] Backend corriendo (ya está, no tocar)
- [ ] Login con usuario existente
- [ ] Sin errores 403 en consola

**¿Todo listo?** ¡Prueba ahora mismo!
