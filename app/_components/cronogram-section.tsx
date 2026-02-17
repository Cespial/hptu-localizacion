"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { timeline } from "@/lib/demo-data/timeline";

export function CronogramSection() {
  return (
    <SectionWrapper id="cronograma">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4">Cronograma</Badge>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          Timeline del Proyecto
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Ejecucion en 5 semanas con entregables parciales semanales.
        </p>
      </div>

      {/* Desktop timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />

          <div className="grid grid-cols-5 gap-4">
            {timeline.map((week, i) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Node */}
                <div className="flex justify-center mb-4">
                  <div
                    className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background text-sm font-bold"
                    style={{ borderColor: week.color, color: week.color }}
                  >
                    S{week.week}
                  </div>
                </div>

                {/* Card */}
                <div className="rounded-lg border p-4" style={{ borderTopColor: week.color, borderTopWidth: 3 }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: week.color }}>
                    {week.phase}
                  </p>
                  <p className="text-sm font-bold mb-3">{week.title}</p>
                  <ul className="space-y-1.5">
                    {week.activities.map((a) => (
                      <li key={a} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: week.color }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile timeline */}
      <div className="md:hidden space-y-4">
        {timeline.map((week, i) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold shrink-0"
                style={{ borderColor: week.color, color: week.color }}
              >
                S{week.week}
              </div>
              {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
            </div>
            <div className="rounded-lg border p-4 flex-1 mb-2" style={{ borderLeftColor: week.color, borderLeftWidth: 3 }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: week.color }}>
                {week.phase}
              </p>
              <p className="text-sm font-bold mt-0.5 mb-2">{week.title}</p>
              <ul className="space-y-1">
                {week.activities.map((a) => (
                  <li key={a} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: week.color }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
