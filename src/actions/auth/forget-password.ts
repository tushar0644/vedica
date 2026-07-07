"use server";
import axios from "axios";
import { getFrappeError } from "@/utils";

const BASE_URL = process.env.BACKEND_URL!;

export const forgetPassword = async ({
  email,
  redirectUrl,
}: {
  email: string;
  redirectUrl: string;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/method/forgot_password`,
      {
        email,
        redirectUrl,
      },
    );

    return {
      success: true,
      message:
        response.data.message ||
        "Reset Password Link has been sent to your email",
    };
  } catch (err: any) {
    console.error("[FORGET PASSWORD][ERROR]", err);
    return {
      success: false,
      message: getFrappeError(err, "Failed to request password change"),
    };
  }
};

