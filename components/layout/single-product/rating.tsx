import { ReviewResponse } from "@/types/review";
import { Star } from "lucide-react";

interface ProductRatingProps {
  reviews?: ReviewResponse[] | null;
}

export default function ProductRating({ reviews }: ProductRatingProps) {
  const reviewList = Array.isArray(reviews) ? reviews : [];

  const average =
    reviewList.length > 0
      ? (
          reviewList.reduce((sum, r) => sum + (r?.rating ?? 0), 0) /
          reviewList.length
        ).toFixed(2)
      : "0.00";

  const total = reviewList.length;

  return (
    <div className="flex items-center gap-2 border px-3 py-2 rounded-full w-fit shadow-[0_0_3px_rgba(0,0,0,0.1)] cursor-pointer">
      <Star className="w-3 h-3 text-primary fill-primary" />
      <div className="space-x-1">
        <span className="font-semibold">{average}</span>
        <span className="text-gray-500 text-sm">({total} reviews)</span>
      </div>
    </div>
  );
}
