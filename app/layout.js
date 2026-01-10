import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import ChatWidget from './components/chat/ChatWidget';

/**
 * Root Layout Component
 * Main layout wrapper for the entire application
 * Provides consistent structure, metadata, and global styles
 */

export const metadata = {
  title: 'Defiéndete MX - Protege tus Derechos',
  description: 'Información legal verificada para proteger tus derechos en situaciones de detención en México. Guías, recursos y asistencia legal 24/7.',
  keywords: 'derechos legales, México, detención, abogados, CNDH, derechos humanos, asistencia legal',
  authors: [{ name: 'Sebastián Vernis' }],
  creator: 'Sebastián Vernis',
  publisher: 'Defiéndete MX',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Defiéndete MX',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://defiendete-mx.pages.dev',
    title: 'Defiéndete MX - Protege tus Derechos',
    description: 'Información legal verificada para proteger tus derechos en situaciones de detención en México.',
    siteName: 'Defiéndete MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Defiéndete MX - Protege tus Derechos',
    description: 'Información legal verificada para proteger tus derechos en situaciones de detención en México.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: '#1e40af',
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Defiéndete MX" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Defiéndete MX" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="shortcut icon" href="/icons/icon-192x192.svg" />
        
        {/* Fonts - Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-background text-textPrimary font-sans antialiased">
        <AuthProvider>
          {/* Main App Container */}
          <div id="root" className="flex flex-col min-h-screen">
            {/* Skip to main content - Accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg"
            >
              Saltar al contenido principal
            </a>
            
            {/* Main Content Area */}
            <main id="main-content" className="flex-grow">
              {children}
            </main>
          </div>

          {/* Portal for Modals and Overlays */}
          <div id="modal-root"></div>
          <div id="toast-root"></div>

          {/* AI Chat Widget */}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
