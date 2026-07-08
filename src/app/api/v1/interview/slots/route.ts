import { NextRequest, NextResponse } from "next/server";
import { getSlotsForDate } from "../db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { success: false, message: "Date parameter is required" },
        { status: 400 }
      );
    }

    const slots = await getSlotsForDate(dateStr);

    return NextResponse.json({
      success: true,
      slots,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
