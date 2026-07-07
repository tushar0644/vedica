import { NextRequest, NextResponse } from "next/server";
import { getApplicationForm } from "@/actions/application-forms/get.action";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await getApplicationForm({
    applicationId: id,
  });

  return NextResponse.json(res.data);
}
