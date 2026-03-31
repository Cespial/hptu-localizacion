"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Mountain,
  Users,
  Stethoscope,
  Database,
  BedDouble,
  Clock,
  Building2,
  Activity,
  Wifi,
  ClipboardCheck,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("es-CO").format(n);

/* ---------- Data ---------- */

const demandStats = [
  { value: "40-46%", label: "de pacientes en urgencias de Rionegro son de OTROS municipios", sublabel: "ASIS Rionegro 2024, Tabla 40", color: "text-amber-600" },
  { value: "79,956", label: "triajes totales en 2023 en hospitales de Rionegro", sublabel: "SISPRO 2023", color: "text-teal-600" },
  { value: "~33,600", label: "pacientes no residentes atendidos/ano en Rionegro", sublabel: "Estimacion ASIS (46% de 79,956)", color: "text-amber-600" },
  { value: "114%", label: "sobreocupacion en urgencias de Rionegro", sublabel: "El Colombiano, enero 2026", color: "text-red-600" },
  { value: "0 camas UCI", label: "disponibles en Rionegro en 2023", sublabel: "ASIS Tabla 13 -- bajo de 0.14/1000 en 2022 a 0.00", color: "text-red-600" },
  { value: "3.22", label: "camas/1000 hab en Rionegro (bajando de 4.70 en 2015)", sublabel: "ASIS Tabla 13", color: "text-amber-600" },
];

const epsData = [
  { municipio: "Medellin", contributivo: 2032454, topEps: "Sura", pctSura: "69.9%", eps2: "Salud Total", pctEps2: "12.8%" },
  { municipio: "Envigado", contributivo: 185864, topEps: "Sura", pctSura: "77.2%", eps2: "Nueva EPS", pctEps2: "7.6%" },
  { municipio: "Rionegro", contributivo: 169749, topEps: "Sura", pctSura: "66.5%", eps2: "Nueva EPS", pctEps2: "15.1%" },
  { municipio: "La Ceja", contributivo: 64947, topEps: "Sura", pctSura: "79.1%", eps2: "Nueva EPS", pctEps2: "14.4%" },
  { municipio: "Marinilla", contributivo: 47398, topEps: "Sura", pctSura: "64.1%", eps2: "Nueva EPS", pctEps2: "21.8%" },
  { municipio: "Guarne", contributivo: 35698, topEps: "Sura", pctSura: "67.4%", eps2: "Nueva EPS", pctEps2: "19.9%" },
  { municipio: "El Retiro", contributivo: 15530, topEps: "Sura", pctSura: "64.8%", eps2: "Nueva EPS", pctEps2: "30.4%" },
];

const landslideEvents = [
  { date: "Sep 2014", event: "Deslizamiento Via Las Palmas cerca Colegio San Jose de La Salle -- carril bloqueado", severity: "amber" },
  { date: "May 2019", event: "Movimiento en masa Las Palmas, Envigado -- 9 de 11 viviendas evacuadas", severity: "amber" },
  { date: "Jul 2024", event: "Deslizamiento Cra 18 / Calle 1, El Poblado -- tercer evento del mismo tipo segun DAGRD", severity: "amber" },
  { date: "May 2025", event: "DESLIZAMIENTO MASIVO Loma de Los Balsos, El Poblado -- via cerrada +2 meses, roca destruyo vivienda", severity: "red" },
  { date: "May 2025", event: "Caida de arbol Av. Las Palmas, Mall Palma Grande", severity: "amber" },
];

const staffingStrategy = [
  { modalidad: "Core presencial", especialidades: "Anestesiologia, Ortopedia, Urologia, Ginecologia, ORL, Imagenes, Lab, Rehabilitacion", presencia: "5-6 dias/semana" },
  { modalidad: "Rotacion", especialidades: "Medicina Interna subs., Dermatologia, Endocrinologia, Manejo dolor", presencia: "1-2 dias/semana" },
  { modalidad: "Telemedicina", especialidades: "Cardiologia, Neurologia, Psiquiatria, Reumatologia, seguimientos", presencia: "Remoto desde Medellin" },
  { modalidad: "Chequeo ejecutivo", especialidades: "Lab + Imagenes + Enfermeria on-site", presencia: "Interpretacion remota disponible" },
];

const hrStats = [
  { value: "10,375", label: "proveedores de salud registrados en Medellin", sublabel: "REPS", color: "text-teal-600", icon: Stethoscope },
  { value: "~1,166", label: "en todo el Oriente Antioqueno (ratio 9:1)", sublabel: "REPS", color: "text-teal-600", icon: Users },
  { value: "8-12 min", label: "de El Poblado (zona residencial de especialistas) a Km 7", sublabel: "Mapbox Directions API", color: "text-teal-600", icon: Clock },
  { value: "250 pac/dia", label: "proyeccion Clinica Campestre Rionegro (precedente validado marzo 2026)", sublabel: "El Colombiano 2026", color: "text-emerald-600", icon: Building2 },
];

const datasets = [
  { name: "RIPS Nacional", id: "4k9h-8qiu", registros: "38M", utilidad: "Volumen de servicios por municipio (NO tiene origen paciente)" },
  { name: "BDUA Contributivo", id: "tq4m-hmg2", registros: "714K", utilidad: "Afiliados por EPS por municipio (ACTUAL, marzo 2026)" },
  { name: "BDUA Subsidiado", id: "d7a5-cnra", registros: "1.27M", utilidad: "Subsidiado por municipio (campo cantidad como texto)" },
  { name: "IPS Capacidad Instalada", id: "s2ru-bqt6", registros: "41K", utilidad: "Camas, consultorios, quirofanos por IPS y municipio" },
  { name: "REPS Antioquia", id: "b4dp-ximh", registros: "17K", utilidad: "Registro de prestadores habilitados" },
  { name: "ReTHUS", id: "my8c-6xkk", registros: "92K", utilidad: "Talento humano por especialidad y municipio" },
];

/* ---------- Component ---------- */

export function DataIntelligenceSection() {
  const totalContributivo = epsData.reduce((acc, row) => acc + row.contributivo, 0);

  return (
    <SectionWrapper id="data-intelligence">
      <div className="text-center mb-8 lg:mb-10">
        <Badge variant="outline" className="mb-4">
          Inteligencia Operativa — Para Planificacion
        </Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Inteligencia de Datos Verificada
        </h2>
        <p className="mt-3 text-muted-foreground max-w-3xl mx-auto">
          Evidencia procesada de SISPRO, ADRES/BDUA, REPS, ReTHUS, SIMMA y datos.gov.co
          para evaluar Access Point (Km 7 Via Las Palmas) como sede satelite hospitalaria.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-16">

        {/* ================================================================ */}
        {/* SUB-SECTION A: Recurso Humano y Estrategia de Personal           */}
        {/* ================================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 shrink-0">
              <Stethoscope className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Recurso Humano y Estrategia de Personal
              </h3>
              <p className="text-xs text-muted-foreground">
                Disponibilidad de talento medico y modelo de staffing propuesto
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                REPS / ReTHUS
              </Badge>
              <h4 className="text-sm font-bold">
                Factibilidad de Recurso Humano
              </h4>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {hrStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                  >
                    <Icon className="h-5 w-5 text-gray-400 mb-2" />
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-gray-700 mt-1">{stat.label}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{stat.sublabel}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Staffing strategy table */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Modalidad</th>
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Especialidades</th>
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Presencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffingStrategy.map((row) => {
                      const iconMap: Record<string, typeof Stethoscope> = {
                        "Core presencial": ClipboardCheck,
                        "Rotacion": Stethoscope,
                        "Telemedicina": Wifi,
                        "Chequeo ejecutivo": BedDouble,
                      };
                      const RowIcon = iconMap[row.modalidad] || Stethoscope;
                      return (
                        <tr key={row.modalidad} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <RowIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                              <span className="font-medium text-gray-900">{row.modalidad}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-700">{row.especialidades}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              {row.presencia}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regulatory note */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-800">
                <strong>Marco regulatorio:</strong> Res. 2654/2019 + Res. 3100/2019 habilitan telemedicina
                interactiva para prescripcion. El facility puede ofrecer 30+ subespecialidades con equipo
                presencial reducido + telemedicina.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ================================================================ */}
        {/* SUB-SECTION B: Dominancia EPS y Contratacion                     */}
        {/* ================================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-100 shrink-0">
              <HeartPulse className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Dominancia EPS y Contratacion
              </h3>
              <p className="text-xs text-muted-foreground">
                Mapa de aseguradores en el area de influencia y demanda hospitalaria
              </p>
            </div>
          </div>

          {/* Demand stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                SISPRO / ASIS Rionegro 2024
              </Badge>
              <h4 className="text-sm font-bold">
                Demanda Verificada -- Flujo de Pacientes Oriente a Medellin
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {demandStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-700 mt-1">{stat.label}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{stat.sublabel}</p>
                </motion.div>
              ))}
            </div>

            {/* Red alert */}
            <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  <strong>Rionegro declaro alerta hospitalaria</strong> pidiendo que traslados se
                  dirijan al Valle de Aburra. Access Point en Km 7 intercepta este flujo 30 min
                  antes de llegar a Medellin.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-2">
              Fuente: ASIS Rionegro 2024 (DSSA), El Colombiano ene 2026, SISPRO
            </p>
          </motion.div>

          {/* EPS table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
                ADRES/BDUA Marzo 2026
              </Badge>
              <h4 className="text-sm font-bold">
                Paisaje EPS -- Contratacion Requerida
              </h4>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Municipio</th>
                      <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Contributivo</th>
                      <th className="text-center px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Top EPS</th>
                      <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">% Sura</th>
                      <th className="text-center px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">#2 EPS</th>
                      <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">% #2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epsData.map((row) => (
                      <tr key={row.municipio} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.municipio}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{formatNumber(row.contributivo)}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                            {row.topEps}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-teal-700">{row.pctSura}</td>
                        <td className="px-4 py-2.5 text-center text-gray-600">{row.eps2}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{row.pctEps2}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-4 py-2.5 text-gray-900">TOTAL</td>
                      <td className="px-4 py-2.5 text-right text-teal-700">{formatNumber(totalContributivo)}</td>
                      <td colSpan={4} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insight box */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm text-slate-800">
                <strong>EPS Sura controla 64-79% del mercado contributivo</strong> en todo el catchment.
                Es el contrato ancla obligatorio. Nueva EPS es #2 consistente en Oriente (15-30%).
                Sanitas tiene presencia notable solo en Rionegro (8.6%) y Envigado (6.7%).
              </p>
            </div>
          </motion.div>
        </div>

        {/* ================================================================ */}
        {/* SUB-SECTION C: Riesgo Geologico y Sismico                        */}
        {/* ================================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 shrink-0">
              <ShieldAlert className="h-4 w-4 text-red-700" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Riesgo Geologico y Sismico
              </h3>
              <p className="text-xs text-muted-foreground">
                Historial de eventos y requerimientos de due diligence para el sitio
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-red-50 text-red-700 border border-red-200">
                SIMMA / DAGRD / SIATA
              </Badge>
              <h4 className="text-sm font-bold">
                Riesgo Geotecnico -- Due Diligence Obligatorio
              </h4>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-red-500 rounded-full" />

                <div className="space-y-4 pl-8">
                  {landslideEvents.map((evt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="relative"
                    >
                      <div
                        className={`absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-white shadow ${
                          evt.severity === "red" ? "bg-red-500" : "bg-amber-400"
                        }`}
                      />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{evt.date}</p>
                      <p className={`text-sm mt-0.5 ${evt.severity === "red" ? "text-red-800 font-semibold" : "text-gray-700"}`}>
                        {evt.event}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seismic info */}
            <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <Activity className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Zona sismica intermedia NSR-10</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    Aa=0.15g, Av=0.20g. Microzonificacion AMVA requerida para factores de
                    amplificacion del sitio especifico.
                  </p>
                </div>
              </div>
            </div>

            {/* Red alert */}
            <div className="mt-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start gap-2">
                <Mountain className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  <strong>REQUERIDO:</strong> Estudio geotecnico especifico del predio Access Point antes de
                  cualquier decision. La Loma de Los Balsos (2025) esta a &lt;2 km del sitio.
                  DAGRD reconoce patron recurrente de eventos en la zona.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-2">
              Fuente: UNGRD (rgre-6ak4, wwkg-r6te), DAGRD Medellin, El Tiempo, Minuto30, SGC
            </p>
          </motion.div>
        </div>

        {/* ================================================================ */}
        {/* SUB-SECTION D: Datasets Procesables                              */}
        {/* ================================================================ */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 shrink-0">
              <Database className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                Datasets Procesables
              </h3>
              <p className="text-xs text-muted-foreground">
                Fuentes de datos abiertos disponibles para profundizar el analisis
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                datos.gov.co
              </Badge>
              <h4 className="text-sm font-bold">
                Proximos Pasos
              </h4>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Dataset</th>
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">ID</th>
                      <th className="text-right px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Registros</th>
                      <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider text-gray-500 font-medium">Utilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((ds) => (
                      <tr key={ds.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{ds.name}</td>
                        <td className="px-4 py-2.5">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-blue-700">
                            {ds.id}
                          </code>
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{ds.registros}</td>
                        <td className="px-4 py-2.5 text-gray-600 text-xs">{ds.utilidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical data note */}
            <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start gap-2">
                <Database className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  <strong>Dato CRITICO no disponible en datos abiertos:</strong> matriz origen-destino
                  de pacientes (municipio residencia x municipio atencion). Requiere acceso institucional
                  a SISPRO via HPTU o Secretaria Seccional de Salud de Antioquia.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </SectionWrapper>
  );
}
