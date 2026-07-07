import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/profile/get-profile";
export async function GET(req: NextRequest) {
  const res = await getCurrentUser();

  return NextResponse.json(res);
}
