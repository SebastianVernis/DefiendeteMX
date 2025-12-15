# 📱 Guía de PWA - Defiéndete MX

## 🎯 Características PWA Implementadas

### ✅ Funcionalidades Principales

1. **Instalable en Dispositivos**
   - Compatible con Android, iOS, Windows, macOS, Linux
   - Icono en pantalla de inicio
   - Splash screen personalizado
   - Modo standalone (sin barra del navegador)

2. **Funcionamiento Offline**
   - Service Worker con estrategias de caché inteligentes
   - Página offline personalizada
   - Caché de recursos estáticos (CSS, JS, imágenes)
   - Caché de fuentes de Google Fonts

3. **Prompt de Instalación Personalizado**
   - Componente `InstallPWA` con diseño atractivo
   - Se muestra automáticamente después de 10 segundos
   - Opción de recordatorio (no mostrar por 7 días)
   - Detección de instalación exitosa

4. **Notificaciones de Actualización**
   - Detecta cuando hay nueva versión disponible
   - Prompt para actualizar la aplicación
   - Actualización sin pérdida de datos

5. **Manifest.json Completo**
   - Metadata de la aplicación
   - Iconos en múltiples tamaños (72x72 hasta 512x512)
   - Shortcuts para acceso rápido
   - Share target para compartir contenido

## 📂 Estructura de Archivos PWA

```
/public
  /icons
    - icon-72x72.svg
    - icon-96x96.svg
    - icon-128x128.svg
    - icon-144x144.svg
    - icon-152x152.svg
    - icon-192x192.svg
    - icon-384x384.svg
    - icon-512x512.svg
  - manifest.json
  - sw.js (generado automáticamente por next-pwa)
  - offline.html

/app
  /components
    /layout
      - Header.jsx (Navegación principal)
      - Footer.jsx (Footer modular)
      - Sidebar.jsx (Menú móvil)
      - InstallPWA.jsx (Prompt de instalación)
  /offline
    - page.js (Página offline de Next.js)
  - layout.js (Layout principal con metadata PWA)
  - page.js (Página principal actualizada)
```

## 🚀 Configuración

### next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Estrategias de caché configuradas
  ]
});
```

### Estrategias de Caché

1. **CacheFirst**: Fuentes, audio, video
2. **StaleWhileRevalidate**: Imágenes, CSS, JS
3. **NetworkFirst**: Datos JSON, páginas HTML

## 🔧 Componentes Principales

### 1. Header.jsx
- Navegación sticky responsive
- Integración con UserMenu
- Sidebar para móviles
- Links de navegación

### 2. Footer.jsx
- Footer modular y reutilizable
- Enlaces organizados por categorías
- Información de emergencia
- Redes sociales

### 3. Sidebar.jsx
- Menú lateral para móviles
- Animaciones suaves
- Cierre con ESC o backdrop
- Información de usuario

### 4. InstallPWA.jsx
- Prompt de instalación personalizado
- Detección de beforeinstallprompt
- Notificaciones de actualización
- Recordatorio inteligente (7 días)

## 📱 Instalación de la PWA

### En Android (Chrome/Edge)

1. Abre la aplicación en el navegador
2. Espera el prompt de instalación o toca el menú (⋮)
3. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"
4. Confirma la instalación

### En iOS (Safari)

1. Abre la aplicación en Safari
2. Toca el botón de compartir (□↑)
3. Desplázate y selecciona "Agregar a pantalla de inicio"
4. Confirma el nombre y toca "Agregar"

### En Desktop (Chrome/Edge)

1. Abre la aplicación en el navegador
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar"
4. La aplicación se abrirá en una ventana independiente

## 🧪 Pruebas de PWA

### Verificar Service Worker

```javascript
// En la consola del navegador
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers registrados:', registrations);
});
```

### Verificar Manifest

1. Abre DevTools (F12)
2. Ve a la pestaña "Application" o "Aplicación"
3. En el menú lateral, selecciona "Manifest"
4. Verifica que todos los campos estén correctos

### Probar Modo Offline

1. Abre DevTools (F12)
2. Ve a la pestaña "Network" o "Red"
3. Cambia a "Offline" en el dropdown
4. Recarga la página
5. Deberías ver la página offline o contenido en caché

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `/public/manifest.json`:

```json
{
  "theme_color": "#1e40af",
  "background_color": "#1e40af"
}
```

### Modificar Iconos

1. Reemplaza los archivos SVG en `/public/icons/`
2. Mantén los mismos nombres y tamaños
3. Actualiza el manifest.json si cambias los formatos

### Ajustar Estrategias de Caché

Edita `next.config.js` en la sección `runtimeCaching`:

```javascript
{
  urlPattern: /\.(?:png|jpg|jpeg|svg)$/i,
  handler: 'CacheFirst', // o 'NetworkFirst', 'StaleWhileRevalidate'
  options: {
    cacheName: 'images',
    expiration: {
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
    }
  }
}
```

## 🐛 Solución de Problemas

### El Service Worker no se registra

1. Verifica que estés en HTTPS o localhost
2. Revisa la consola del navegador por errores
3. Asegúrate de que `next-pwa` esté instalado correctamente

### La aplicación no se puede instalar

1. Verifica que el manifest.json sea válido
2. Asegúrate de tener al menos un icono de 192x192 y 512x512
3. Verifica que `display: "standalone"` esté en el manifest

### El contenido offline no funciona

1. Verifica que el Service Worker esté activo
2. Revisa las estrategias de caché en next.config.js
3. Asegúrate de que los recursos estén siendo cacheados

### El prompt de instalación no aparece

1. Verifica que la app no esté ya instalada
2. Asegúrate de cumplir con los criterios de instalación de PWA
3. Revisa que el componente InstallPWA esté montado

## 📊 Métricas y Auditoría

### Lighthouse Audit

1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Haz clic en "Generate report"
5. Objetivo: Score > 90

### Criterios de PWA

- ✅ Servido sobre HTTPS
- ✅ Responsive en móviles
- ✅ Funciona offline
- ✅ Tiene manifest.json válido
- ✅ Tiene Service Worker registrado
- ✅ Tiene iconos apropiados
- ✅ Carga rápida (< 3s)

## 🔄 Actualizaciones

### Desplegar Nueva Versión

1. Realiza cambios en el código
2. Ejecuta `npm run build`
3. Despliega a producción
4. El Service Worker detectará la actualización
5. Los usuarios verán el prompt de actualización

### Forzar Actualización

```javascript
// En InstallPWA.jsx
const handleUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
    window.location.reload();
  }
};
```

## 📚 Recursos Adicionales

- [Next.js PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)

## 🎉 Características Futuras

- [ ] Push Notifications
- [ ] Background Sync
- [ ] Periodic Background Sync
- [ ] Web Share API
- [ ] File System Access API
- [ ] Badging API

---

**Desarrollado con ❤️ para Defiéndete MX**
