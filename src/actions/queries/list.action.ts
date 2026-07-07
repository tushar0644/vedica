"use server";
import axios from "axios";
import { getBackendCookieHeader } from "../auth/get-auth";
import { Query } from "@/types/query";

const BASE_URL = process.env.BACKEND_URL!;
export const listQueries = async () => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.get(
      `${BASE_URL}/api/method/get_raised_form_data`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );
    // console.log("[QUERY][LIST]", response.data.message.docs);
    return {
      queries: response.data.message.docs as Query[],
      success: true,
      message: "List application form",
    };
  } catch (err: any) {
    console.error("[QUERY][LIST][ERROR]", err);
    return {
      success: false,
      forms: [],
      message:
        err?.response?.data?.message || "Failed to request listing queries",
    };
  }
};
