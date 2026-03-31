"use client";

import { motion } from "framer-motion";
import { HelpCircle, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";

const unknowns = [
  {
    question: "Acierto Inmobiliario quiere un inquilino medico?",
    status: "pendiente" as const,
    detail: "No se ha contactado al propietario. Se necesita verificar disponibilidad, precio real de arriendo y factibilidad estructural para equipos pesados (MRI 15 ton).",
    nextStep: "Reunion exploratoria con Acierto Inmobiliario — abril 2026",
  },
  {
    question: "El edificio soporta equipos medicos?",
    status: "pendiente" as const,
    detail: "Un MRI 3T pesa 12-15 toneladas y requiere blindaje RF. Los quirofanos requieren infraestructura especifica (gases medicinales, HVAC, respaldo electrico). Se necesita estudio estructural.",
    nextStep: "Inspeccion tecnica con ingeniero estructural",
  },
  {
    question: "SURA contrataria la nueva sede?",
    status: "pendiente" as const,
    detail: "SURA domina 64-79% del mercado contributivo en el Oriente. Sin contrato SURA, el modelo de revenue se reduce significativamente.",
    nextStep: "Sondeo con SURA — direccion de red",
  },
  {
    question: "Los pacientes elegirian Km 7 sobre opciones mas cercanas?",
    status: "pendiente" as const,
    detail: "No hay estudio primario de preferencias. Torre Oviedo (2.65 km), Rosario Tesoro (0.93 km) y CEDIMED ya atienden El Poblado. Somer atiende Oriente a 10-15 min de Rionegro.",
    nextStep: "Encuestas de intencion con pacientes y medicos remisores",
  },
  {
    question: "El Tunel 2da etapa llega en H2 2027?",
    status: "riesgo" as const,
    detail: "19% de avance a marzo 2026. Proyectos de infraestructura en Colombia se retrasan frecuentemente. El caso base no depende del Tunel — los tiempos actuales ya justifican, pero el upside se reduce si se retrasa.",
    nextStep: "Monitorear avance trimestral ANI/INVIAS",
  },
  {
    question: "Los estratos del Oriente son proxy o dato real?",
    status: "parcial" as const,
    detail: "Solo Rionegro tiene dato directo (Decreto 096/2021). Los demas municipios usan proxy basado en ratio contributivo. El dato de ~53,800 viviendas E4+ tiene margen de error significativo.",
    nextStep: "Solicitar datos a alcaldias de La Ceja y El Retiro",
  },
];

const statusConfig = {
  pendiente: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "Pendiente" },
  riesgo: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Riesgo" },
  parcial: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "Parcial" },
};

export function WhatWeDontKnowSection() {
  return (
    <SectionWrapper id="lo-que-no-sabemos">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Transparencia — Riesgos y Preguntas Abiertas
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Lo que NO sabemos (aun)
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Toda recomendacion tiene supuestos. Estos son los nuestros — y lo que
          falta por verificar antes de tomar una decision de inversion.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {unknowns.map((item, i) => {
          const config = statusConfig[item.status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.3) }}
              className="rounded-xl border bg-card p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${config.bg} ${config.color} ${config.border}`}>
                  {config.label}
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight mb-2">{item.question}</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{item.detail}</p>
              <div className="rounded-lg bg-teal-50/50 border border-teal-100 p-2">
                <p className="text-[10px] font-medium text-teal-700">
                  <strong>Proximo paso:</strong> {item.nextStep}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              La recomendacion se sostiene — con condiciones
            </h4>
            <p className="text-sm text-teal-700 mt-1">
              Access Point es la recomendacion estrategica porque el <strong>edificio existente</strong> permite
              abrir en 18-24 meses (vs 54+ de construccion greenfield) y captura un mercado de <strong>298K
              habitantes del Oriente cercano</strong> que ningun otro candidato puede alcanzar. Sin embargo,
              la decision de inversion debe condicionarse a: (1) factibilidad estructural del edificio,
              (2) acuerdo con Acierto Inmobiliario, y (3) pre-acuerdo con al menos una aseguradora principal.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
