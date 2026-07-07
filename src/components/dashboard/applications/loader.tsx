import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationStatusCardSkeleton() {
  return (
    <Card className="w-full rounded-xl border bg-white/20 shadow-sm p-0!">
      <CardContent className="p-0!">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          {/* Left Section */}
          <div className="p-4">
            <Skeleton className="h-5 w-64" />

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Application No */}
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Last Modified */}
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Action */}
              <div>
                <Skeleton className="h-4 w-16 mb-3" />
                <Skeleton className="h-6 w-44" />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="border-t bg-gray-50 p-4 lg:border-l lg:border-t-0">
            <Skeleton className="h-6 w-40" />

            <div className="mt-5 space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-6 w-48 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
