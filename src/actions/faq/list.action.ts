"use server";
import axios from "axios";
import { getBackendCookieHeader } from "../auth/get-auth";
import { FAQ } from "@/types/faq";

const BASE_URL = process.env.BACKEND_URL!;
export const listFAQs = async (category?: string) => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.get(
      `${BASE_URL}/api/method/get-faqs-by-category`,
      {
        params: category ? { category } : undefined,
        headers: {
          Cookie: cookie,
        },
      },
    );
    return {
      faq: response.data.message as FAQ[],
      success: true,
      message: "List FAQ",
    };
  } catch (err: any) {
    // console.log(err);
    return {
      success: false,
      faq: [],
      message: err?.response?.data?.message || "Failed to request FAQ",
    };
  }
};
