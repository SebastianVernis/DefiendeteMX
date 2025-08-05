import SOSButton from "./components/SOSButton";
import './globals.css';


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