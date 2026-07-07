"use server";
import axios from "axios";
import { getFrappeError } from "@/utils";
import { getBackendCookieHeader } from "@/actions/auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const uploadFile = async (formData: FormData) => {
  try {
    const cookieHeader = await getBackendCookieHeader();

    const response = await axios.post(
      `${BASE_URL}/api/method/upload_file`,
      formData,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION,
          Cookie: cookieHeader,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );

    return {
      url: (response.data.message.file_url ?? "") as string,
      success: true,
      message: "File uploaded successfully",
    };
  } catch (err: any) {
    console.error("[UPLOAD][ERROR]", err.response?.data);

    return {
      success: false,
      message: getFrappeError(err, "File upload failed"),
    };
  }
};
