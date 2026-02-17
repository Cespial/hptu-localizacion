"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
};

export function SectionWrapper({ children, className, id, fullWidth = false }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "py-12 lg:py-16",
        !fullWidth && "mx-auto max-w-7xl px-4 lg:px-6",
        className
      )}
    >
      {children}
    </motion.section>
  );
}
