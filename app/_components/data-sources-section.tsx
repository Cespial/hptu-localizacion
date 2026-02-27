"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, Map, Users, Building2, Car, Hospital } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

const sources = [
  {
    icon: FileSpreadsheet,
    name: "Catastro Municipal Medellin",
    dataset: "bp59-rj8r",
    portal: "datos.gov.co / MEData",
    records: 1041413,
    description: "Predios por comuna, barrio, estrato, avaluo. 38,415 predios E6 en El Poblado.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Users,
    name: "DANE - Censo Nacional 2018",
    dataset: "evm3-92yw",
    portal: "datos.gov.co",
    records: 465,
    description: "Poblacion por municipio y edad: Medellin 2.33M, Envigado 211K, Itagui 241K, Sabaneta 74K.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Car,
    name: "MEData - Velocidad y Tiempo de Viaje GT",
    dataset: "7t5n-3b3w",
    portal: "MEData / datos.gov.co",
    records: 682502,
    description: "Velocidades por corredor 2017-2020. Av. Las Palmas: 40.9 km/h avg, 64,285 obs.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Car,
    name: "MEData - Aforos Vehiculares",
    dataset: "b9s9-jw7c",
    portal: "MEData / datos.gov.co",
    records: 74900,
    description: "Conteos vehiculares por interseccion en intervalos de 15 min. 14 nodos en area de estudio.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Hospital,
    name: "REPS - Prestadores de Salud",
    dataset: "b4dp-ximh",
    portal: "datos.gov.co / MinSalud",
    records: 1536,
    description: "IPS habilitadas en Valle de Aburra. HPTU: 1,094 camas. 842 IPS en area focal.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Hospital,
    name: "REPS - Capacidad Instalada",
    dataset: "s2ru-bqt6",
    portal: "datos.gov.co / MinSalud",
    records: 1711,
    description: "Camas por tipo (adultos, UCI, neonatal). Datos noviembre 2022.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Building2,
    name: "POT - Bateria Indicadores Barrio",
    dataset: "3ciz-tpgr",
    portal: "MEData / datos.gov.co",
    records: 331741,
    description: "IC, IO, alturas, CL_D, ICS, ICF, SPD por barrio. 22 barrios de Comuna 14 analizados.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Building2,
    name: "Lotes Potenciales de Desarrollo",
    dataset: "m4wi-nn8x",
    portal: "MEData / datos.gov.co",
    records: 441966,
    description: "592 lotes / 414,309 m2 en corredor Las Palmas con tratamiento CN3/CN5.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Building2,
    name: "Licencias Urbanisticas",
    dataset: "pxmc-bbtu",
    portal: "MEData / datos.gov.co",
    records: 32266,
    description: "1,186 licencias en El Poblado. 27 licencias dotacional/salud otorgadas.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Map,
    name: "OpenStreetMap - Overpass API",
    dataset: "Overpass QL",
    portal: "overpass-api.de",
    records: 1323,
    description: "POIs con coordenadas: 178 salud, 750 educacion, 330 comercial, 65 recreacion.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    icon: Map,
    name: "Mapbox Matrix API",
    dataset: "directions-matrix/v1",
    portal: "api.mapbox.com",
    records: 25, // 5x5 matrix
    description: "Tiempos de viaje reales entre 5 zonas candidatas y 5 destinos clave.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Map,
    name: "Mapbox Isochrone API",
    dataset: "isochrone/v1",
    portal: "api.mapbox.com",
    records: 15, // 5 zones x 3 isochrones
    description: "Isocronas reales 10/20/30 min para 5 zonas candidatas. Datos de trafico en vivo.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Users,
    name: "EPM - Estratificacion y Cobertura",
    dataset: "datos.gov.co",
    portal: "datos.gov.co",
    records: 951,
    description: "Suscriptores por estrato/comuna. El Poblado E6: 36,351 suscriptores acueducto.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Map,
    name: "ArcGIS - Estratos por Manzana",
    dataset: "FeatureServer/7",
    portal: "services.arcgis.com",
    records: 5142,
    description: "Estratificacion por manzana censal. El Poblado: 687 manzanas E6, 214 E5.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
];

export function DataSourcesSection() {
  const totalRecords = sources.reduce((sum, s) => sum + s.records, 0);

  return (
    <SectionWrapper id="fuentes-datos">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">Linea Base - Fuentes Primarias</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          {formatNumber(totalRecords)}+ Registros de {sources.length} Fuentes
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Toda la informacion del estudio proviene de fuentes primarias oficiales
          y APIs verificables. Cero datos estimados. Cada metrica tiene trazabilidad
          a su dataset original.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source, i) => {
          const Icon = source.icon;
          return (
            <motion.div
              key={source.dataset + source.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", source.bgColor)}>
                  <Icon className={cn("h-4 w-4", source.color)} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold leading-tight">{source.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <code className="text-[10px] bg-muted px-1 py-0.5 rounded font-mono">{source.dataset}</code>
                    <span className="text-[10px] text-muted-foreground">{source.portal}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{source.description}</p>
                  <p className="text-[10px] font-semibold mt-0.5">{formatNumber(source.records)} registros</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
