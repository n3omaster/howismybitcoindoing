"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-8">
      {/* Hero P&L skeleton */}
      <Card>
        <CardContent className="flex flex-col items-center py-10">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-14 w-72 mb-2" />
          <Skeleton className="h-6 w-40" />
        </CardContent>
      </Card>

      {/* Balance cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-36 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction table skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
