import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function FormCard({ title, description, children, actions, className }: FormCardProps) {
  return (
    <Card className={cn("card-3d", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-heading">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
      {actions && (
        <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border/50">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}
