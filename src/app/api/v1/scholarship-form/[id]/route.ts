import { NextRequest, NextResponse } from "next/server";
import { getScholarshipForm } from "@/actions/scholarship-forms/get.action";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await getScholarshipForm({
    scholarshipId: id,
  });

  return NextResponse.json(res.data);
}
