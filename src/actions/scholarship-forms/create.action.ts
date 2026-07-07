"use server";
import axios from "axios";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const upsertScholarshipForm = async (applicationId: string) => {
  try {
    const {} = await getAuth();
    const cookies = await getBackendCookieHeader();

    const response = await axios.get(
      `${BASE_URL}/api/resource/Scholarship?fields=["*"]&filters=[["application_id__vs_id","=","${applicationId}"]]`,
      {
        headers: {
          Cookie: cookies,
        },
      },
    );

    const exist = response.data.data[0]?.name;
    if (exist)
      return {
        success: true,
        message: response.data.message || "Scholarship form existing",
        id: exist,
      };
    console.log("[SCHOLARSHIP FORM][CREATE] New scholarship form created");

    const formData = new FormData();
    formData.append("web_form", "scholarship");
    formData.append(
      "data",
      JSON.stringify({
        application_id__vs_id: applicationId,
      }),
    );
    const res = await axios.post(
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
      message: "New scholarship form created",
      id: res.data.message.name,
    };
  } catch (err: any) {
    console.error("[SCHOLARSHIP FORM][CREATE][ERROR]", err);
    return {
      success: false,
      message: "Failed to request scholarship form doctype",
    };
  }
};
