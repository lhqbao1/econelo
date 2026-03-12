"use client";

import * as React from "react";
import { AxiosError } from "axios";
import { Image as ImageIcon, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/features/review/hook";
import { useUploadStaticFile } from "@/features/file/hook";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  productId: string;
  userId: string;
  onSubmitted?: () => void;
}

export default function CommentForm({
  productId,
  userId,
  onSubmitted,
}: CommentFormProps) {
  const t = useTranslations();
  const createReviewMutation = useCreateReview();
  const uploadImageMutation = useUploadStaticFile();

  const [rating, setRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedResponses = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("files", file);
          return uploadImageMutation.mutateAsync(formData);
        }),
      );

      const allUploadedUrls = uploadedResponses.flatMap(
        (res) => res?.results?.map((r) => r.url) ?? [],
      );

      setUploadedUrls((prev) => [...prev, ...allUploadedUrls]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    } catch (err) {
      toast.error(t("QAerror"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error(t("reviewRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewMutation.mutateAsync({
        product_id: productId,
        user_id: userId,
        rating,
        comment,
        static_files: uploadedUrls,
      });

      setRating(0);
      setComment("");
      setPreviewUrls([]);
      setUploadedUrls([]);
      onSubmitted?.();
      toast.success(t("submit"));
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 401) {
        toast.error(t("401Error", { text: t("giveReview") }));
      } else {
        toast.error(t("QAerror"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRating(item)}
              className="focus:outline-none"
            >
              <Star
                stroke="#f15a24"
                fill={item <= rating ? "#f15a24" : "none"}
                className="w-6 h-6 cursor-pointer transition-colors duration-150"
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 font-semibold mt-1">
          {t("yourRating")}
        </p>
      </div>

      <Textarea
        rows={4}
        className="h-32"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="w-full">
        <label
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer transition hover:border-orange-400 hover:bg-orange-50",
            isUploading && "opacity-60 pointer-events-none",
          )}
        >
          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 text-orange-500" />
            )}
            <p className="mt-2 text-sm font-medium text-gray-600 text-center px-2">
              {isUploading ? t("uploading") : t("selectOrDrop")}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {previewUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {previewUrls.map((src, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden">
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-24 rounded-xl border"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setComment("");
            setRating(0);
            setPreviewUrls([]);
            setUploadedUrls([]);
          }}
          className="flex-1 text-base font-semibold"
        >
          {t("clear")}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1 text-base font-bold"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : t("submit")}
        </Button>
      </div>
    </div>
  );
}
