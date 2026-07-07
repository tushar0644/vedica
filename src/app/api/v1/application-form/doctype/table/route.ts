import { NextResponse } from "next/server";
import { getCompetitiveFormDocType } from "@/actions/doctypes/competitive.doctype.action";
import { getInternDocType } from "@/actions/doctypes/intern.doctype.action";
import { getWorkExDocType } from "@/actions/doctypes/work.doctype.action";
import { getPGFormDocType } from "@/actions/doctypes/pg.doctype.action";
import { getExtraCurDocType } from "@/actions/doctypes/extra.doctype.action";
import { getUGFormDocType } from "@/actions/doctypes/ug.doctype.action";

export async function GET() {
  const [competitive, intern, workEx, ug, pg, extraCur] = await Promise.all([
    getCompetitiveFormDocType(),
    getInternDocType(),
    getWorkExDocType(),
    getUGFormDocType(),
    getPGFormDocType(),
    getExtraCurDocType(),
  ]);

  return NextResponse.json({
    competitive: competitive.fieldMap,
    intern: intern.fieldMap,
    workEx: workEx.fieldMap,
    pg: pg.fieldMap,
    ug: ug.fieldMap,
    extraCur: extraCur.fieldMap,
  });
}
