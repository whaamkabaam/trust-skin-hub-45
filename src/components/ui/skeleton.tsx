import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function OperatorCardSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-[60px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[80%]" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-[60px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  )
}

function OperatorListSkeleton({ count = 6, view = 'grid' }: { count?: number; view?: 'grid' | 'list' }) {
  return (
    <div className={cn(
      "gap-6",
      view === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
        : "flex flex-col space-y-4"
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <OperatorCardSkeleton key={i} view={view} />
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
          <div className="flex space-x-2 ml-auto">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton, OperatorCardSkeleton, OperatorListSkeleton, TableSkeleton }
