import { User } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { getAuth, getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const getCurrentUser = async () => {
  try {
    const { user, authenticated } = await getAuth();

    if (!authenticated) {
      console.warn("[GET PROFILE][WARN] Unauthorised request made");
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const cookieHeader = await getBackendCookieHeader();

    const response = await axios.get(
      `${BASE_URL}/api/resource/CRM%20Lead?fields=["*"]&filters=[["custom_emailss","=","${user}"]]`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    // console.log(response.data.data[0]);
    return {
      success: true,
      message: "User profile found",
      user: response.data.data[0] as User,
    };
  } catch (err: any) {
    console.error("[GET PROFILE][ERROR]", err.response.data);
    return {
      success: false,
      message: "Profile not found",
    };
  }
};
