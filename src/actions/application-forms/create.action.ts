"use server";
import axios from "axios";
import { getCurrentUser } from "../profile/get-profile";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;
export const createApplicationForm = async () => {
  try {
    const {} = await getAuth();
    const res = await getCurrentUser();

    if (!res.user)
      return {
        success: false,
        message: "Failed to create application form",
      };
    const { user } = res;
    // console.log(user);

    const cookieHeader = await getBackendCookieHeader();

    const response = await axios.post(
      `${BASE_URL}/api/resource/Application`,
      {
        crm_lead: user?.name,
      },
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      },
    );
    // console.info("[APPLICATION FORM][CREATE]", response.data);
    return {
      success: true,
      message: response.data.message || "New application form created",
      id: response.data.data.name,
    };
  } catch (err: any) {
    console.error("[APPLICATION FORM][CREATE][ERROR]", err.response.data);
    return {
      success: false,
      message: "Failed to create an application form",
    };
  }
};
