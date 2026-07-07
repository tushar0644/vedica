import { NextRequest, NextResponse } from "next/server";
import { getQualificationFormDocType } from "@/actions/qualification-form/doctype.action";
export async function GET(req: NextRequest) {
  const res = await getQualificationFormDocType();
  return NextResponse.json(res);
}
