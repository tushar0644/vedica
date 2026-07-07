import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/actions/payments/payments.action";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await verifyRazorpayPayment(body);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
