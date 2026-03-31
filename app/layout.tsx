import type { Metadata } from "next";
import { inter, sourceSerif } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plan de Expansion HPTU | Localizacion Estrategica",
  description:
    "Plan de Expansion del Hospital Pablo Tobon Uribe — Modelo de Nodos y Flujos de Valor para la localizacion estrategica de la sede ambulatoria. Observatorio de Datos y Analisis.",
  openGraph: {
    title: "Plan de Expansion HPTU",
    description: "Sede ambulatoria — MCDA 5 dimensiones, 3.8M+ registros, 15 fuentes oficiales",
    type: "website",
    locale: "es_CO",
    siteName: "HPTU Localizacion Estrategica",
  },
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
