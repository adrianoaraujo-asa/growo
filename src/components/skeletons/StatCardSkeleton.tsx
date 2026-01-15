import { cn } from "@/lib/utils";

interface StatCardSkeletonProps {
  color?: 'primary' | 'success' | 'info' | 'warning';
}

const colorConfig = {
  primary: {
    gradient: 'from-primary/10 via-primary/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-primary/20 to-primary/10',
  },
  success: {
    gradient: 'from-success/10 via-success/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-success/20 to-success/10',
  },
  info: {
    gradient: 'from-info/10 via-info/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-info/20 to-info/10',
  },
  warning: {
    gradient: 'from-warning/10 via-warning/5 to-transparent',
    iconBg: 'bg-gradient-to-br from-warning/20 to-warning/10',
  },
};

export function StatCardSkeleton({ color = 'primary' }: StatCardSkeletonProps) {
  const config = colorConfig[color];

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl bg-card border border-border/50",
        "shadow-card"
      )}
    >
      {/* Background gradient */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-40",
          `bg-gradient-radial ${config.gradient}`
        )} 
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          {/* Content skeleton */}
          <div className="space-y-3 flex-1">
            {/* Title */}
            <div className="skeleton-3d-shimmer h-4 w-24 rounded-md" />
            
            {/* Value */}
            <div className="skeleton-3d-shimmer h-9 w-32 rounded-lg" />
            
            {/* Trend indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div className="skeleton-3d-shimmer h-6 w-16 rounded-full" />
              <div className="skeleton-3d-shimmer h-4 w-20 rounded-md" />
            </div>
          </div>

          {/* 3D Icon skeleton */}
          <div 
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-xl",
              "skeleton-3d-pulse",
              config.iconBg,
              // Inner highlight for 3D effect
              "before:absolute before:inset-0 before:rounded-xl",
              "before:bg-gradient-to-b before:from-white/15 before:to-transparent"
            )}
          >
            <div className="skeleton-3d-shimmer h-6 w-6 rounded-md" />
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <div className={cn("h-full skeleton-3d-shimmer")} />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeletonGrid() {
  const colors: Array<'primary' | 'success' | 'info' | 'warning'> = ['primary', 'success', 'info', 'warning'];
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {colors.map((color, index) => (
        <div 
          key={color}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StatCardSkeleton color={color} />
        </div>
      ))}
    </div>
  );
}
