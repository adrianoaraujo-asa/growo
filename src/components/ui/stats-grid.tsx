import { StatCard } from '@/components/dashboard/StatCard';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'success' | 'info' | 'warning';
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, className, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn("grid gap-4 mb-6", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
          delay={index * 100}
        />
      ))}
    </div>
  );
}
