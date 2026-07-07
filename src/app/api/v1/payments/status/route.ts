import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/actions/payments/payments.action";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const application = searchParams.get("application") || "";
    const res = await getPaymentStatus(application);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
