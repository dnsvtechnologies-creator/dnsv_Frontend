import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function AnimatedLogoBackground() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
    >
      {/* Light Base Canvas inspired by logo highlights */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFD] via-[#F1F5FB] to-[#EDF2FA]" />

      {/* Primary Cyan Floating Orb */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : {
                x: [0, 45, -30, 0],
                y: [0, -40, 30, 0],
                scale: [1, 1.15, 0.95, 1],
                opacity: [0.25, 0.38, 0.28, 0.25]
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-20 -left-20 w-[420px] h-[420px] sm:w-[700px] sm:h-[700px] rounded-full blur-[70px] sm:blur-[105px] bg-[#38BDF8]/35 will-change-transform"
      />

      {/* Royal Cobalt & Sapphire Orb */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : {
                x: [0, -50, 40, 0],
                y: [0, 50, -35, 0],
                scale: [1, 1.18, 0.92, 1],
                opacity: [0.22, 0.32, 0.22, 0.22]
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/4 -right-24 w-[400px] h-[400px] sm:w-[660px] sm:h-[660px] rounded-full blur-[75px] sm:blur-[110px] bg-[#60A5FA]/30 will-change-transform"
      />

      {/* Platinum Silver Highlight Orb */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : {
                x: [0, 30, -40, 0],
                y: [0, -30, 40, 0],
                scale: [0.95, 1.12, 1, 0.95],
                opacity: [0.4, 0.6, 0.45, 0.4]
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="hidden sm:block absolute top-2/3 left-1/3 w-[560px] h-[560px] rounded-full blur-[95px] bg-[#E0E7FF]/60 will-change-transform"
      />

      {/* Bottom Subtle Cyan Accent Wave */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : {
                x: [0, -30, 25, 0],
                y: [0, 25, -20, 0],
                opacity: [0.18, 0.28, 0.2, 0.18]
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="hidden sm:block absolute -bottom-32 right-1/4 w-[580px] h-[380px] rounded-full blur-[110px] bg-[#38BDF8]/25 will-change-transform"
      />

      {/* Subtle Digital Nexus Fine Tech Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00D2FF_1px,transparent_1px),linear-gradient(to_bottom,#00D2FF_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-[0.025]" />
    </div>
  );
}
