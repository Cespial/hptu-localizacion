"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,

  CheckCircle2,
  Users,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  orienteHealthSummary,
  orienteMunicipios,
} from "@/lib/demo-data/oriente-data";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

// Ambulatory service categories with availability in Oriente
const serviceCategories = [
  {
    name: "Consulta Externa Especializada",
    availability: "Limitada a Rionegro",
    level: "amber" as const,
  },
  {
    name: "Cirugia Ambulatoria",
    availability: "Solo Clinica Somer",
    level: "red" as const,
  },
  {
    name: "Imagenes Diagnosticas (TAC, RMN)",
    availability: "Deficit severo",
    level: "red" as const,
  },
  {
    name: "Laboratorio Clinico",
    availability: "Cobertura basica",
    level: "amber" as const,
  },
  {
    name: "Rehabilitacion",
    availability: "Minima",
    level: "red" as const,
  },
  {
    name: "Oncologia Ambulatoria",
    availability: "Inexistente en Oriente",
    level: "red" as const,
  },
  {
    name: "Hemodialisis",
    availability: "1-2 centros",
    level: "amber" as const,
  },
  {
    name: "Cardiologia Intervencionista",
    availability: "Solo SOMER INCARE",
    level: "red" as const,
  },
];

const levelColor = {
  red: "bg-red-100 text-red-700 border-red-300",
  amber: "bg-amber-100 text-amber-700 border-amber-300",
  green: "bg-green-100 text-green-700 border-green-300",
};

export function AmbulatoryServicesSection() {
  const totalContributivo = orienteMunicipios.reduce(
    (s, m) => s + m.afiliadosContributivo,
    0
  );
  const totalSubsidiado = orienteMunicipios.reduce(
    (s, m) => s + m.afiliadosSubsidiado,
    0
  );
  const totalAfiliados = totalContributivo + totalSubsidiado;

  return (
    <SectionWrapper id="servicios-ambulatorios">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Portafolio — Servicios Ambulatorios y Privados
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Mas Alla de las Camas: Oportunidad Ambulatoria
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Analisis de servicios ambulatorios disponibles en el Oriente
          Antioqueno a partir de REPS capacidad instalada y datos de
          aseguramiento en salud (RUAF).
        </p>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Consultorios Oriente
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(orienteHealthSummary.totalConsultorios)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            REPS capacidad instalada
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Salas Procedimiento
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {formatNumber(orienteHealthSummary.totalSalas)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            REPS capacidad instalada
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Afiliados Contributivo
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatNumber(totalContributivo)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Oriente RUAF Abr 2022
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Gap Ambulatorio
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            Critico
          </p>
          <p className="text-[10px] text-muted-foreground">
            5 de 8 servicios en deficit
          </p>
        </motion.div>
      </div>

      {/* Service categories grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold">
            Disponibilidad de Servicios Ambulatorios en Oriente
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="rounded-xl border bg-card p-4"
            >
              <p className="text-xs font-bold leading-tight mb-2">
                {svc.name}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border",
                  levelColor[svc.level]
                )}
              >
                {svc.availability}
              </span>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Fuente: REPS Capacidad Instalada (b4dp-ximh) — clasificacion de
          servicios habilitados por tipo y nivel
        </p>
      </motion.div>

      {/* Health insurance market table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-card overflow-x-auto mb-8"
      >
        <div className="p-4 sm:p-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">
              Mercado de Aseguramiento en Salud — Oriente Antioqueno
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Fuente: RUAF Aseguramiento (ruaf-giye), Abril 2022. Municipios con
            &gt;50% contributivo = mercado atractivo para salud privada.
          </p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-y border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wider">
                Municipio
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Contributivo
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Subsidiado
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                Total
              </th>
              <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wider">
                % Contributivo
              </th>
            </tr>
          </thead>
          <tbody>
            {orienteMunicipios.map((mun) => {
              const total = mun.afiliadosContributivo + mun.afiliadosSubsidiado;
              const pctContrib =
                total > 0
                  ? ((mun.afiliadosContributivo / total) * 100).toFixed(1)
                  : "0.0";
              const isStrong = parseFloat(pctContrib) > 50;
              return (
                <tr
                  key={mun.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/20",
                    isStrong && "bg-teal-50/40"
                  )}
                >
                  <td className="py-2.5 px-4 font-medium text-xs">
                    {mun.name}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {formatNumber(mun.afiliadosContributivo)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {formatNumber(mun.afiliadosSubsidiado)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold">
                    {formatNumber(total)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border",
                        isStrong
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}
                    >
                      {pctContrib}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Sum row */}
            <tr className="border-t-2 border-border bg-muted/30 font-bold">
              <td className="py-2.5 px-4 text-xs">Total Oriente</td>
              <td className="py-2.5 px-3 text-center text-xs">
                {formatNumber(totalContributivo)}
              </td>
              <td className="py-2.5 px-3 text-center text-xs">
                {formatNumber(totalSubsidiado)}
              </td>
              <td className="py-2.5 px-3 text-center text-xs">
                {formatNumber(totalAfiliados)}
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border bg-teal-50 text-teal-700 border-teal-200">
                  {((totalContributivo / totalAfiliados) * 100).toFixed(1)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 bg-muted/20 border-t">
          <p className="text-[10px] text-muted-foreground">
            <strong>Destacado:</strong> Rionegro ({((orienteMunicipios[0].afiliadosContributivo /
              (orienteMunicipios[0].afiliadosContributivo + orienteMunicipios[0].afiliadosSubsidiado)) * 100).toFixed(0)}%
            contributivo), La Ceja y El Retiro tienen mercados privados fuertes. Municipios con
            fondo verde superan el 50% de afiliacion contributiva.
          </p>
        </div>
      </motion.div>

      {/* Insight box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border-2 border-teal-300 bg-teal-50/50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-lg font-bold text-teal-800">
              Portafolio Ambulatorio: Alto Margen, Baja Competencia
            </h4>
            <p className="text-sm text-teal-700 mt-1">
              La mayoria de servicios en el Oriente son basicos (Nivel 1). Los
              servicios ambulatorios especializados —{" "}
              <strong>oncologia, cardiologia intervencionista, imagenes
              avanzadas</strong> — requieren referencia a Medellin. Una sede
              satelite HPTU con enfoque ambulatorio capturaria:{" "}
              <strong>consultas especializadas, cirugia de dia, imagenes
              diagnosticas y rehabilitacion</strong> — todo sin necesidad de camas
              de hospitalizacion. El mercado{" "}
              <strong>contributivo/prepagada</strong> en el Oriente crece con el
              desarrollo economico de Rionegro, que ya tiene{" "}
              <strong>{formatNumber(orienteMunicipios[0].afiliadosContributivo)} afiliados
              contributivos</strong> ({((orienteMunicipios[0].afiliadosContributivo /
              (orienteMunicipios[0].afiliadosContributivo + orienteMunicipios[0].afiliadosSubsidiado)) * 100).toFixed(0)}%
              del total municipal).
            </p>
            <p className="text-xs text-teal-600 mt-2 italic">
              Fuentes: REPS Capacidad Instalada (b4dp-ximh), RUAF Aseguramiento
              (ruaf-giye), Google Places API
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
