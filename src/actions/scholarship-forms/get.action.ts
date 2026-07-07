"use server";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const getScholarshipForm = async ({
  scholarshipId,
}: {
  scholarshipId: string;
}) => {
  try {
    const cookies = await getBackendCookieHeader();

    const response = await axios.get(
      `${BASE_URL}/api/resource/Scholarship/${scholarshipId}`,
      {
        headers: {
          Cookie: cookies,
        },
      },
    );
    return {
      data: response.data.data,
      success: true,
      message: response.data.message || "Scholarship form data",
    };
  } catch (err: any) {
    console.error("[SCHOLARSHIP FORM][GET][ERROR]", err.response.data);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request scholarship form doctype",
    };
  }
};
