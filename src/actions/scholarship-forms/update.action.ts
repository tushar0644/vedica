"use server";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const updateScholarshipForm = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  try {
    const cookies = await getBackendCookieHeader();
    const formData = new FormData();
    formData.append("web_form", "scholarship");
    formData.append(
      "data",
      JSON.stringify({
        name: id,
        ...data,
      }),
    );
    const response = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          Cookie: cookies,
        },
        withCredentials: true,
      },
    );

    return {
      success: true,
      message: "Scholarship form submitted successfully",
      id,
      // id: response.data.data.name,
    };
  } catch (err: any) {
    let message = "Failed to update application form";

    console.error("[SCHOLARSHIP FORM][UPDATE][ERROR]", err);
    return {
      success: false,
      message,
    };
  }
};
