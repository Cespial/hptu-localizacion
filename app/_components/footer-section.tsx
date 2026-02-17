"use client";

import { Separator } from "@/components/ui/separator";

export function FooterSection() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold">
              Observatorio de Datos y Analisis
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estudio de Localizacion Estrategica para la nueva sede del Hospital Pablo Tobon Uribe
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              Febrero 2026 &middot; Medellin, Colombia
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Documento de trabajo &mdash; Uso interno
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-[11px] text-muted-foreground/60">
          Modelo de Nodos y Flujos de Valor &copy; 2026. Todos los datos del piloto son demostrativos.
        </p>
      </div>
    </footer>
  );
}
