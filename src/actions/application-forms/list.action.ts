"use server";
import { ApplicationFormView } from "@/types/application-form";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";
import { cookies } from "next/headers";

const BASE_URL = process.env.BACKEND_URL!;
export const listApplicationForms = async () => {
  try {
    const { user } = await getAuth();

    if (!user) {
      console.warn("[APPLICATION FORM][LIST][WARN] Unauthorised request made");
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const cookie = await getBackendCookieHeader();
    const response = await axios.get(
      `${BASE_URL}/api/resource/Application?fields=["*"]&filters=[["email_id","=","${user}"]]`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );
    // console.log(response.data.data);
    return {
      forms: response.data.data as ApplicationFormView[],
      success: true,
      message: response.data.message || "List application form",
    };
  } catch (err: any) {
    // console.error("[APPLICATION FORM][LIST][ERROR]", err.response.data);
    const isUnauthorized = err?.response?.status === 401 || err?.response?.status === 403;
    if (isUnauthorized) {
      const cookieStore = await cookies();
      const cookieNames = ["sid", "full_name", "user_id", "user_lang", "system_user", "frappe_sid", "frappe_csrf"];
      cookieNames.forEach((name) => {
        cookieStore.delete(name);
      });
      return {
        success: false,
        forms: [],
        message: "Unauthorized",
      };
    }
    return {
      success: false,
      forms: [],
      message:
        err?.response?.data?.message ||
        "Failed to request application form doctype",
    };
  }
};
