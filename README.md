# 🛡️ Defiéndete MX

> **Versión 2.0** - Rediseño completo con interfaz moderna y atractiva

Aplicación web progresiva (PWA) desarrollada con **Next.js 14** y **Tailwind CSS**, diseñada para brindar **información legal inmediata** en casos de detenciones, abusos policiales y situaciones de emergencia en México.

## 🌐 Live Demo

**Production:** https://defiendete-mx.pages.dev

Deployed on Cloudflare Pages with automatic HTTPS and global CDN.

---

## ✨ Nuevo en v2.0

### 🎨 Diseño Completamente Renovado
- **Hero impactante** con gradientes animados y elementos flotantes
- **Glassmorphism** y efectos visuales modernos
- **Animaciones suaves** y microinteracciones elegantes
- **Sistema de diseño cohesivo** con componentes reutilizables
- **Paleta de colores vibrante** (púrpura, índigo, rosa)

### 🚀 Mejoras de UX/UI
- **Navegación intuitiva** con header glassmorphism
- **Cards premium** con hover effects y gradientes
- **Botón SOS destacado** con animación pulse-glow
- **Loading states elegantes** con spinners animados
- **Páginas de error atractivas** (404, error, offline)

### 📱 Mobile-First
- **Responsive design impecable** en todos los dispositivos
- **Menú hamburguesa animado** para móviles
- **Touch targets optimizados** (44x44px mínimo)
- **Gestos táctiles fluidos**

### ♿ Accesibilidad Mejorada
- **WCAG 2.1 AA compliant**
- **ARIA labels** en todos los elementos interactivos
- **Navegación por teclado** completa
- **Focus states visibles** y consistentes
- **Contraste de color optimizado**

---

## 📌 Características Principales

### 🎯 Funcionalidades Core
- ✅ **Escenarios Legales Verificados** - 3 escenarios con información detallada
- ✅ **Botón SOS 911** - Acceso rápido a emergencias
- ✅ **Recursos Descargables** - Guías y documentos legales
- ✅ **PWA Offline** - Funciona sin conexión a internet
- ✅ **Información Verificada** - Contenido revisado por expertos legales

### 🎨 Características Visuales
- ✅ **Gradientes Animados** - Fondos dinámicos y atractivos
- ✅ **Glassmorphism** - Efectos de vidrio esmerilado
- ✅ **Hover Effects** - Interacciones visuales elegantes
- ✅ **Animaciones Suaves** - Transiciones fluidas
- ✅ **Iconografía Moderna** - Emojis nativos sin dependencias

---

## 🏗️ Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **PWA:** next-pwa
- **Fonts:** Google Fonts (Inter, Poppins)
- **Deployment:** Cloudflare Pages
- **Performance:** Optimizado para Lighthouse >90

---

## 📂 Estructura del Proyecto

```
/defiendete-mx
 ├─ /app
 │   ├─ /components
 │   │   ├─ /ui              # Componentes base (Button, Card, Badge)
 │   │   ├─ /layout          # Header, Footer
 │   │   └─ /features        # Hero, Scenarios, Features
 │   ├─ /data
 │   │   └─ scenarios.js     # Datos de escenarios legales
 │   ├─ /recursos            # Página de recursos
 │   ├─ /offline             # Página offline
 │   ├─ layout.js            # Layout raíz
 │   ├─ page.js              # Página principal
 │   ├─ error.js             # Página de error
 │   ├─ not-found.js         # Página 404
 │   ├─ loading.js           # Estado de carga
 │   └─ globals.css          # Estilos globales
 ├─ /public
 │   ├─ /icons               # Iconos PWA
 │   ├─ manifest.json        # Manifest PWA
 │   └─ sw.js               # Service Worker
 ├─ tailwind.config.js       # Config Tailwind
 ├─ next.config.js           # Config Next.js
 ├─ REDESIGN_SUMMARY.md      # Resumen del rediseño
 ├─ DESIGN_SYSTEM.md         # Sistema de diseño
 └─ DEVELOPMENT_GUIDE.md     # Guía de desarrollo
```

---

## ⚡ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/usuario/defiendete-mx.git
cd defiendete-mx

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run deploy   # Deploy a Cloudflare Pages
```

---

## 🎨 Sistema de Diseño

### Componentes UI Disponibles

```jsx
// Button
<Button variant="primary" size="lg" icon="🚨">
  Texto del botón
</Button>

// Card
<Card variant="glass" hover={true}>
  Contenido
</Card>

// Badge
<Badge variant="success" icon="✓">
  Etiqueta
</Badge>
```

Para más información, consulta [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

---

## 📊 Performance

- **First Load JS:** ~100KB
- **Build Time:** <30s
- **Lighthouse Score:** >90 en todas las categorías
- **PWA Ready:** ✅
- **Offline Support:** ✅

---

## 🌐 Deployment

### Cloudflare Pages

```bash
# Build
npm run build

# Deploy
npm run deploy
```

### Variables de Entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 📚 Documentación

**📖 Índice Completo:** [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md) - Índice de toda la documentación (31+ documentos)

### 🚀 Documentos Principales
- [`README.md`](./README.md) - Este archivo (información general)
- [`PROJECT_STATUS_SUMMARY.md`](./PROJECT_STATUS_SUMMARY.md) - Resumen ejecutivo del proyecto
- [`ISSUES_STATUS.md`](./ISSUES_STATUS.md) - Estado de issues completados
- [`CHANGELOG.md`](./CHANGELOG.md) - Historial de cambios detallado

### 💻 Para Desarrolladores
- [`QUICK_START_GUIDE.md`](./QUICK_START_GUIDE.md) - Inicio rápido general
- [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md) - Guía de desarrollo
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) - Documentación completa de API
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) - Sistema de diseño

### 🔐 Backend & Seguridad
- [`AUTHENTICATION_GUIDE.md`](./AUTHENTICATION_GUIDE.md) - Guía de autenticación
- [`ISSUE_MODEL_DOCUMENTATION.md`](./ISSUE_MODEL_DOCUMENTATION.md) - Modelo de datos
- [`SMS_NOTIFICATION_GUIDE.md`](./SMS_NOTIFICATION_GUIDE.md) - Sistema de notificaciones
- [`VOICE_RECORDER_DOCUMENTATION.md`](./VOICE_RECORDER_DOCUMENTATION.md) - Grabador de voz

### 🚀 Deployment
- [`DEPLOYMENT_INSTRUCTIONS.md`](./DEPLOYMENT_INSTRUCTIONS.md) - Instrucciones de deployment
- [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) - Checklist de deployment

---

## ✅ Issues Completados

### Backend & API (Issues #6-10)
- ✅ **Issue #6** - Modelo de datos para Issues (50+ campos, validación completa)
- ✅ **Issue #7** - Servicio CRUD para Issues (9 endpoints RESTful)
- ✅ **Issue #8** - Flujo de autenticación seguro (JWT, sesiones, protección)
- ✅ **Issue #9** - Grabador de voz con análisis de IA (transcripción, emociones)
- ✅ **Issue #10** - Sistema de notificaciones SMS (Twilio, alertas de emergencia)

**Métricas:**
- 📝 50+ archivos creados
- 💻 15,000+ líneas de código
- 🧪 200+ pruebas unitarias
- 📚 15+ documentos técnicos
- 🚀 25+ endpoints API

Ver detalles completos en [`ISSUES_STATUS.md`](./ISSUES_STATUS.md)

---

## 🧩 Roadmap

### Próximas Funcionalidades
- [ ] Descarga real de PDFs
- [ ] Sistema de búsqueda de escenarios
- [ ] Favoritos guardados localmente
- [ ] Compartir en redes sociales
- [ ] Notificaciones push y email
- [ ] Modo oscuro
- [ ] Soporte multiidioma (inglés)
- [ ] WhatsApp SOS integration
- [ ] Chatbot legal con IA
- [ ] Dashboard de administración

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Uso educativo y de protección ciudadana.

---

## 🛠️ Autor

**Sebastián Vernis**

- 🌐 Website: [sebastianvernis.com](https://sebastianvernis.com)
- 📧 Email: contacto@sebastianvernis.com
- 💼 LinkedIn: [Sebastian Vernis](https://linkedin.com/in/sebastianvernis)

---

## 🙏 Agradecimientos

- Comisión Nacional de Derechos Humanos (CNDH)
- Fiscalía General de la República
- Comunidad de desarrolladores de Next.js y Tailwind CSS

---

## 📞 Contacto de Emergencia

**En caso de emergencia, llama al:**

🚨 **911** - Emergencias  
👮 **089** - Denuncia Anónima  
📞 **CNDH** - [www.cndh.org.mx](https://www.cndh.org.mx)

---

<div align="center">

**Hecho con 💜 para proteger tus derechos**

[⬆ Volver arriba](#️-defiéndete-mx)

</div>
