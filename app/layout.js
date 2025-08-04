import SOSButton from "./components/SOSButton";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-darkBg text-white font-sans">
        <div className="container mx-auto p-4">{children}</div>
        <SOSButton />
      </body>
    </html>
  );
}