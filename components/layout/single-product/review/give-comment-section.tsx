"use client";

import { useTranslations } from "next-intl";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/store/auth";
import CommentForm from "./comment-form";

interface GiveCommentSectionProps {
  productId: string;
}

export default function GiveCommentSection({
  productId,
}: GiveCommentSectionProps) {
  const t = useTranslations();
  const userId = useAtomValue(userIdAtom);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-gray-600 text-lg font-bold">{t("writeReview")}</div>
      <CommentForm productId={productId} userId={userId ?? ""} />
    </div>
  );
}
