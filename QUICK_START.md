# 🚀 Quick Start - Testing y Validación

Guía rápida para ejecutar validaciones y tests en el proyecto Defiéndete MX.

## Validación Rápida (1 comando)

```bash
# Validación completa de base de datos
npm run validate:db
```

**Tiempo estimado:** 1-2 segundos
**Qué valida:**
- ✅ 6 modelos Mongoose
- ✅ 6 tablas D1 (Cloudflare)
- ✅ 32 índices
- ✅ Configuraciones de DB
- ✅ Estructura de tests

---

## Tests Rápidos

```bash
# Solo tests (sin cobertura)
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch (desarrollo)
npm run test:watch
```

---

## Validación Completa

```bash
# Validación de DB + Tests con cobertura
npm run validate:all
```

**Tiempo estimado:** 10-15 segundos

---

## Revisar Reportes

```bash
# Ver reporte completo
cat TEST_VALIDATION_REPORT.md

# O abrir en tu editor
code TEST_VALIDATION_REPORT.md
```

---

## Troubleshooting Rápido

### Error: "Command not found"
```bash
npm install
```

### Tests fallando
```bash
# Limpiar cache de Jest
npx jest --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Revisar vulnerabilidades
```bash
npm audit
npm audit fix
```

---

## Estados de Validación

| Símbolo | Significado |
|---------|-------------|
| ✅ | Todo correcto |
| ⚠️ | Advertencia (no crítico) |
| ✗ | Error que requiere atención |
| ℹ | Información adicional |

---

## Next Steps

1. **Resolver vulnerabilidades:** `npm audit fix`
2. **Mejorar cobertura:** Agregar más tests
3. **Revisar tests fallidos:** Ver logs detallados

---

**Última actualización:** 2025-12-11
# Quick Start Guide
## New Features Setup for Defiéndete MX

This guide will help you quickly integrate and test all the new features.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

All dependencies are already installed! The only new one is `jspdf` which is already added.

### Step 2: Test New Pages

Visit these new pages in your browser:

1. **Scenario Search**: http://localhost:3000/escenarios
2. **Favorites**: http://localhost:3000/favoritos
3. **Admin Dashboard**: http://localhost:3000/admin

### Step 3: Test Features on Existing Pages

#### On Resources Page (`/recursos`):
- ✅ Click "Descargar PDF" buttons - real PDFs will download!
- ✅ Click star icon to favorite a resource
- ✅ Toggle dark mode (add ThemeToggle component to header)
- ✅ Switch language (add LanguageToggle component to header)

#### On Home Page:
- ✅ Add WhatsApp SOS component to test emergency feature
- ✅ Test social sharing buttons

---

## 🎨 Adding UI Components to Existing Pages

### Add Theme Toggle to Header

Edit `/app/components/layout/Header.jsx`:

```jsx
import ThemeToggle from '../ui/ThemeToggle';

// In your header JSX, add:
<ThemeToggle />
```

### Add Language Toggle to Header

```jsx
import LanguageToggle from '../ui/LanguageToggle';

// In your header JSX, add:
<LanguageToggle />
```

### Add WhatsApp SOS to Home Page

Edit `/app/page.js`:

```jsx
import WhatsAppSOS from './components/emergency/WhatsAppSOS';

// Add to your page:
<WhatsAppSOS /> // Full version
// or
<WhatsAppSOS compact /> // Compact button
```

---

## 📦 Wrap App with Context Providers

Edit `/app/layout.js` to add theme and language support:

```jsx
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext'; // Your existing auth

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 🧪 Testing Each Feature

### 1. PDF Downloads ✅
1. Go to `/recursos`
2. Click any "Descargar PDF" button
3. PDF should download with real content

### 2. Scenario Search ✅
1. Go to `/escenarios`
2. Search for "policía" or "detención"
3. Filter by categories
4. Expand scenarios to see details

### 3. Favorites ✅
1. Go to `/escenarios` or `/recursos`
2. Click star icons to favorite items
3. Go to `/favoritos` to see saved items
4. Export as JSON
5. Remove favorites

### 4. Social Sharing ✅
1. Go to `/escenarios`
2. Click share button (🔗) on any scenario
3. Test different platforms
4. Copy link functionality

### 5. Dark Mode ✅
1. Add `<ThemeToggle />` to header
2. Click to toggle dark/light mode
3. Refresh page - preference persists

### 6. Multi-language ✅
1. Add `<LanguageToggle />` to header
2. Click to switch ES ↔ EN
3. Refresh page - language persists

### 7. WhatsApp SOS ✅
1. Add `<WhatsAppSOS />` to a page
2. Configure emergency contacts in profile
3. Click "ENVIAR SOS"
4. Confirm and test WhatsApp message

### 8. Push Notifications ✅
```jsx
import { sendLocalNotification } from './lib/notifications/pushNotifications';

// Test in browser console or button click:
await sendLocalNotification('Test', {
  body: 'This is a test notification!'
});
```

### 9. Email Notifications ✅
```bash
# Test via API
curl -X POST http://localhost:3000/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "type": "welcome",
    "data": {
      "name": "Test User",
      "loginUrl": "https://defiendete-mx.pages.dev"
    }
  }'
```

### 10. Enhanced Chatbot ✅
```bash
# Test via API
curl -X POST http://localhost:3000/api/chat/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué hacer si me detienen?",
    "language": "es"
  }'
```

### 11. Admin Dashboard ✅
1. Go to `/admin`
2. View all statistics
3. Navigate between tabs
4. Test quick actions

---

## 🎯 Quick Demo Flow

### For Users:
1. **Start** at home page
2. **Search** scenarios on `/escenarios`
3. **Favorite** a scenario (star icon)
4. **Download** a PDF from `/recursos`
5. **Share** via WhatsApp
6. **View** favorites at `/favoritos`
7. **Toggle** dark mode
8. **Switch** to English

### For Admins:
1. **Login** as admin
2. **Visit** `/admin`
3. **View** statistics dashboard
4. **Navigate** tabs to see different metrics

---

## 🔑 Environment Variables (Optional)

Create `.env.local` for production features:

```env
# Push Notifications (generate at https://web-push-codelab.glitch.me/)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key

# Email Service (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Defiéndete MX <noreply@defiendete-mx.com>
```

---

## 🐛 Troubleshooting

### PDFs not downloading?
- Check browser console for errors
- Ensure jsPDF is installed: `npm install jspdf`

### Dark mode not working?
- Wrap app with `<ThemeProvider>`
- Check Tailwind config has `darkMode: 'class'`

### Favorites not persisting?
- Check browser LocalStorage is enabled
- Clear localStorage and try again: `localStorage.clear()`

### Push notifications not working?
- Check HTTPS (required for push notifications)
- Check browser supports notifications
- Grant notification permissions

### Admin dashboard not accessible?
- Check user role is 'ADMIN'
- Implement authentication check in `/app/admin/page.js`

---

## 📱 Mobile Testing

Test on mobile devices:
1. WhatsApp SOS uses WhatsApp app on mobile
2. Native share menu on mobile
3. Dark mode works across devices
4. Favorites sync via localStorage

---

## 🎨 Customization

### Change Colors
Edit colors in theme contexts or Tailwind config:
- Theme colors: `/app/contexts/ThemeContext.js`
- Tailwind: `/tailwind.config.js`

### Add Translations
Edit `/app/lib/i18n/translations.js`:
```js
export const translations = {
  es: {
    myNewKey: 'Mi nuevo texto'
  },
  en: {
    myNewKey: 'My new text'
  }
};
```

### Customize Email Templates
Edit `/app/api/notifications/email/route.js`:
```js
const emailTemplates = {
  myTemplate: {
    subject: 'My Subject',
    html: (data) => `<html>...</html>`
  }
};
```

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] Test all PDF downloads
- [ ] Test favorites persistence
- [ ] Test sharing on all platforms
- [ ] Test dark mode on all pages
- [ ] Test language switching
- [ ] Configure real email service (not mock)
- [ ] Generate VAPID keys for push notifications
- [ ] Set up service worker for push
- [ ] Test WhatsApp SOS with real contacts
- [ ] Test admin dashboard with real data
- [ ] Verify mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Add analytics tracking
- [ ] Set up error monitoring (Sentry)

---

## 🚀 Deploy to Production

All features work on Cloudflare Pages:

```bash
npm run build
```

Then push to your repository. Cloudflare Pages will auto-deploy.

---

## 📞 Support

If you need help with any feature:
1. Check `/FEATURES_IMPLEMENTATION.md` for detailed docs
2. Review component JSDoc comments
3. Check browser console for errors
4. Test in incognito mode (clear cache)

---

## 🎉 You're All Set!

All 11 features are ready to use. Start by visiting:
- `/escenarios` - Search scenarios
- `/favoritos` - View favorites
- `/admin` - Admin dashboard

Enjoy your enhanced Defiéndete MX platform! 🇲🇽
