"use client";

import { motion } from "framer-motion";
import { MapPin, Route, BarChart3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const stats = [
  { icon: Route, label: "Fases", value: 4, suffix: "" },
  { icon: MapPin, label: "Zonas Candidatas", value: 3, suffix: "" },
  { icon: BarChart3, label: "Score MCDA", value: 100, prefix: "0-" },
  { icon: Calendar, label: "Semanas", value: 5, suffix: "" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#00549f] via-[#003d75] to-[#0f172a]">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating dots animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-teal-400/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pb-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              Observatorio de Datos y Analisis
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl tracking-tight"
          >
            Estudio de Localizacion
            <br />
            <span className="text-teal-300">Estrategica</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-lg font-semibold text-white/90 sm:text-xl md:text-2xl"
          >
            HPTU Nueva Sede
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg"
          >
            Modelo de Nodos y Flujos de Valor para identificar la ubicacion
            optima de la nueva sede, enfocado en poblacion de estratos 5 y 6
            del Area Metropolitana del Valle de Aburra.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25"
              onClick={() => document.getElementById("metodologia")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Route className="mr-2 h-4 w-4" />
              Ver Metodologia
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={() => document.getElementById("mapa-piloto")?.scrollIntoView({ behavior: "smooth" })}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Explorar Mapa Piloto
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 w-full max-w-3xl"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm"
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-teal-400" />
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <div className="mt-1 text-xs text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 60C960 50 1056 40 1152 42C1248 44 1344 58 1392 65L1440 72V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
