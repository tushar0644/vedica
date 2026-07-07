"use server";

import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

const normalizeData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeData);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, normalizeData(value)]),
    );
  }

  return obj === null ? "" : obj;
};

export const getApplicationForm = async ({
  applicationId,
}: {
  applicationId: string;
}) => {
  try {
    await getAuth();

    const cookie = await getBackendCookieHeader();

    const response = await axios.get(
      `${BASE_URL}/api/method/get_application_form_data`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );

    const data = normalizeData(response.data.message.doc);
    // console.log(response.data.message.doc);
    return {
      data,
      success: true,
      message: response.data.message || "Application form data",
    };
  } catch (err: any) {
    console.error("[APPLICATION FORM][GET][ERROR]", err.message);

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request application form doctype",
    };
  }
};
