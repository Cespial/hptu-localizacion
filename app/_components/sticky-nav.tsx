"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Resumen", href: "#resumen-ejecutivo" },
  { label: "Mapa", href: "#mapa-estrategico" },
  { label: "Recomendacion", href: "#concepto-ambulatorio" },
  { label: "Mercado", href: "#oriente-demografico" },
  { label: "Modelo", href: "#comparativa-mcda" },
  { label: "Financiero", href: "#modelo-financiero" },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div className="h-full bg-[#0D9488] transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center h-12 gap-1 overflow-x-auto scrollbar-none snap-x snap-mandatory">
          <span className="text-xs font-bold text-[#00549F] mr-3 shrink-0 snap-start">HPTU</span>
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors snap-start",
                activeSection === item.href
                  ? "bg-[#0D9488] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
