import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarConfig {
  avatar?: string;
  title: string;
  subtitle?: string;
  status?: { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'outline' };
  stats?: { icon: LucideIcon; value: string; label: string }[];
  details: { label: string; value: string }[];
  actions?: { label: string; onClick: () => void; variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' }[];
}

interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface DetailPageLayoutProps {
  sidebar: SidebarConfig;
  secondaryCard?: ReactNode;
  tabs: TabConfig[];
  activeTab: string;
  children: ReactNode;
}

const badgeVariantMap = {
  success: 'bg-success/10 text-success border-success/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  default: '',
  secondary: '',
  outline: '',
};

export function DetailPageLayout({
  sidebar,
  secondaryCard,
  tabs,
  activeTab,
  children,
}: DetailPageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Main Card */}
        <Card className="card-3d overflow-hidden">
          <CardContent className="p-6">
            {/* Avatar and Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
                <AvatarImage src={sidebar.avatar} alt={sidebar.title} />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {getInitials(sidebar.title)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-heading">{sidebar.title}</h2>
              {sidebar.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{sidebar.subtitle}</p>
              )}
              {sidebar.status && (
                <Badge 
                  variant={sidebar.status.variant}
                  className={cn(
                    "mt-3",
                    badgeVariantMap[sidebar.status.variant] || ''
                  )}
                >
                  {sidebar.status.label}
                </Badge>
              )}
            </div>

            {/* Stats */}
            {sidebar.stats && sidebar.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {sidebar.stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                  >
                    <stat.icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-heading">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-border/50 my-4" />

            {/* Details */}
            <div className="space-y-3">
              {sidebar.details.map((detail, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <span className="text-sm font-medium text-heading text-right max-w-[60%] break-words">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            {sidebar.actions && sidebar.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {sidebar.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    size="sm"
                    onClick={action.onClick}
                    className="flex-1 min-w-[80px]"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Card */}
        {secondaryCard}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <Tabs value={activeTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-card border border-border/50 rounded-xl mb-6 flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => navigate(tab.href)}
                className={cn(
                  "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "px-4 py-2 rounded-lg transition-all"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
