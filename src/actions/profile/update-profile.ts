"use server";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const updateUser = async (data: any) => {
  try {
    const { authenticated } = await getAuth();
    const cookies = await getBackendCookieHeader();
    if (!authenticated) {
      console.warn("[UPDATE PROFILE][WARN] Unauthorised request made");
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // {"first_name":"Riya","last_name":"Sharma","custom_emailss":"riya@example.com","custom_mobile_nos":"91-9876543210","custom_select_state":"Maharashtra"}
    // console.log("[UPDATE PROFILE][PAYLOAD]", data);
    const formData = new FormData();
    formData.append("web_form", "lead-update");
    formData.append("data", JSON.stringify(data));
    await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
        },
      },
    );

    return {
      success: true,
      message: "Profile updated",
    };
  } catch (err: any) {
    console.log(err.response.data);
    console.error(
      "[UPDATE PROFILE][ERROR]",
      data,
      JSON.parse(err.response.data._server_messages),
    );
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
};
