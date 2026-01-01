import { cn } from '../../lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * TiltCard - Reusable 3D tilt effect wrapper
 * Uses Framer Motion for physics-based animations
 */
export default function TiltCard({ children, className = '', intensity = 15 }) {
    const ref = useRef(null);

    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const springConfig = { damping: 20, stiffness: 300 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const rotateX = useTransform(ySpring, [0, 1], [intensity, -intensity]);
    const rotateY = useTransform(xSpring, [0, 1], [-intensity, intensity]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width;
        const yPos = (e.clientY - rect.top) / rect.height;
        x.set(xPos);
        y.set(yPos);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: 'preserve-3d',
            }}
            className={className}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
