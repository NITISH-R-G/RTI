import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/**
 * Reimplemented from React Bits' AnimatedContent (reactbits.dev/animations/animated-content)
 * against `motion` instead of the registry's gsap variant, so the product pulls in one
 * animation library, not two, for a total of three components.
 *
 * Reveals children once, on entering the viewport. Respects prefers-reduced-motion by
 * skipping straight to the resting state.
 */
export function AnimatedContent({
  children,
  delay = 0,
  distance = 24,
  duration = 0.5,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
