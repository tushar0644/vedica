"use server";

import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();

  const sid = cookieStore.get("sid")?.value;
  const user = cookieStore.get("user_id")?.value;
  const fullName = cookieStore.get("full_name")?.value;
  const systemUser = cookieStore.get("system_user")?.value;
  const userLang = cookieStore.get("user_lang")?.value;

  return {
    authenticated: Boolean(sid && user),

    sid,
    user, // email
    fullName,
    systemUser,
    userLang,
  };
}

export async function getBackendCookieHeader() {
  const cookieStore = await cookies();

  const cookieNames = [
    "sid",
    "full_name",
    "user_id",
    "user_lang",
    "system_user",
  ];

  const cookieHeader = cookieNames
    .map((name) => {
      const value = cookieStore.get(name)?.value;

      return value ? `${name}=${value}` : null;
    })
    .filter(Boolean)
    .join("; ");

  return cookieHeader;
}
