import type { Metadata } from "next";
import { inter, sourceSerif } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudio de Localizacion Estrategica | HPTU Nueva Sede",
  description:
    "Modelo de Nodos y Flujos de Valor para la localizacion estrategica de la nueva sede del Hospital Pablo Tobon Uribe. Observatorio de Datos y Analisis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.18.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
