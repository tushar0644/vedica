import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/actions/auth/get-auth";
import { getActiveBooking } from "../db";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuth();
    const email = user || "candidate@example.com";

    const booking = await getActiveBooking(email);

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch status" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
