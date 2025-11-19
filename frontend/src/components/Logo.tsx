import React from 'react';
import { motion } from 'framer-motion';

export const LogoIcon = ({ className = "text-blue-500", size = 32 }: { className?: string, size?: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ rotate: 180, scale: 1.1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className={className}
  >
    <path
      d="M16 2L2 10V22L16 30L30 22V10L16 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <motion.path
      d="M16 8L8 12.5V20.5L16 25L24 20.5V12.5L16 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0.5 }}
      whileHover={{ opacity: 1, stroke: "#a855f7" }}
    />
    <circle cx="16" cy="16.5" r="2" fill="currentColor" />
  </motion.svg>
);
