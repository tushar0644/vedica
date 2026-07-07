import { NextRequest, NextResponse } from "next/server";
import { getApplicationFormDocType } from "@/actions/application-forms/doctype.action";
export async function GET(req: NextRequest) {
  const res = await getApplicationFormDocType();
  return NextResponse.json(res);
}
