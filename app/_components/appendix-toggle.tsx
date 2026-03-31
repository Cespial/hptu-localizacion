"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AppendixToggle({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t-2 border-dashed border-border/60 mt-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 w-full sm:w-auto mx-auto px-6 py-3 rounded-full border-2 border-border hover:border-[#0D9488] bg-white hover:bg-teal-50/50 transition-all group"
        >
          <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-[#0D9488]" />
          <span className="text-sm font-semibold text-muted-foreground group-hover:text-[#0D9488]">
            {isOpen ? "Ocultar" : "Ver"} Apendice Tecnico
          </span>
          <span className="hidden sm:inline text-[10px] text-muted-foreground/60">
            Metodologia, fuentes, arquitectura, cronograma
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-muted/20 border-t border-border/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
