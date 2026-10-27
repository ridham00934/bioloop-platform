import { motion } from 'framer-motion';

export function BioLoopLogo({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 6 C20 10 22 14 16 20 C10 14 8 10 16 6 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" />
      <path
        d="M16 20 L16 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="26" r="1.6" fill="currentColor" />
    </motion.svg>
  );
}
