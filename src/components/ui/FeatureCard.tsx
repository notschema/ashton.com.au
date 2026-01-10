'use client';
import { cn } from '../../lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

type FeatureCardProps = React.ComponentProps<'div'> & {
  delay?: number;
};

export default function FeatureCard({ children, className, delay = 0, ...props }: FeatureCardProps) {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const id = React.useId();

  const content = (
    <div className={cn('relative overflow-hidden h-full border border-border/50 bg-background/50', className)} {...props}>
      {/* Noise Texture Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id={id}>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.85" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} />
        </svg>
      </div>
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );

  // During SSR or before mount, return static content
  if (!mounted || shouldReduceMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="h-full"
    >
      {content}
    </motion.div>
  );
}

