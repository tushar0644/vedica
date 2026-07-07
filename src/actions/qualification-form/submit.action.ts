"use server";

import axios from "axios";
import { getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const submitQualificationForm = async ({
  payload,
  id,
  prev,
}: {
  prev: any;
  payload: any;
  id: string;
}) => {
  try {
    console.log("========== QUALIFICATION FORM SUBMISSION ==========");
    console.log("Application ID:", id);
    console.log("Incoming Payload:");
    console.dir(payload, { depth: null });

    const cookieHeader = await getBackendCookieHeader();

    const academicDetailsId = payload?.name || prev?.academic_details;

    const firstPayload = {
      ...payload,
      name: academicDetailsId || undefined,
    };

    // First API call
    const formData = new FormData();
    formData.append("web_form", "academic-details");
    formData.append("data", JSON.stringify(firstPayload));

    console.log("Creating academic details document...");

    const createRes = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData,
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      },
    );

    console.log("Create API Response:");
    console.dir(createRes.data, { depth: null });

    const academicId = createRes.data?.message?.name;

    console.log("Academic Details ID:", academicId);

    if (!academicId) {
      throw new Error(
        "Academic document was created but no name/id was returned.",
      );
    }

    // Second API call
    const updatedPayload = {
      ...payload,
      name: academicId,
    };

    console.log("Updating academic details with payload:");
    console.dir(updatedPayload, { depth: null });

    const formData2 = new FormData();
    formData2.append("web_form", "academic-details");
    formData2.append("data", JSON.stringify(updatedPayload));

    const updateRes = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData2,
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      },
    );

    console.log("Update API Response:");
    console.dir(updateRes.data, { depth: null });

    console.log("========== SUBMISSION SUCCESS ==========");

    console.log("========== LINKING APPLICATION ==========");
    console.log("Application ID:", id);
    console.log("Academic ID:", academicId);

    const {
      name: _ignoredName,
      academic_details: _ignoredAcademicDetails,
      ...filteredPrev
    } = prev || {};

    const payload2 = {
      ...filteredPrev,
      name: id,
      academic_details: academicId,
    };
    console.log("Application Update Payload:");
    console.dir(payload2, { depth: null });

    const formData3 = new FormData();
    formData3.append("web_form", "application-form");
    formData3.append("data", JSON.stringify(payload2));

    const applicationUpdateRes = await axios.post(
      `${BASE_URL}/api/method/frappe.website.doctype.web_form.web_form.accept`,
      formData3,
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      },
    );

    console.log("Application Update Response:");
    console.dir(applicationUpdateRes.data, { depth: null });

    return {
      success: true,
      message: "Form updated successfully",
      academicId,
    };
  } catch (err: any) {
    console.error("========== QUALIFICATION FORM ERROR ==========");

    if (axios.isAxiosError(err)) {
      console.error("Axios Error Message:", err.message);
      console.error("Status:", err.response?.status);
      console.error("Status Text:", err.response?.statusText);

      console.error("Response Data:");
      console.dir(err.response?.data, { depth: null });

      console.error("Request URL:", err.config?.url);
      console.error("Request Method:", err.config?.method);
      console.error("Request Data:", err.config?.data);
    } else {
      console.error("Unexpected Error:");
      console.error(err);
    }

    console.error("==============================================");

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err?.response?.data?.exc ||
        err?.message ||
        "Failed to submit qualification form",
    };
  }
};
