import { NextRequest, NextResponse } from "next/server";
import { listApplicationForms } from "@/actions/application-forms/list.action";
export async function GET(req: NextRequest) {
  const res = await listApplicationForms();
  return NextResponse.json(res);
}
