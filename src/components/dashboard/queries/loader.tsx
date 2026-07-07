import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QueryCardSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Query Id */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-18" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="border-t pt-2 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
