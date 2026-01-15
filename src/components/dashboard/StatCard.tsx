import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'success' | 'info' | 'warning';
  delay?: number;
}

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * end);

        if (currentCount !== countRef.current) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return count;
}

const colorConfig = {
  primary: {
    gradient: 'from-primary/20 via-primary/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-primary to-primary/80',
    iconShadow: 'shadow-[0_8px_16px_-4px_hsl(var(--primary)/0.4)]',
    ring: 'ring-primary/20',
    glow: 'after:bg-primary/20',
  },
  success: {
    gradient: 'from-success/20 via-success/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-success to-success/80',
    iconShadow: 'shadow-[0_8px_16px_-4px_hsl(var(--success)/0.4)]',
    ring: 'ring-success/20',
    glow: 'after:bg-success/20',
  },
  info: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-info to-info/80',
    iconShadow: 'shadow-[0_8px_16px_-4px_hsl(var(--info)/0.4)]',
    ring: 'ring-info/20',
    glow: 'after:bg-info/20',
  },
  warning: {
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-warning to-warning/80',
    iconShadow: 'shadow-[0_8px_16px_-4px_hsl(var(--warning)/0.4)]',
    ring: 'ring-warning/20',
    glow: 'after:bg-warning/20',
  },
};

export function StatCard({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  change, 
  trend, 
  icon: Icon, 
  color,
  delay = 0 
}: StatCardProps) {
  const animatedValue = useCountUp(value, 2000, delay);
  const config = colorConfig[color];

  // Format number with locale
  const formattedValue = animatedValue.toLocaleString('pt-BR');

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card border border-border/50",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-smooth",
        "hover:-translate-y-1",
        // Glow effect on hover
        "after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-300",
        "hover:after:opacity-100 after:pointer-events-none",
        config.glow,
        "after:blur-xl after:-z-10"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-80",
          `bg-gradient-radial ${config.gradient}`
        )} 
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-heading tracking-tight">
              <span className="inline-block animate-fade-in">
                {prefix}{formattedValue}{suffix}
              </span>
            </h3>
            
            {/* Trend indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div 
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                  "transition-all duration-200",
                  trend === 'up' 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{change}</span>
              </div>
              <span className="text-xs text-muted-foreground">vs mês anterior</span>
            </div>
          </div>

          {/* 3D Icon */}
          <div 
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-xl",
              "transition-all duration-300 ease-smooth",
              "group-hover:scale-110 group-hover:-rotate-3",
              config.iconBg,
              config.iconShadow,
              // Inner highlight for 3D effect
              "before:absolute before:inset-0 before:rounded-xl",
              "before:bg-gradient-to-b before:from-white/25 before:to-transparent",
              "before:opacity-100"
            )}
          >
            <Icon className="h-6 w-6 text-white relative z-10 drop-shadow-sm" />
            
            {/* Floating ring effect */}
            <div 
              className={cn(
                "absolute -inset-1 rounded-xl opacity-0 ring-2",
                "transition-all duration-300 group-hover:opacity-100 group-hover:-inset-2",
                config.ring
              )} 
            />
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className={cn(
              "h-full w-full transition-transform duration-500 -translate-x-full group-hover:translate-x-0",
              config.iconBg
            )} 
          />
        </div>
      </div>
    </div>
  );
}
