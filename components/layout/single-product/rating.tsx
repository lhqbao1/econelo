"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewResponse } from "@/types/review";
import { Star } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface ProductRatingProps {
  reviews?: ReviewResponse[] | null;
}

interface ProductReviewContentProps {
  reviews?: ReviewResponse[] | null;
  containerClassName?: string;
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;
const REVIEWS_PAGE_SIZE = 5;

function normalizeRating(value: number | null | undefined) {
  const safeValue = Number(value ?? 0);
  if (!Number.isFinite(safeValue)) return 0;
  return Math.max(0, Math.min(5, safeValue));
}

function getReviewerName(review: ReviewResponse) {
  const fullName = [review.user?.first_name ?? "", review.user?.last_name ?? ""]
    .join(" ")
    .trim();

  if (fullName.length > 0) return fullName;
  if (review.customer && review.customer.trim().length > 0) {
    return review.customer.trim();
  }

  return "Anonymous";
}

export function ProductReviewContent({
  reviews,
  containerClassName = "",
}: ProductReviewContentProps) {
  const t = useTranslations();
  const reviewList = Array.isArray(reviews) ? reviews : [];
  const [selectedRate, setSelectedRate] = useState<number | undefined>();
  const [visibleReviewCount, setVisibleReviewCount] =
    useState(REVIEWS_PAGE_SIZE);
  const [animatedFromIndex, setAnimatedFromIndex] = useState<number | null>(
    null,
  );
  const [reviewListMaxHeight, setReviewListMaxHeight] = useState<number>();
  const reviewListRef = useRef<HTMLDivElement>(null);

  const total = reviewList.length;

  const ratingsByLevel = useMemo(
    () =>
      STAR_LEVELS.map((level) => {
        const count = reviewList.filter(
          (item) => Math.round(normalizeRating(item.rating)) === level,
        ).length;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        return {
          level,
          count,
          percent,
        };
      }),
    [reviewList, total],
  );

  const filteredReviews = useMemo(() => {
    if (!selectedRate) return reviewList;

    return reviewList.filter(
      (item) => Math.round(normalizeRating(item.rating)) === selectedRate,
    );
  }, [reviewList, selectedRate]);

  const visibleReviews = filteredReviews.slice(0, visibleReviewCount);
  const remainingReviews = Math.max(
    filteredReviews.length - visibleReviewCount,
    0,
  );
  const nextReviewCount = Math.min(REVIEWS_PAGE_SIZE, remainingReviews);

  useLayoutEffect(() => {
    const reviewListElement = reviewListRef.current;

    if (!reviewListElement) return;

    setReviewListMaxHeight(reviewListElement.scrollHeight);
  }, [visibleReviews.length, selectedRate]);

  useEffect(() => {
    setAnimatedFromIndex(null);
    setVisibleReviewCount(REVIEWS_PAGE_SIZE);
  }, [reviewList.length]);

  const handleShowMoreReviews = () => {
    setAnimatedFromIndex(visibleReviewCount);
    setVisibleReviewCount((current) =>
      Math.min(current + REVIEWS_PAGE_SIZE, filteredReviews.length),
    );
  };

  const resetVisibleReviews = () => {
    setAnimatedFromIndex(null);
    setVisibleReviewCount(REVIEWS_PAGE_SIZE);
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 ${containerClassName}`.trim()}
    >
      <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 space-y-4 overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            resetVisibleReviews();
            setSelectedRate(undefined);
          }}
          className={`w-full text-left rounded-md border px-3 py-2 transition-colors cursor-pointer ${
            selectedRate === undefined
              ? "border-primary text-primary"
              : "border-gray-200 text-gray-600"
          }`}
        >
          {t("all")} ({total})
        </button>

        <div className="space-y-2">
          {ratingsByLevel.map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => {
                resetVisibleReviews();
                setSelectedRate((prev) =>
                  prev === item.level ? undefined : item.level,
                );
              }}
              className={`w-full rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                selectedRate === item.level
                  ? "border-primary text-primary"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <span>{item.level}</span>
                  <Star
                    className="h-4 w-4"
                    fill={selectedRate === item.level ? "#f15a24" : "none"}
                    stroke="#f15a24"
                  />
                </div>

                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <span className="w-12 text-right text-xs">{item.percent}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-8 p-4 md:p-6 space-y-4 overflow-y-auto pointer-events-auto select-text">
        {filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500">Noch keine Bewertungen.</p>
        ) : (
          <>
            <div
              className="overflow-hidden transition-[max-height] duration-500 ease-out motion-reduce:transition-none"
              style={
                reviewListMaxHeight
                  ? { maxHeight: `${reviewListMaxHeight}px` }
                  : undefined
              }
            >
              <div ref={reviewListRef} className="space-y-4">
                {visibleReviews.map((review, index) => {
                  const ratingValue = normalizeRating(review.rating);
                  const roundedRating = Math.round(ratingValue);
                  const displayDate = new Date(review.created_at);
                  const reviewerName = getReviewerName(review);
                  const shouldAnimateCard =
                    animatedFromIndex !== null && index >= animatedFromIndex;

                  return (
                    <article
                      key={review.id}
                      className={`rounded-lg border border-gray-200 p-4 space-y-3 ${
                        shouldAnimateCard
                          ? "animate-in fade-in-0 slide-in-from-bottom-1 duration-500"
                          : ""
                      }`}
                      style={
                        shouldAnimateCard
                          ? {
                              animationDelay: `${
                                Math.min(index - animatedFromIndex, 4) * 45
                              }ms`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {reviewerName}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className="h-4 w-4"
                                fill={
                                  index < roundedRating ? "#f15a24" : "none"
                                }
                                stroke="#f15a24"
                              />
                            ))}
                            <span className="ml-1 text-sm font-medium">
                              {ratingValue.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs text-gray-500">
                          {Number.isNaN(displayDate.getTime())
                            ? ""
                            : displayDate.toLocaleDateString("de-DE")}
                        </span>
                      </div>

                      {review.comment ? (
                        <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap break-words select-text">
                          {review.comment}
                        </p>
                      ) : null}

                      {Array.isArray(review.static_files) &&
                      review.static_files.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {review.static_files.map((imageUrl, index) => (
                            <img
                              key={`${review.id}-${index}`}
                              src={imageUrl}
                              alt={`review-image-${index + 1}`}
                              className="h-24 w-full rounded-md object-cover border"
                            />
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>

            {remainingReviews > 0 && (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-primary/40 px-5 text-primary hover:bg-primary hover:text-white"
                  onClick={handleShowMoreReviews}
                >
                  {t("showMore")}
                  {nextReviewCount > 0 ? ` (${nextReviewCount})` : ""}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductRating({ reviews }: ProductRatingProps) {
  const t = useTranslations();
  const reviewList = Array.isArray(reviews) ? reviews : [];

  const averageValue =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + normalizeRating(r?.rating), 0) /
        reviewList.length
      : 0;
  const average = averageValue.toFixed(2);

  const total = reviewList.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 border px-3 py-2 rounded-full w-fit shadow-[0_0_3px_rgba(0,0,0,0.1)] cursor-pointer">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <div className="space-x-1">
            <span className="font-semibold">{average}</span>
            <span className="text-gray-500 text-sm">
              ({total} {t("reviews")})
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="h-[70vh] w-[70vw] max-w-[70vw] overflow-hidden p-0 pointer-events-auto">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl text-primary font-bold">
            {t("review")}
          </DialogTitle>
        </DialogHeader>
        <ProductReviewContent
          reviews={reviewList}
          containerClassName="h-[calc(70vh-84px)]"
        />
      </DialogContent>
    </Dialog>
  );
}
