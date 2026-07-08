import { NextRequest, NextResponse } from "next/server";
import { getAuth, getBackendCookieHeader } from "@/actions/auth/get-auth";
import axios from "axios";
import { readDB, writeDB, getActiveBooking, getApplicationId, parseLocalTimeToUTC } from "../db";
import { InterviewBooking } from "@/types/interview";

const BASE_URL = process.env.BACKEND_URL || "https://vedica.origensystems.com";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { date, time, mode, candidateName, applicationNumber, programApplied, phone } = body;

  if (!date || !time || !mode) {
    return NextResponse.json(
      { success: false, message: "Missing date, time, or mode for rescheduling" },
      { status: 400 }
    );
  }

  const { user } = await getAuth();
  const email = user || "candidate@example.com";

  try {
    const cookie = await getBackendCookieHeader();
    const appId = await getApplicationId();
    const activeBooking = await getActiveBooking(email);

    if (cookie && appId && activeBooking) {
      // 1. Cancel previous interview slot on the backend
      try {
        await axios.post(`${BASE_URL}/api/method/cancel_interview_slot`, null, {
          params: {
            interview: activeBooking.referenceNumber,
            reason: "Rescheduled by candidate",
          },
          headers: {
            Cookie: cookie,
            Authorization: process.env.AUTHORIZATION,
          },
        });
      } catch (cancelErr: any) {
        console.warn("[INTERVIEW][RESCHEDULE][CANCEL_PREVIOUS_WARN]", cancelErr.message);
      }

      // 2. Schedule new interview slot on the backend
      const start_time = parseLocalTimeToUTC(date, time);
      const end_time = parseLocalTimeToUTC(date, time, 45);

      const response = await axios.post(`${BASE_URL}/api/method/schedule_interview`, null, {
        params: {
          application: appId,
          date,
          start_time,
          end_time,
          user_timezone_offset: "-330",
        },
        headers: {
          Cookie: cookie,
          Authorization: process.env.AUTHORIZATION,
        },
      });

      const msg = response.data.message;
      if (msg) {
        const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        const referenceNumber = msg.name || `VD-INT-${randSuffix}`;

        const updatedBooking: InterviewBooking = {
          referenceNumber,
          candidateName: candidateName || activeBooking.candidateName,
          applicationNumber: appId,
          programApplied: programApplied || "Vedica Scholars Programme",
          email,
          phone: phone || activeBooking.phone,
          date,
          time,
          timezone: "IST (UTC+5:30)",
          mode,
        };

        // Cache updated booking locally
        const db = await readDB();
        db.bookings[email] = updatedBooking;
        await writeDB(db);

        return NextResponse.json({
          success: true,
          message: "Interview rescheduled successfully",
          booking: updatedBooking,
        });
      }
    }
  } catch (err: any) {
    console.error("[INTERVIEW][RESCHEDULE][BACKEND_ERROR]", err.response?.data || err.message);
    
    const cookie = await getBackendCookieHeader();
    const appId = await getApplicationId();
    if (cookie && appId) {
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
    const existingBooking = db.bookings[email];

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, message: "No active booking found to reschedule." },
        { status: 400 }
      );
    }

    delete db.bookings[email];
    await writeDB(db);

    const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceNumber = `VD-INT-${randSuffix}`;

    const updatedBooking: InterviewBooking = {
      referenceNumber,
      candidateName: candidateName || existingBooking.candidateName,
      applicationNumber: applicationNumber || existingBooking.applicationNumber,
      programApplied: programApplied || existingBooking.programApplied,
      email,
      phone: phone || existingBooking.phone,
      date,
      time,
      timezone: "IST (UTC+5:30)",
      mode,
    };

    db.bookings[email] = updatedBooking;
    await writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Interview rescheduled successfully (Fallback)",
      booking: updatedBooking,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to reschedule interview" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
