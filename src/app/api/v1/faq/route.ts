import { NextRequest, NextResponse } from "next/server";
import { listFAQs } from "@/actions/faq/list.action";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  // console.log("category:", category);
  const res = await listFAQs(category);
  // console.log(res);
  return NextResponse.json(res);
}
