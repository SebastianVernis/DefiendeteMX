# 🛡️ Defiéndete MX - Plataforma Unificada de Asesoría y Gestión Legal para Emergencias

## 📋 Resumen Ejecutivo

**Defiéndete MX** es una plataforma integral de asesoría y gestión legal diseñada específicamente para situaciones de emergencia donde la autoridad no es aliada. Unifica múltiples herramientas y recursos en un solo ecosistema cohesivo para proteger a ciudadanos en situaciones de vulnerabilidad.

### 🎯 Misión
Proporcionar herramientas tecnológicas accesibles, seguras y efectivas para documentar, gestionar y resolver casos legales de emergencia, empoderando a los usuarios con información legal verificada y sistemas de apoyo confiables.

---

## 🏗️ Arquitectura de la Plataforma

### Estructura de Páginas Principales

```
/                           → Landing page con acceso rápido
/dashboard                  → Centro de control unificado
/casos                      → Gestión de casos legales
/casos/nuevo                → Formulario de nuevo caso (5 pasos)
/casos/[id]                 → Detalles y seguimiento de caso
/contactos                  → Red de contactos de emergencia
/evidencia/nueva            → Sistema de carga de evidencia
/recursos                   → Biblioteca de recursos legales
/escenarios                 → Guías paso a paso por escenario
/favoritos                  → Contenido guardado
/grabador                   → Grabadora de voz
/constitucion               → Búsqueda en la Constitución
/reportes                   → Reportes oficiales a autoridades
/perfil                     → Perfil de usuario
```

---

## ⚡ Características Principales

### 1. 🏠 Dashboard Central
**Ubicación:** `/dashboard`

Centro de control unificado que proporciona:

- **Vista General de Estadísticas**
  - Casos activos
  - Acciones pendientes
  - Recursos guardados
  - Contactos registrados

- **Acciones Rápidas**
  - 🚨 Reportar Emergencia
  - 📋 Nuevo Caso
  - 📸 Subir Evidencia
  - 💬 Asesoría Legal IA
  - 🎙️ Grabadora
  - 👥 Contactos

- **Herramientas del Sistema**
  - 📁 Mis Casos
  - 📚 Recursos Legales
  - ⭐ Favoritos
  - ⚖️ Constitución
  - 🎯 Escenarios Legales
  - 📄 Reportes Oficiales

- **Actividad Reciente**
  - Timeline de acciones
  - Estado de casos
  - Notificaciones

- **Alertas Inteligentes**
  - Casos urgentes
  - Acciones vencidas
  - Recordatorios automáticos

### 2. 📁 Sistema de Gestión de Casos

**Ubicación:** `/casos`

Sistema robusto para documentar y dar seguimiento a casos legales:

#### Características del Sistema de Casos:

**Formulario Multi-Paso (5 Pasos):**
1. **Información Básica**
   - Título y descripción
   - 11 categorías de casos
   - 5 niveles de prioridad

2. **Detalles del Incidente**
   - Fecha y hora
   - Ubicación con coordenadas GPS
   - Ciudad y estado

3. **Información del Perpetrador**
   - Identidad (opcional)
   - Relación con la víctima
   - Factores de riesgo (armas, sustancias)
   - Descripción física

4. **Información de la Víctima**
   - Lesiones físicas
   - Impacto psicológico
   - Necesidad de atención médica
   - Dependientes económicos

5. **Evaluación de Seguridad y Testigos**
   - Peligro inmediato
   - Necesidad de refugio
   - Plan de escape
   - Lista de testigos con contactos

**Categorías de Casos:**
- 🏠 Violencia Doméstica
- ⚠️ Violencia Sexual
- 💼 Acoso Laboral
- 🎓 Acoso Escolar
- ⚖️ Discriminación
- 👮 Abuso de Autoridad
- 🔒 Detención Arbitraria
- 📜 Violación de Derechos
- ⚡ Amenazas
- 💰 Extorsión
- 📋 Otro

**Niveles de Prioridad:**
- 🔴 Emergencia - Peligro inminente
- 🔴 Crítico - Situación grave
- 🟠 Alto - Atención prioritaria
- 🟡 Medio - Importancia moderada
- 🟢 Bajo - No urgente

**Sistema de Filtros:**
- Filtrar por estado
- Buscar por texto
- Ordenar por fecha/prioridad

**Vista de Casos:**
- Cards con información resumida
- Badges de prioridad y estado
- Indicadores de peligro
- Contador de evidencia
- Fecha del incidente

### 3. 👥 Red de Contactos de Emergencia

**Ubicación:** `/contactos`

Sistema integral de contactos de emergencia:

**Contactos Personales:**
- Nombre completo
- Teléfono
- Email
- Relación
- Notas adicionales
- Marcador de contacto primario
- Almacenamiento local seguro

**Números Oficiales Organizados por Categoría:**

**Emergencias:**
- 🚨 911 - Emergencias generales
- 🏥 065 - Cruz Roja
- 🚗 078 - Ángeles Verdes

**Apoyo Legal y DDHH:**
- ⚖️ CNDH - 5556818125
- 👮 FGR - 5553461900
- 📋 Visitaduría - 8000153515

**Violencia y Género:**
- 👩 Línea Mujeres - 5556581111
- 💜 INMUJERES - 8008224996
- 📞 Locatel - 5556581111

**Adicciones y Salud Mental:**
- 🧠 Línea de la Vida - 8009112000
- 💚 SAPTEL - 5552595121
- 📱 Consejo Ciudadano - 5555335533

**Niñez y Adolescencia:**
- 👶 DIF Nacional - 8003392000
- 🚸 Alerta Amber - 8008342678
- 👨‍👩‍👧 SIPINNA - 8006962000

### 4. 🆘 Modo Pánico Discreto

**Componente:** `<PanicButton />`

Sistema de emergencia de activación rápida:

**Métodos de Activación:**
- Triple presión del botón flotante
- Doble click en el botón 🆘
- Triple presión de tecla ESC (discreta)

**Funciones Automáticas al Activar:**
1. **Alertas Silenciosas**
   - Envía SMS a contactos de emergencia
   - Incluye ubicación GPS en tiempo real
   - Mensaje predefinido de emergencia

2. **Grabación Automática**
   - Inicia grabación de audio en segundo plano
   - Duración: 5 minutos automáticos
   - Almacenamiento seguro

3. **Seguimiento de Ubicación**
   - Tracking GPS continuo
   - Envío de coordenadas al servidor
   - Alta precisión

4. **Interfaz Discreta**
   - Pantalla negra con opciones mínimas
   - Diseño que no llama la atención
   - Vibración discreta

**Acciones Rápidas en Modo Pánico:**
- 📞 Llamar 911
- 🔕 Alerta Silenciosa
- 📱 Llamada Falsa (simulada)
- 🎙️ Grabar Evidencia

**Botón Flotante Permanente:**
- Ubicado en esquina inferior derecha
- Color rojo con animación pulse
- Menú contextual con acciones
- Siempre visible en toda la app

### 5. 📸 Sistema de Evidencia Digital

**Ubicación:** `/evidencia/nueva`

Plataforma segura para documentar y almacenar evidencia:

**Tipos de Evidencia Soportados:**
- 📷 Fotografías
- 🎥 Videos
- 🎙️ Audio
- 📄 Documentos (PDF, Word)
- 💬 Mensajes/Chats
- 📎 Otros archivos

**Características de Seguridad:**
- ✅ Cifrado antes de almacenar
- ✅ Cadena de custodia digital
- ✅ Preservación de metadatos
- ✅ Timestamps inmutables
- ✅ Geolocalización automática
- ✅ Certificación de autenticidad

**Proceso de Carga:**
1. Información básica (título, descripción)
2. Selección de tipo de evidencia
3. Fecha y ubicación de captura
4. Carga múltiple de archivos
5. Certificación de autenticidad

**Vista Previa:**
- Thumbnails de imágenes
- Iconos por tipo de archivo
- Tamaño de archivos
- Opción de eliminar antes de guardar

### 6. 💬 Chat Legal con IA Mejorado

**Componente:** `<ChatWidget />`

Asistente legal inteligente 24/7 con capacidades avanzadas:

**Funcionalidades:**
- **Base de Conocimiento Legal**
  - 7+ escenarios legales
  - Artículos constitucionales
  - Procedimientos legales
  - Derechos fundamentales

- **Detección de Crisis**
  - 17+ palabras clave de emergencia
  - Análisis de sentimiento
  - Escalación automática

- **Análisis de Emociones**
  - Positive, Neutral, Negative, Distressed, Crisis
  - Respuestas empáticas adaptadas

- **Detección de Intención**
  - Saludo
  - Pregunta legal
  - Apoyo emocional
  - Información procesal

- **Acciones Rápidas**
  - Templates predefinidos
  - Respuestas contextuales
  - Recomendaciones personalizadas

### 7. 📚 Recursos Legales

**Ubicación:** `/recursos`

Biblioteca completa de recursos:

**6 Guías en PDF (Generación Real):**
1. **Guía de Derechos Fundamentales** (12 páginas)
   - Derechos constitucionales
   - Garantías individuales
   - Casos de uso

2. **Contactos de Emergencia** (8 páginas)
   - Directorio completo
   - Números por categoría
   - Información de contacto

3. **Procedimientos Legales** (20 páginas)
   - Paso a paso
   - Documentación necesaria
   - Tiempos y plazos

4. **Formulario de Denuncia** (4 páginas)
   - Template descargable
   - Instrucciones de llenado

5. **Derechos del Detenido** (10 páginas)
   - Qué hacer en detención
   - Derechos irrenunciables
   - Contactos de apoyo

6. **Recursos de la CNDH** (25 páginas)
   - Servicios disponibles
   - Cómo presentar quejas
   - Seguimiento

**Características:**
- Descarga directa en PDF
- Visualización en línea
- Botón de favoritos
- Compartir en redes sociales
- Búsqueda de contenido

### 8. 🎯 Escenarios Legales

**Ubicación:** `/escenarios`

Guías paso a paso para situaciones comunes:

**Características:**
- Búsqueda en tiempo real
- Filtros por categoría
- Cards expandibles
- Información legal verificada
- Pasos de acción claros
- Contactos relevantes
- Guardar en favoritos

**Escenarios Incluidos:**
- Detención policial
- Violencia doméstica
- Acoso laboral
- Discriminación
- Abuso de autoridad
- Y más...

### 9. ⭐ Sistema de Favoritos

**Ubicación:** `/favoritos`

Gestión de contenido guardado:

**Tipos de Contenido:**
- Escenarios legales
- Recursos/PDFs
- Casos
- Artículos constitucionales

**Funcionalidades:**
- Almacenamiento local (LocalStorage)
- Tabs por categoría
- Exportar como JSON
- Importar favoritos
- Eliminar individualmente
- Limpiar todos
- Timestamps de guardado
- Contador total

### 10. 🎙️ Grabadora de Voz

**Ubicación:** `/grabador`

Sistema de grabación de audio como evidencia:

**Características:**
- Grabación con MediaRecorder API
- Reproducción de audio
- Guardado local
- Transcripción con IA
- Análisis de emociones
- Detección de palabras clave
- Metadatos preservados

### 11. ⚖️ Búsqueda en Constitución

**Ubicación:** `/constitucion`

Explorador de la Constitución Mexicana:

**Funcionalidades:**
- Búsqueda por texto
- Navegación por artículos
- Highlight de resultados
- Explicaciones simplificadas
- Referencias legales
- Guardar artículos

---

## 🔒 Seguridad y Privacidad

### Medidas de Seguridad Implementadas:

1. **Autenticación**
   - JWT con tokens de acceso y refresh
   - Cookies HttpOnly seguras
   - Bloqueo de cuenta tras 5 intentos fallidos
   - Sesiones múltiples por usuario

2. **Encriptación**
   - Contraseñas con bcrypt (10 rounds)
   - Datos sensibles cifrados
   - HTTPS obligatorio

3. **Privacidad**
   - Datos almacenados localmente cuando es posible
   - Eliminación segura (soft delete)
   - Control de permisos granular
   - Anonimización de datos sensibles

4. **Evidencia Digital**
   - Cadena de custodia
   - Timestamps inmutables
   - Hash de archivos
   - Metadatos preservados

5. **Modo Pánico**
   - Activación discreta
   - Sin notificaciones visibles
   - Alertas silenciosas

---

## 🎨 Diseño y UX

### Principios de Diseño:

1. **Accesibilidad First**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader friendly
   - Alto contraste

2. **Mobile First**
   - Responsive design
   - Touch-friendly
   - PWA capabilities
   - Offline mode

3. **Glassmorphism UI**
   - Fondos translúcidos
   - Blur effects
   - Gradientes suaves
   - Sombras modernas

4. **Microinteracciones**
   - Animaciones smooth
   - Feedback visual
   - Estados hover
   - Transiciones fluidas

### Paleta de Colores:

**Colores Primarios:**
- 🟣 Purple: `#9333ea` - Acción primaria
- 🔵 Blue: `#3b82f6` - Información
- 🟢 Green: `#10b981` - Éxito
- 🔴 Red: `#ef4444` - Emergencia/Error
- 🟠 Orange: `#f97316` - Advertencia

**Colores de Estado:**
- Nuevo: Blue
- En Proceso: Yellow
- Urgente: Red
- Resuelto: Green

---

## 📱 Tecnologías Utilizadas

### Frontend:
- **Next.js 14** - Framework React con App Router
- **React 18.2** - Biblioteca UI
- **Tailwind CSS 3.3** - Estilos utility-first
- **jsPDF 3.0** - Generación de PDFs

### Backend:
- **Node.js** - Runtime
- **MongoDB + Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas

### Features Especiales:
- **next-pwa** - Progressive Web App
- **MediaRecorder API** - Grabación de audio/video
- **Geolocation API** - Ubicación GPS
- **LocalStorage** - Almacenamiento local
- **Service Workers** - Funcionalidad offline

---

## 🚀 Flujo de Usuario Principal

### Escenario: Usuario en Emergencia

1. **Llegada a la Plataforma**
   ```
   Landing Page (/) → Ver opciones de acceso rápido
   ```

2. **Activación de Emergencia**
   ```
   Presionar botón 🆘 (doble click o ESC x3)
   → Modo Pánico activado
   → Alertas automáticas enviadas
   → Grabación iniciada
   → GPS tracking activo
   ```

3. **Documentar el Caso**
   ```
   Dashboard → Reportar Emergencia
   → Formulario 5 pasos
   → Crear caso con prioridad EMERGENCIA
   ```

4. **Agregar Evidencia**
   ```
   Subir Evidencia → Fotos/Videos/Audio
   → Certificar autenticidad
   → Asociar a caso
   ```

5. **Obtener Asesoría**
   ```
   Chat Legal IA → Hacer preguntas
   → Recibir guía paso a paso
   → Obtener contactos relevantes
   ```

6. **Seguimiento**
   ```
   Dashboard → Ver casos activos
   → Actualizar estado
   → Agregar notas
   → Generar reportes
   ```

---

## 📊 Estadísticas y Analytics

### Métricas Rastreadas:

- **Casos:**
  - Total de casos creados
  - Por categoría
  - Por prioridad
  - Por estado
  - Tiempo de resolución

- **Usuarios:**
  - Usuarios activos
  - Sesiones por usuario
  - Casos por usuario
  - Evidencia subida

- **Chat:**
  - Consultas totales
  - Mensajes enviados
  - Crisis detectadas
  - Satisfacción del usuario

- **Evidencia:**
  - Archivos totales
  - Por tipo
  - Tamaño total
  - Casos con evidencia

---

## 🔄 Integraciones Futuras

### Planeadas:

1. **Comunicaciones:**
   - ✅ Twilio SMS (implementado)
   - 📧 Email notifications (implementado)
   - 🔔 Push notifications (implementado)
   - 📱 WhatsApp Business API

2. **Gobierno:**
   - 🏛️ API FGR
   - 👮 API Secretaría de Seguridad
   - ⚖️ API CNDH
   - 📋 e-Firma digital

3. **Legal:**
   - 👨‍⚖️ Red de abogados
   - 📚 Bases de datos jurídicas
   - 📄 Generación de documentos legales
   - 🔍 Búsqueda de jurisprudencia

4. **Tecnología:**
   - 🤖 IA avanzada (GPT-4)
   - 🎙️ Transcripción automática mejorada
   - 📸 OCR para documentos
   - 🔐 Blockchain para evidencia

---

## 🎯 Diferenciadores Clave

### Lo que hace única a esta plataforma:

1. **Enfoque en Emergencias**
   - Diseñada para situaciones donde la autoridad no es aliada
   - Modo pánico discreto
   - Alertas automáticas
   - Respuesta inmediata

2. **Todo en Uno**
   - Dashboard unificado
   - Múltiples herramientas integradas
   - Flujo coherente
   - Experiencia consistente

3. **Evidencia Digital Certificada**
   - Cadena de custodia
   - Metadatos preservados
   - Admisible legalmente
   - Almacenamiento seguro

4. **IA Especializada**
   - Entrenada en derecho mexicano
   - Detección de crisis
   - Análisis de sentimientos
   - Respuestas contextuales

5. **Privacidad por Diseño**
   - Datos locales cuando es posible
   - Cifrado de extremo a extremo
   - Anonimización
   - Control total del usuario

6. **Accesibilidad Universal**
   - Gratuito
   - Sin registros complejos
   - Mobile-first
   - Offline-capable
   - Multi-idioma

---

## 🎓 Casos de Uso Principales

### 1. Violencia Doméstica
```
Usuario → Modo Pánico → Alertas a red de apoyo
     → Documentar incidente
     → Subir fotos de lesiones
     → Chat con IA para asesoría
     → Generar denuncia formal
     → Ubicar refugios cercanos
```

### 2. Abuso Policial
```
Usuario → Grabar audio/video discretamente
     → Modo pánico activo
     → Crear caso con ubicación GPS
     → Documentar violaciones de derechos
     → Contactar CNDH automáticamente
     → Generar queja formal
```

### 3. Acoso Laboral
```
Usuario → Crear caso de Acoso Laboral
     → Subir capturas de mensajes
     → Registrar testigos
     → Obtener asesoría legal
     → Preparar denuncia ante autoridad laboral
     → Seguimiento del caso
```

### 4. Discriminación
```
Usuario → Documentar incidente
     → Subir evidencia
     → Consultar derechos constitucionales
     → Generar escrito de queja
     → Contactar CONAPRED
```

---

## 📈 Roadmap de Desarrollo

### Fase 1: Fundación ✅ (Completada)
- ✅ Dashboard central
- ✅ Sistema de casos
- ✅ Contactos de emergencia
- ✅ Modo pánico
- ✅ Evidencia digital
- ✅ Navegación unificada

### Fase 2: Mejoras (En Progreso)
- ⚙️ Chat IA mejorado con contexto por caso
- ⚙️ Sistema de notificaciones push
- ⚙️ Generación automática de documentos legales
- ⚙️ Panel de seguimiento en tiempo real

### Fase 3: Integraciones
- 📱 WhatsApp Business API
- 🏛️ APIs gubernamentales
- 👨‍⚖️ Red de abogados voluntarios
- 📧 Notificaciones email mejoradas

### Fase 4: Expansión
- 🌎 Multi-país (iniciar con Latinoamérica)
- 🗣️ Multi-idioma (inglés, idiomas indígenas)
- 🤖 IA avanzada (GPT-4)
- 📱 Apps nativas (iOS, Android)

---

## 🛠️ Instalación y Desarrollo

### Requisitos:
```bash
Node.js 18+
MongoDB 6+
npm o yarn
```

### Instalación:
```bash
# Clonar repositorio
git clone https://github.com/SebastianVernis/defiendete-mx.git
cd defiendete-mx

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

### Build de Producción:
```bash
npm run build
npm start
```

---

## 📞 Contacto y Soporte

### Para Usuarios:
- 🌐 Web: https://defiendete-mx.pages.dev
- 📧 Email: soporte@defiendete-mx.com
- 📱 WhatsApp: [Número]

### Para Desarrolladores:
- 💻 GitHub: https://github.com/SebastianVernis/defiendete-mx
- 📖 Documentación: [Link]
- 🐛 Issues: [GitHub Issues]

---

## 📄 Licencia

Este proyecto está desarrollado con fines sociales y educativos.

---

## 🙏 Agradecimientos

A todas las organizaciones de derechos humanos, abogados voluntarios, y víctimas que compartieron sus experiencias para hacer esta plataforma posible.

---

**Defiéndete MX** - Tecnología al servicio de la justicia y los derechos humanos.

*Última actualización: Diciembre 2025*
