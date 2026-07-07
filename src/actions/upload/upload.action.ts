"use server";
import axios from "axios";

const BASE_URL = process.env.BACKEND_URL!;

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/api/method/upload_file`,
      formData,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION,
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
      message:
        JSON.parse(err.response?.data?._server_messages ?? "[]")[0]?.message ||
        err?.response?.data?.message ||
        "File upload failed",
    };
  }
};
