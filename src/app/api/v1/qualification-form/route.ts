import { NextRequest, NextResponse } from "next/server";
import { getQualificationForm } from "@/actions/qualification-form/get.action";
export async function GET(req: NextRequest) {
  const res = await getQualificationForm();

  return NextResponse.json(res.data);
}
