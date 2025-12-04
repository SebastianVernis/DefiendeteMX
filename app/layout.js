import './globals.css';

export const metadata = {
  title: 'Defiéndete MX - Herramientas Legales y Derechos',
  description: 'Plataforma integral con herramientas legales impulsadas por IA, guías de derechos y asistencia legal 24/7 para proteger tus derechos en México.',
  keywords: 'derechos legales, México, asistencia legal, IA legal, PROFECO, abogados, contratos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Defiéndete MX',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e40af',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Defiéndete MX" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-textPrimary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
