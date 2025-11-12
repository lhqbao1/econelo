import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGridSkeletonProps {
  length?: number;
  col?: number; // số cột trên màn hình lớn (md+)
  mobileCol?: number; // số cột trên mobile
  width?: string;
}

export function ProductGridSkeleton({
  length = 4,
  col = 4,
  mobileCol = 2,
  width = "3/4",
}: ProductGridSkeletonProps) {
  // Tạo class tailwind động cho grid-cols
  const gridClass = `grid grid-cols-${mobileCol} sm:grid-cols-${col} gap-4 sm:mt-6 mt-4 w-${width}`;

  return (
    <div className={gridClass}>
      {Array.from({ length }).map((_, idx) => (
        <Card
          key={idx}
          className="relative overflow-hidden border-0 rounded-none shadow-none"
        >
          <CardContent className="bg-white p-0 py-4 flex flex-col items-center">
            {/* Ảnh giả */}
            <Skeleton className="w-full h-48 mb-2 rounded" />

            <div className="product-details py-2 mt-0 md:mt-5 xl:mt-8 flex flex-col gap-2 w-full">
              {/* Tên sản phẩm */}
              <Skeleton className="h-6 w-3/4 mx-auto" />
              {/* Giá */}
              <div className="flex justify-center gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
