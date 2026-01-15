import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0, 
    y: 30,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Card hover animation
export const cardHover: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 2px 6px 0 rgba(67, 89, 113, 0.12)'
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: '0 12px 30px -8px rgba(67, 89, 113, 0.2)',
    transition: { 
      duration: 0.3, 
      ease: 'easeOut' 
    }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button hover animation
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Icon spin animation
export const iconSpin: Variants = {
  rest: { rotate: 0 },
  hover: { 
    rotate: 360,
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

// Pulse animation
export const pulse: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Page transition variants
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: { 
      duration: 0.3, 
      ease: 'easeIn' 
    }
  }
};

// Reusable motion components
interface MotionDivProps extends HTMLMotionProps<'div'> {
  variant?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp' | 'page';
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const variantMap = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  page: pageTransition
};

export function MotionDiv({ 
  variant = 'fadeInUp', 
  delay = 0, 
  children, 
  className,
  ...props 
}: MotionDivProps) {
  const selectedVariant = variantMap[variant];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedVariant}
      custom={delay}
      className={className}
      style={{ willChange: 'opacity, transform' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger container component
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1,
  ...props 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          }
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger item component
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated card component
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  hoverEffect = true,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover={hoverEffect ? "hover" : undefined}
      whileTap={hoverEffect ? "tap" : undefined}
      variants={cardHover}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Hover scale component
interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ 
  children, 
  className, 
  scale = 1.05,
  ...props 
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Page wrapper for transitions
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
