"use server";
import axios from "axios";

const BASE_URL = process.env.BACKEND_URL!;

export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/method/reset_password?token=${token}&newPassword=${newPassword}`,
    );

    return {
      success: true,
      message:
        response.data.message || "Password has been updated successfully",
    };
  } catch (err: any) {
    console.error("[RESET PASSWORD][ERROR]", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || "Failed to request password change",
    };
  }
};

// _server_messages: '["{\\"message\\":\\"<div>This is a top-10 common password.</div><ul><li>All-uppercase is almost as easy to guess as all-lowercase.</li></ul>\\",\\"as_table\\":false,\\"title\\":\\"Password requirements not met\\",\\"indicator\\":\\"red\\",\\"raise_exception\\":1,\\"__frappe_exc_id\\":\\"b17b27f83e590b945b28e2109de8797e5b6e8c14feb449ef43c3315a\\"}"]';
