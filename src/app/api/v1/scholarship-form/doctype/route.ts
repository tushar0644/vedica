import { NextRequest, NextResponse } from "next/server";
import { getScholarshipFormDocType } from "@/actions/scholarship-forms/doctype.action";
export async function GET(req: NextRequest) {
  const res = await getScholarshipFormDocType();
  return NextResponse.json(res);
}
