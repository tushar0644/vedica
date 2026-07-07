"use server";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const updateApplicationForm = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  try {
    const cookie = await getBackendCookieHeader();
    const payload = { name: id, ...data };
    const formData = new FormData();
    formData.append("web_form", "application-form");
    formData.append("data", JSON.stringify(payload));
    const response = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );
    // console.log(response.data);

    return {
      success: true,
      message: response.data.message || "Form updated successfully",
      id,
    };
  } catch (err: any) {
    let message = "Failed to update application form";

    // try {
    //   const serverMessages = err.response?.data?._server_messages;
    //   if (serverMessages) {
    //     message = JSON.parse(serverMessages)?.[0]?.message || message;
    //   } else {
    //     message = err?.response?.data?.message || message;
    //   }
    // } catch {
    //   message = err?.response?.data?.message || message;
    // }
    // console.error("[APPLICATION FORM][UPDATE][ERROR]", err.response.data);
    console.log(err);
    return {
      success: false,
      message,
    };
  }
};
