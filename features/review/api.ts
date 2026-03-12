import { api, apiAdmin } from "@/lib/axios";
import { ReviewFormValues } from "@/lib/schema/review";
import { ReviewResponse } from "@/types/review";

export async function createReview(input: ReviewFormValues) {
  const { data } = await api.post("/review/", input, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
    },
  });
  return data;
}

export const getReviewByProduct = async (product_id: string) => {
  try {
    const { data } = await api.get(`/review/review-product/${product_id}`);
    return Array.isArray(data) ? (data as ReviewResponse[]) : [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getReviewByCustomer = async (customer_id: string) => {
  const { data } = await api.get(`/review/review-customer/${customer_id}`);
  return data as ReviewResponse[];
};

export async function deleteReview(review_id: string) {
  const { data } = await apiAdmin.delete(`/review/${review_id}`);
  return data;
}
