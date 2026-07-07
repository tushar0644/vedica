"use server";
import axios from "axios";
import { getCurrentUser } from "../profile/get-profile";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const createQuery = async (data: any) => {
  try {
    const res = await getCurrentUser();

    if (!res.user)
      return {
        success: false,
        message: "Failed to create query",
      };

    const cookieHeader = await getBackendCookieHeader();
    const formData = new FormData();
    formData.append("web_form", "lead-query");
    formData.append("data", JSON.stringify({ ...data, status: "Open" }));
    // console.log("[QUERY][CREATE][PAYLOAD]", data);
    const response = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      },
    );
    // console.log("[QUERY][CREATE]", response.data);
    return {
      success: true,
      message: "New query created",
      id: response.data.message.name,
    };
  } catch (err: any) {
    console.error("[QUERY][CREATE][ERROR]", err);
    return {
      success: false,
      message: "Failed to create a query",
    };
  }
};
