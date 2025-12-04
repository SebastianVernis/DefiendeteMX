import SOSButton from "./components/SOSButton";
import './globals.css';

export const metadata = {
  title: 'Defiéndete MX - Herramientas Legales y Derechos',
  description: 'Plataforma integral con herramientas legales impulsadas por IA, guías de derechos y asistencia legal 24/7 para proteger tus derechos en México.',
  keywords: 'derechos legales, México, asistencia legal, IA legal, PROFECO, abogados, contratos',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3182ce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-textPrimary font-sans">
        {children}
        <SOSButton />
      </body>
    </html>
  );
}