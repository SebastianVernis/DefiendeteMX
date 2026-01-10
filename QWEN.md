# 🎯 QWEN.md - DefiendeteMX

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | DefiendeteMX |
| **Versión** | 2.0.0 |
| **Estado** | ✅ PRODUCCIÓN |
| **Tipo** | PWA (Progressive Web App) |
| **Categoría** | Información Legal de Emergencia |
| **Fecha de Análisis** | 2026-01-09 |

---

## 🎯 Propósito del Proyecto

Aplicación web progresiva (PWA) que proporciona información legal inmediata para situaciones de emergencia en México. Diseñada para funcionar offline y ofrecer acceso rápido a derechos legales, procedimientos y recursos de emergencia.

**Misión:** Empoderar a ciudadanos mexicanos con información legal verificada en momentos críticos.

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- Next.js 14 (React Framework)
- Tailwind CSS (Styling)
- TypeScript (Type Safety)

**PWA Features:**
- Service Workers
- Offline-first architecture
- App manifest
- Installable

**Design:**
- Glassmorphism moderno
- Responsive design
- WCAG 2.1 AA compliant (Accesibilidad)
- Dark/Light mode

**Deployment:**
- Cloudflare Pages
- Edge CDN
- HTTPS obligatorio

---

## ✨ Características Principales

### 1. PWA Offline-First
- Funciona sin conexión a internet
- Instalable en dispositivos móviles
- Actualizaciones automáticas
- Cache inteligente

### 2. Escenarios Legales Verificados
**3 Escenarios Principales:**
1. **Detención Policial**
   - Derechos del detenido
   - Procedimientos legales
   - Qué hacer y qué no hacer
   
2. **Accidente de Tránsito**
   - Pasos inmediatos
   - Documentación requerida
   - Contactos de emergencia
   
3. **Violencia Doméstica**
   - Recursos de ayuda
   - Procedimientos de denuncia
   - Refugios y apoyo

### 3. Botón SOS 911
- Llamada directa a emergencias
- Un toque para activar
- Visible en todas las pantallas

### 4. Recursos Descargables
- Guías en PDF
- Formatos legales
- Contactos de emergencia
- Disponibles offline

### 5. Diseño Glassmorphism
- Interfaz moderna y atractiva
- Efectos de vidrio esmerilado
- Animaciones suaves
- UX intuitiva

### 6. Accesibilidad WCAG 2.1 AA
- Contraste adecuado
- Navegación por teclado
- Screen reader compatible
- Textos legibles

---

## 📂 Estructura del Proyecto

```
DefiendeteMX/
├── app/
│   ├── escenarios/            # Páginas de escenarios
│   ├── recursos/              # Recursos descargables
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Home page
├── components/
│   ├── Header.tsx             # Navegación
│   ├── Footer.tsx             # Footer
│   ├── SOSButton.tsx          # Botón emergencia
│   └── ScenarioCard.tsx       # Cards de escenarios
├── public/
│   ├── icons/                 # Iconos PWA
│   ├── pdfs/                  # Recursos PDF
│   └── manifest.json          # PWA manifest
├── styles/
│   └── globals.css            # Estilos globales
└── next.config.js             # Configuración Next.js
```

---

## 🚀 Deployment

### Plataforma
- **Hosting:** Cloudflare Pages
- **URL:** https://defiendete-mx.pages.dev
- **CDN:** Cloudflare Global CDN
- **SSL:** Automático

### Build Configuration
```json
{
  "build": {
    "command": "npm run build",
    "output": "out"
  }
}
```

---

## 🔧 Configuración

### Variables de Entorno
```bash
# Next.js
NEXT_PUBLIC_SITE_URL="https://defiendete-mx.pages.dev"

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### PWA Manifest
```json
{
  "name": "DefiendeteMX",
  "short_name": "DefiendeteMX",
  "description": "Información legal de emergencia para México",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [...]
}
```

---

## 📊 Métricas del Proyecto

### Performance (Lighthouse)
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100
- **PWA:** ✅ Compliant

### Tamaño
- **Bundle Size:** <500KB
- **First Load:** <1s
- **Offline Ready:** ✅

### Cobertura
- **Escenarios:** 3 verificados
- **Recursos:** 10+ PDFs
- **Contactos:** 20+ emergencias

---

## 🎮 Funcionalidades Principales

### Para Usuarios
1. **Acceso Rápido**
   - Sin registro requerido
   - Información inmediata
   - Offline disponible

2. **Escenarios Legales**
   - Información verificada
   - Paso a paso
   - Contactos directos

3. **Emergencias**
   - Botón SOS 911
   - Llamada directa
   - Siempre visible

4. **Recursos**
   - Descargar PDFs
   - Guardar offline
   - Compartir

### Navegación
- Home → Escenarios
- Escenario → Detalles
- Recursos → Descargas
- SOS → Llamada 911

---

## 📚 Documentación Disponible

### Técnica
- README.md completo
- Guía de deployment
- Configuración PWA
- Estructura de componentes

### Legal
- Fuentes verificadas
- Referencias legales
- Actualizaciones de ley
- Disclaimer legal

---

## 🔗 Enlaces y Recursos

- **Producción:** https://defiendete-mx.pages.dev
- **Repositorio:** (Local)
- **Documentación:** README.md
- **Licencia:** MIT (verificar)

---

## ⚠️ Notas Importantes

### Disclaimer Legal
**Esta aplicación proporciona información general, NO asesoría legal profesional.**
- Consultar abogado para casos específicos
- Información actualizada a fecha de publicación
- Leyes pueden cambiar

### Dependencias Críticas
- Next.js 14+
- Service Workers habilitados
- HTTPS obligatorio (PWA requirement)

### Limitaciones
- Solo información para México
- 3 escenarios principales
- Requiere actualización periódica de leyes

---

## 🎯 Estado del Proyecto

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Desarrollo** | ✅ Completo | v2.0.0 estable |
| **Testing** | ✅ Completo | Lighthouse 100 |
| **Documentación** | ✅ Completa | README detallado |
| **Producción** | ✅ Ready | Desplegado |
| **Mantenimiento** | 🟢 Activo | Actualizaciones legales |

---

## 🔄 Relación con Otros Proyectos

**Proyectos Relacionados:** Ninguno (único en el portfolio)

**Tecnologías Compartidas:**
- Next.js (con escuela-idiomas)
- Tailwind CSS (con SAAS-DND, escuela-idiomas)
- Cloudflare Pages (con CVChispart, DragNDrop)

**Diferenciadores:**
- Único enfocado en información legal
- Único PWA offline-first
- Único con botón SOS integrado
- Único con WCAG 2.1 AA compliant

---

## 📈 Próximos Pasos / Roadmap

- [ ] Más escenarios legales (5+ adicionales)
- [ ] Chatbot legal con IA
- [ ] Geolocalización de servicios legales
- [ ] Integración con abogados pro-bono
- [ ] Versión en inglés
- [ ] App nativa (iOS/Android)
- [ ] Sistema de notificaciones
- [ ] Actualizaciones automáticas de leyes
- [ ] Comunidad de usuarios
- [ ] Testimonios y casos de éxito

---

**Última Actualización:** 2026-01-09  
**Analizado por:** Blackbox AI  
**Versión QWEN:** 1.0
