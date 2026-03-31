"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Stethoscope,
  Heart,
  ShieldCheck,
  Sparkles,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  internationalReferences,
  ambulatoryPortfolio,
  expansionExclusions,
  wellnessConcept,
} from "@/lib/demo-data/international-references";

export function AmbulatoryConceptSection() {
  return (
    <SectionWrapper id="concepto-ambulatorio">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Concepto de Sede — Plan de Expansion HPTU
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Sede Ambulatoria: Modelo Cleveland Clinic
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          El plan de expansion NO es un hospital nuevo. Es una sede ambulatoria
          que hereda la marca y protocolos de HPTU — sin urgencias, sin camas,
          sin alta complejidad.
        </p>
      </div>

      {/* Heritage de marca */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-6 sm:p-8 shadow-sm mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-blue-900 sm:text-2xl">
            Heritage de Marca: Lo Ambulatorio Hereda el Poder de HPTU
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-white/80 p-4">
            <p className="text-sm font-bold text-blue-800 mb-2">El Modelo</p>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              Cleveland Clinic opera 270+ ubicaciones ambulatorias fuera de su campus
              principal. Cada satelite hereda la marca, los protocolos y la reputacion
              del hospital. El paciente recibe calidad Cleveland Clinic sin necesidad
              de ir al campus principal.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white/80 p-4">
            <p className="text-sm font-bold text-blue-800 mb-2">La Analogia HPTU</p>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              La sede ambulatoria en Access Point operaria como un satelite HPTU:
              mismos especialistas (rotando), mismos protocolos, misma marca. El paciente
              del Oriente o de El Poblado recibe calidad HPTU a 18 min de Robledo,
              sin necesidad de desplazarse al campus principal.
            </p>
          </div>
        </div>
      </motion.div>

      {/* What it IS and what it IS NOT */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* IS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
            <h3 className="text-sm font-bold text-teal-800">Lo que SI incluye</h3>
          </div>
          <div className="space-y-3">
            {ambulatoryPortfolio.map((svc, i) => (
              <motion.div
                key={svc.category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.35) }}
                className="rounded-lg border border-teal-100 bg-teal-50/30 p-3"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                  <p className="text-xs font-bold text-teal-800">{svc.category}</p>
                </div>
                <p className="text-[10px] text-teal-700/80 leading-relaxed">
                  {svc.services.join(", ")}
                </p>
                <p className="text-[10px] text-teal-600 font-medium mt-1 italic">
                  {svc.differentiator}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* IS NOT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Ban className="h-5 w-5 text-red-600" />
            <h3 className="text-sm font-bold text-red-800">Lo que NO incluye</h3>
          </div>
          <div className="space-y-2.5 mb-6">
            {expansionExclusions.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50/30 px-3 py-2.5"
              >
                <Ban className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span className="text-xs font-medium text-red-800">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <strong>Nota:</strong> La sede ambulatoria NO compite con Somer ni SVF
            en alta complejidad. Complementa el ecosistema de salud del Oriente
            ofreciendo servicios especializados que hoy requieren referencia a Medellin.
          </p>

          {/* Wellness concept */}
          <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <p className="text-xs font-bold text-purple-800">{wellnessConcept.title}</p>
            </div>
            <p className="text-[10px] text-purple-700/80 leading-relaxed mb-2">
              {wellnessConcept.description}
            </p>
            <ul className="space-y-1">
              {wellnessConcept.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] text-purple-700">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-purple-400 shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* International references */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-hidden mb-8"
      >
        <div className="p-5 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-bold">
              Referentes Internacionales y Competidores Locales
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Cleveland Clinic (modelo ambulatorio), PRENUVO (MRI preventivo), CEDIMED (imagenes Antioquia)
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:p-6 pt-0 sm:grid-cols-3">
          {internationalReferences.map((ref, i) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.08, 0.3) }}
              className="rounded-xl border bg-muted/20 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                    ref.type === "modelo"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : ref.type === "servicio"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {ref.type === "modelo" ? "Modelo" : ref.type === "servicio" ? "Servicio" : "Competidor"}
                </span>
                <span className="text-[10px] text-muted-foreground">{ref.country}</span>
              </div>
              <h4 className="text-xs font-bold mb-2 leading-tight">{ref.name}</h4>
              <ul className="space-y-1 mb-3">
                {ref.keyFacts.slice(0, 4).map((fact, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-400 shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-teal-50/50 border border-teal-100 p-2.5">
                <p className="text-[10px] font-bold text-teal-700 mb-0.5">Relevancia para HPTU</p>
                <p className="text-[10px] text-teal-600/80 leading-relaxed">
                  {ref.relevanceForHPTU.slice(0, 200)}...
                </p>
              </div>
              <p className="text-[9px] text-muted-foreground mt-2 italic">
                {ref.source}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PRENUVO highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Heart className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-purple-800">
              Diferenciador Fase 2: Full-Body MRI Preventivo (Modelo PRENUVO)
            </h4>
            <p className="text-sm text-purple-700 mt-1">
              Un escaneo de resonancia magnetica de cuerpo completo (~60 min, sin radiacion)
              como servicio premium de deteccion temprana. Precio en EE.UU.: $1,800-$2,499 USD.
              Target en Antioquia: <strong>ejecutivos Zona Franca (300 empresas, 12,000 empleados)</strong>,
              viajeros frecuentes aeropuerto, residentes E5/E6. <strong>Ningun competidor
              en Antioquia ofrece este servicio</strong> — diferenciador unico para la sede ambulatoria HPTU.
              <strong> Programado para Fase 2</strong> junto con PET-CT, cuando la base instalada
              de MRI 3T este operativa y el volumen oncologico justifique la inversion.
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
