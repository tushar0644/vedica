"use server";
import axios from "axios";
import { getFrappeError } from "@/utils";

const BASE_URL = process.env.BACKEND_URL!;

export const register = async (data: {
  custom_salutationss: string;
  first_name: string;
  last_name: string;
  custom_mobile_nos: string;
  email: string;
  custom_select_course: string;
  custom_select_city: string;
  custom_select_state: string;
  custom_select_current_total_work_experience: string;
  custom_emailss: string;
}) => {
  try {
    const formData = new FormData();

    formData.append("web_form", "lead-capture");
    formData.append("data", JSON.stringify(data));
    const response = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        withCredentials: true,
        headers: {
          Authorization: process.env.AUTHORIZATION,
        },
      },
    );
    console.log(response.data);
    return {
      success: true,
      message:
        // response.data.message ??
        "Verification Link has been sent to your email",
    };
  } catch (err: any) {
    console.error("[REGISTER][ERROR]", err?.response?.data || err);
    const rawError = getFrappeError(err, "Failed to register user");
    
    let cleanMessage = rawError;
    const lowerError = rawError.toLowerCase();
    
    if (
      lowerError.includes("email") && 
      (lowerError.includes("exists") || lowerError.includes("unique") || lowerError.includes("duplicate"))
    ) {
      cleanMessage = "An account with this email address already exists.";
    } else if (
      (lowerError.includes("mobile") || lowerError.includes("phone")) && 
      (lowerError.includes("exists") || lowerError.includes("unique") || lowerError.includes("duplicate"))
    ) {
      cleanMessage = "An account with this mobile number already exists.";
    } else if (lowerError.includes("already exists") || lowerError.includes("duplicate")) {
      cleanMessage = "An account with these details already exists.";
    }

    return {
      success: false,
      message: cleanMessage,
    };
  }
};

