import { NextRequest, NextResponse } from "next/server";
import { getAuth, getBackendCookieHeader } from "@/actions/auth/get-auth";
import axios from "axios";
import { readDB, writeDB, getActiveBooking } from "../db";

const BASE_URL = process.env.BACKEND_URL || "https://vedica.origensystems.com";

export async function DELETE(req: NextRequest) {
  const { user } = await getAuth();
  const email = user || "candidate@example.com";

  try {
    const cookie = await getBackendCookieHeader();
    const activeBooking = await getActiveBooking(email);

    if (cookie && activeBooking) {
      await axios.post(`${BASE_URL}/api/method/cancel_interview_slot`, null, {
        params: {
          interview: activeBooking.referenceNumber,
          reason: "Cancelled by candidate",
        },
        headers: {
          Cookie: cookie,
          Authorization: process.env.AUTHORIZATION,
        },
      });

      // Clear local cache DB
      const db = await readDB();
      delete db.bookings[email];
      await writeDB(db);

      return NextResponse.json({
        success: true,
        message: "Interview booking cancelled successfully",
      });
    }
  } catch (err: any) {
    console.error("[INTERVIEW][CANCEL][BACKEND_ERROR]", err.response?.data || err.message);

    const cookie = await getBackendCookieHeader();
    if (cookie) {
      const backendError = err.response?.data?.exception || err.response?.data?.message || err.message;
      return NextResponse.json(
        { success: false, message: `Backend Server Error: ${backendError}` },
        { status: err.response?.status || 500 }
      );
    }
  }

  // Graceful Fallback
  try {
    const db = await readDB();

    if (!db.bookings[email]) {
      return NextResponse.json(
        { success: false, message: "No active booking found to cancel." },
        { status: 400 }
      );
    }

    delete db.bookings[email];
    await writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Interview booking cancelled successfully (Fallback)",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to cancel interview" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
