import { NextRequest, NextResponse } from "next/server";
import { listQueries } from "@/actions/queries/list.action";
export async function GET(req: NextRequest) {
  const res = await listQueries();
  return NextResponse.json(res);
}
