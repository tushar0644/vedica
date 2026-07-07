import { NextResponse } from "next/server";
import { getSiblingDocType } from "@/actions/doctypes/sibling.doctype.action";
import { getReferenceDocType } from "@/actions/doctypes/reference.doctype";

export async function GET() {
  const [sibling, reference] = await Promise.all([
    getSiblingDocType(),
    getReferenceDocType(),
  ]);

  return NextResponse.json({
    sibling: sibling.fieldMap,
    reference: reference.fieldMap,
  });
}
