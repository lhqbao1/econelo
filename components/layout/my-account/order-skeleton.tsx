// components/layout/my-account/skeletons/orders-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MyAccountOrdersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32 mb-4" /> {/* Title skeleton */}
      {[...Array(3)].map((_, i) => (
        <Card
          key={i}
          className="p-4 flex justify-between items-center rounded-md border-none shadow-sm"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </Card>
      ))}
    </div>
  );
}
