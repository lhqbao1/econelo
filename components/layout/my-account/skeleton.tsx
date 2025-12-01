"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MyAccountSkeleton() {
  return (
    <div className="flex justify-center bg-gray-50 lg:pt-[100px] pt-[70px]">
      <div className="flex flex-row gap-6 items-start md:py-12 lg:py-18 py-8 min-h-screen lg:w-9/12 w-11/12">
        {/* Sidebar skeleton */}
        <div className="w-64 bg-white p-6 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.1)] space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <main className="flex-1">
          <div className="p-6 bg-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.1)] space-y-6">
            <Skeleton className="h-6 w-40 mb-6" /> {/* section heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
