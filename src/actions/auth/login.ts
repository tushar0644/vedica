"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.BACKEND_URL!;

export const login = async (usr: string, pwd: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/method/login`,
      {
        usr,
        pwd,
      },
      {
        withCredentials: true,
      },
    );

    const cookieStore = await cookies();

    // Get cookies returned by Frappe
    const setCookies = response.headers["set-cookie"];

    // console.log(setCookies);

    if (setCookies) {
      for (const cookie of setCookies) {
        const [nameValue] = cookie.split(";");
        const [name, value] = nameValue.split("=");

        cookieStore.set({
          name,
          value,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
    }

    return {
      success: true,
      message: "Login Successful",
    };
  } catch (err: any) {
    console.error("[LOGIN][ERROR]", err.response?.data || err);

    return {
      success: false,
      message: err?.response?.data?.message || "Invalid credentials",
    };
  }
};
