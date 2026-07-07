"use server";

import axios from "axios";
import { getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const submitApplicationForm = async ({ id }: { id: string }) => {
  try {
    console.log("\n========== APPLICATION SUBMISSION START ==========");
    console.log("[STEP 1] Application ID:", id);

    const cookie = await getBackendCookieHeader();

    console.log("[STEP 2] Fetching academic form data...");

    const academicForm = await axios.get(
      `${BASE_URL}/api/method/get_academic_form_data`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );

    console.log("[STEP 2][SUCCESS] Academic form fetched");
    console.dir(academicForm.data, { depth: null });

    const academicDoc = academicForm.data?.message?.doc;

    if (!academicDoc?.name) {
      throw new Error(
        "Academic form data fetched successfully but no document name was returned.",
      );
    }

    console.log("[STEP 3] Linking Academic Document:", academicDoc.name);

    const payload = {
      academic_details: academicDoc.name,
    };

    console.log("[STEP 3] Payload:");
    console.dir(payload, { depth: null });

    const formData = new FormData();
    formData.append("web_form", "application-form");
    formData.append("data", JSON.stringify(payload));

    const addAcademicDetails = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );

    console.log("[STEP 3][SUCCESS] Academic details linked");
    console.dir(addAcademicDetails.data, { depth: null });

    console.log("[STEP 4] Submitting application:", id);

    const response = await axios.put(
      `${BASE_URL}/api/method/submit_admission`,
      {
        name: id,
      },
      {
        headers: {
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );

    console.log("[STEP 4][SUCCESS] Application submitted");
    console.dir(response.data, { depth: null });

    console.log("========== APPLICATION SUBMISSION SUCCESS ==========\n");

    return {
      success: true,
      message: "Application submitted successfully",
      id,
    };
  } catch (err: any) {
    console.error("\n========== APPLICATION SUBMISSION ERROR ==========");

    if (axios.isAxiosError(err)) {
      console.error("Axios Error Message:", err.message);
      console.error("Status:", err.response?.status);
      console.error("Status Text:", err.response?.statusText);

      console.error("Request:");
      console.log("URL:", err.config?.url);
      console.log("Method:", err.config?.method);

      console.error("Response Data:");
      console.dir(err.response?.data, { depth: null });

      if (err.response?.data?._server_messages) {
        console.error(
          "Frappe Server Messages:",
          err.response.data._server_messages,
        );
      }

      if (err.response?.data?.exc) {
        console.error("Frappe Exception:");
        console.error(err.response.data.exc);
      }
    } else {
      console.error("Unexpected Error:");
      console.error(err);
    }

    console.error("========== APPLICATION SUBMISSION FAILED ==========\n");

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit application form",
    };
  }
};
