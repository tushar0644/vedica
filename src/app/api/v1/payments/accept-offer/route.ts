import { NextRequest, NextResponse } from "next/server";
import { acceptOfferLetter } from "@/actions/payments/payments.action";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await acceptOfferLetter(body.application);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
