"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  try {
    const cookieStore = await cookies();

    for (const cookie of cookieStore.getAll()) {
      cookieStore.delete(cookie.name);
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (err) {
    console.error("[LOGOUT][ERROR]", err);

    return {
      success: false,
      message: "Failed to logout",
    };
  }
};
