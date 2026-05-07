# Supabase Keep-Alive System

## 📋 Overview

Sistema automatizado que previene que Supabase (free tier) se pause después de 7 días de inactividad. Ejecuta un ping simple cada 6 días mediante GitHub Actions.

---

## 🏗️ Arquitectura

### Componentes:

1. **Netlify Function** (`netlify/functions/ping.ts`)
   - Endpoint: `https://api-natly.netlify.app/.netlify/functions/ping`
   - Método: `GET`
   - Autenticación: Bearer token
   - Acción: Query simple a Supabase

2. **GitHub Actions Workflow** (`.github/workflows/keep-supabase-alive.yml`)
   - Trigger: Cron (cada 6 días a las 3:00 AM UTC)
   - Trigger manual: `workflow_dispatch`
   - Acción: Llama al endpoint de ping con autenticación

3. **Environment Variables**
   - `PING_SECRET`: Token compartido entre GitHub y Netlify

---

## ⚙️ Configuración Inicial

### 1. Generar Secret

```bash
# Genera un token seguro random
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el output (ej: `a1b2c3d4e5f6...`)

---

### 2. Configurar GitHub Secret

1. Ve a: `https://github.com/natlyofficial/Natly/settings/secrets/actions`
2. Click **"New repository secret"**
3. Configura:
    Name: PING_SECRET
    Secret: [pega el token generado]
4. Click **"Add secret"**

---

### 3. Configurar Netlify Environment Variable

1. Ve a: `https://app.netlify.com/sites/api-natly/configuration/deploys#environment-variables`
2. Click **"Add variable"**
3. Configura:
    Name: PING_SECRET
    Secret: [pega el token generado]

4. Click **"Save"**

---

### 4. Deploy

```bash
git add .github/workflows/keep-supabase-alive.yml netlify/functions/ping.ts
git commit -m "feat: add Supabase keep-alive system"
git push origin main
```

Espera 1-2 minutos para que Netlify despliegue la función.

---

## 🧪 Testing

### Opción 1: Trigger Manual en GitHub Actions (RECOMENDADO)

1. Ve a: `https://github.com/natlyofficial/Natly/actions/workflows/keep-supabase-alive.yml`
2. Click **"Run workflow"** (botón derecho)
3. Selecciona branch: **main**
4. Click **"Run workflow"** (botón verde)
5. Espera 10-20 segundos
6. Revisa el resultado:
   - ✅ **Verde** = Funciona correctamente
   - ❌ **Rojo** = Error (revisar logs)

**Para ver logs detallados:**
- Click en el workflow ejecutado
- Click en el job "ping"
- Expande cada paso para ver output

---

### Opción 2: Prueba con cURL (Local)

```bash
# Reemplaza YOUR_SECRET con tu PING_SECRET
curl -H "Authorization: Bearer YOUR_SECRET" \
  https://api-natly.netlify.app/.netlify/functions/ping
```

**Respuesta esperada (éxito):**

```json
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "timestamp": "2026-05-06T18:30:45.123Z"
}
```

**Respuestas de error:**

```json
// Sin/con autenticación incorrecta
{
  "error": "Unauthorized"
}

// Error de Supabase
{
  "success": false,
  "error": "Database query failed",
  "details": "..."
}
```

---

### Opción 3: Verificar en Netlify Function Logs

1. Ve a: `https://app.netlify.com/sites/api-natly/functions/ping`
2. Revisa **"Function log"**
3. Busca entradas como:
    Keep Supabase Alive
    Keep Supabase Alive #1: Manually run by natlyofficial
    main	
    Today at 6:00 PM
    9s

---

## 📅 Cronograma Automático

### Configuración Actual:

```yaml
schedule:
  - cron: '0 3 */6 * *'  # Cada 6 días a las 3:00 AM UTC
```

### Próximas Ejecuciones (desde Mayo 6, 2026):

| Fecha | Hora (UTC) | Hora (Michigan ET) |
|-------|------------|---------------------|
| Mayo 12 | 03:00 | 23:00 (Mayo 11) |
| Mayo 18 | 03:00 | 23:00 (Mayo 17) |
| Mayo 24 | 03:00 | 23:00 (Mayo 23) |
| Mayo 30 | 03:00 | 23:00 (Mayo 29) |

**Nota:** Supabase pausa después de **7 días** de inactividad. El ping cada **6 días** garantiza que nunca se pause.

---

## 🔍 Monitoring

### Verificar Estado del Sistema:

1. **GitHub Actions History:**
   - `https://github.com/natlyofficial/Natly/actions/workflows/keep-supabase-alive.yml`
   - Deberías ver ejecuciones cada 6 días con ✅

2. **Netlify Function Analytics:**
   - `https://app.netlify.com/sites/api-natly/functions`
   - Busca invocaciones de `ping`

3. **Supabase Dashboard:**
   - `https://supabase.com/dashboard/project/etutawclisojjdxtuctk`
   - No debería mostrar mensaje de pausa

---

## 🔒 Seguridad

### Protecciones Implementadas:

- ✅ **Autenticación requerida:** Bearer token en Authorization header
- ✅ **Secret compartido:** Mismo valor en GitHub y Netlify
- ✅ **CORS configurado:** Solo acepta requests autorizados
- ✅ **Service role key segura:** Solo en Netlify env vars (nunca en git)
- ✅ **Logs monitoreados:** Todas las llamadas se registran

### Rotación de Secrets (Recomendado anualmente):

```bash
# 1. Genera nuevo secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Actualiza en GitHub Secrets
# 3. Actualiza en Netlify Environment Variables
# 4. Trigger manual para validar
```

---

## 🐛 Troubleshooting

### Error: "Unauthorized"

**Causa:** `PING_SECRET` no coincide o falta.

**Solución:**
1. Verifica que ambos secrets sean **exactamente iguales**
2. Sin espacios al inicio/final
3. Redeploya Netlify si actualizaste el env var

---

### Error: "Database query failed"

**Causa:** Supabase está pausado o hay problema de conexión.

**Solución:**
1. Ve a Supabase Dashboard
2. Reactiva el proyecto si está pausado
3. Verifica `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`

---

### Workflow no se ejecuta automáticamente

**Causa:** GitHub Actions requiere actividad reciente en el repo.

**Solución:**
- Los scheduled workflows se desactivan si el repo no tiene commits por 60 días
- Haz un commit cada ~50 días o trigger manual ocasional

---

## 📊 Métricas de Éxito

### KPIs:

- ✅ **Uptime de Supabase:** 100% (sin pausas)
- ✅ **Ejecuciones exitosas:** >95% (último mes)
- ✅ **Tiempo de respuesta ping:** <500ms promedio
- ✅ **Errores de autenticación:** 0

### Monitoreo Mensual:

1. Revisa GitHub Actions history
2. Verifica Netlify function logs
3. Confirma que Supabase nunca se pausó

---

## 🔄 Mantenimiento

### Mensual:
- ✅ Revisar logs de GitHub Actions
- ✅ Verificar que no haya errores acumulados

### Trimestral:
- ✅ Validar que el workflow sigue activo
- ✅ Revisar métricas de Netlify Functions

### Anual:
- ✅ Rotar `PING_SECRET`
- ✅ Actualizar dependencias (`@supabase/supabase-js`, `@netlify/functions`)
- ✅ Revisar logs de Supabase para patrones

---

## 📝 Changelog

### v1.0.0 - 2026-05-06
- ✅ Initial implementation
- ✅ GitHub Actions workflow (cron every 6 days)
- ✅ Netlify ping function
- ✅ Authentication with PING_SECRET
- ✅ Comprehensive logging
- ✅ Manual trigger support

---

## 🔗 Referencias

- **Supabase Pausing Policy:** https://supabase.com/docs/guides/platform/going-into-production
- **GitHub Actions Cron Syntax:** https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
- **Netlify Functions Docs:** https://docs.netlify.com/functions/overview/

---

## 📧 Contacto

Para issues o preguntas sobre este sistema:
- GitHub Issues: `https://github.com/natlyofficial/Natly/issues`
- Email: `contact@natly.org`

---

**Última actualización:** Mayo 6, 2026  
**Mantenido por:** Olaff (natlyofficial)