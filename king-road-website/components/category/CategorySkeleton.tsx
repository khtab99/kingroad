"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface CategorySkeletonProps {
  count?: number;
  variant?: "grid" | "list" | "navigation";
}

export function CategorySkeleton({ count = 6, variant = "grid" }: CategorySkeletonProps) {
  if (variant === "navigation") {
    return (
      <div className="flex items-center justify-center gap-8 py-6 overflow-x-auto">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 min-w-0">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}