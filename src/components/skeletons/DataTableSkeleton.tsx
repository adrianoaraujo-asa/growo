import { cn } from "@/lib/utils";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
}

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
  showToolbar = true,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="card-3d bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Toolbar Skeleton */}
      {showToolbar && (
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            {/* Title skeleton */}
            <div className="skeleton-3d-shimmer h-6 w-32 rounded-lg" />
            {/* Badge skeleton */}
            <div className="skeleton-3d-shimmer h-5 w-12 rounded-full" />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search input skeleton */}
            <div className="relative">
              <div className="skeleton-3d-shimmer h-10 w-64 rounded-lg" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="skeleton-3d-pulse h-4 w-4 rounded-md bg-muted-foreground/10" />
              </div>
            </div>
            
            {/* Add button skeleton */}
            <div className="skeleton-3d-shimmer h-10 w-28 rounded-lg" />
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      <div className="relative overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="h-12 px-4 text-left">
                  <div 
                    className="skeleton-3d-shimmer h-3 rounded-md"
                    style={{ 
                      width: `${Math.random() * 40 + 60}%`,
                      animationDelay: `${i * 50}ms`
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn(
                  "border-b border-border/40",
                  rowIndex % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                )}
                style={{ animationDelay: `${rowIndex * 75}ms` }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3.5">
                    <TableCellSkeleton 
                      type={getSkeletonType(colIndex)} 
                      delay={colIndex * 30 + rowIndex * 50}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/10">
          <div className="skeleton-3d-shimmer h-4 w-48 rounded-md" />
          
          <div className="flex items-center gap-2">
            {/* Pagination buttons */}
            <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" />
            <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" />
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "skeleton-3d-shimmer h-8 w-8 rounded-lg",
                    i === 0 && "skeleton-3d-active"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" />
            <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="skeleton-3d-shimmer h-4 w-20 rounded-md" />
            <div className="skeleton-3d-shimmer h-8 w-16 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

type SkeletonType = 'text' | 'avatar' | 'badge' | 'action' | 'long';

function getSkeletonType(colIndex: number): SkeletonType {
  // First column often has avatar/icon + text
  if (colIndex === 0) return 'avatar';
  // Last column often has actions
  if (colIndex === 4) return 'action';
  // Randomly assign other types
  const types: SkeletonType[] = ['text', 'badge', 'long'];
  return types[colIndex % types.length];
}

interface TableCellSkeletonProps {
  type: SkeletonType;
  delay?: number;
}

function TableCellSkeleton({ type, delay = 0 }: TableCellSkeletonProps) {
  const style = { animationDelay: `${delay}ms` };

  switch (type) {
    case 'avatar':
      return (
        <div className="flex items-center gap-3">
          <div 
            className="skeleton-3d-pulse h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5"
            style={style}
          />
          <div className="space-y-2">
            <div className="skeleton-3d-shimmer h-4 w-24 rounded-md" style={style} />
            <div className="skeleton-3d-shimmer h-3 w-32 rounded-md opacity-60" style={style} />
          </div>
        </div>
      );
    
    case 'badge':
      return (
        <div 
          className="skeleton-3d-shimmer h-6 w-16 rounded-full"
          style={style}
        />
      );
    
    case 'action':
      return (
        <div className="flex items-center gap-2 justify-end">
          <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" style={style} />
          <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" style={{ ...style, animationDelay: `${delay + 50}ms` }} />
          <div className="skeleton-3d-shimmer h-8 w-8 rounded-lg" style={{ ...style, animationDelay: `${delay + 100}ms` }} />
        </div>
      );
    
    case 'long':
      return (
        <div className="space-y-1.5">
          <div className="skeleton-3d-shimmer h-3.5 w-full max-w-[180px] rounded-md" style={style} />
          <div className="skeleton-3d-shimmer h-3 w-3/4 max-w-[140px] rounded-md opacity-60" style={style} />
        </div>
      );
    
    case 'text':
    default:
      return (
        <div 
          className="skeleton-3d-shimmer h-4 rounded-md"
          style={{ 
            width: `${Math.random() * 30 + 50}%`,
            minWidth: '60px',
            maxWidth: '120px',
            ...style
          }}
        />
      );
  }
}

// Compact variant for smaller tables
export function DataTableSkeletonCompact({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/30 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="skeleton-3d-pulse h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-3d-shimmer h-4 w-1/3 rounded-md" />
            <div className="skeleton-3d-shimmer h-3 w-1/2 rounded-md opacity-60" />
          </div>
          <div className="skeleton-3d-shimmer h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
