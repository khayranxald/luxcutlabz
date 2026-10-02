"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className={className}>
      {children}
    </motion.div>
  );
}
