import { NextRequest, NextResponse } from "next/server";
import { getDynamicSchedule } from "../db";

export async function GET(req: NextRequest) {
  try {
    const dates = await getDynamicSchedule();
    return NextResponse.json({
      success: true,
      dates,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch dates" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
