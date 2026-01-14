import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarCellProps {
  name: string;
  subtitle?: string;
  imageUrl?: string | null;
  className?: string;
}

const stateColors = [
  "bg-primary/20 text-primary",
  "bg-success/20 text-success",
  "bg-destructive/20 text-destructive",
  "bg-warning/20 text-warning",
  "bg-info/20 text-info",
  "bg-secondary/20 text-secondary",
];

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getRandomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return stateColors[Math.abs(hash) % stateColors.length];
}

export function AvatarCell({ name, subtitle, imageUrl, className }: AvatarCellProps) {
  const initials = getInitials(name);
  const colorClass = getRandomColor(name);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium",
              colorClass
            )}
          >
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-heading truncate">{name}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
