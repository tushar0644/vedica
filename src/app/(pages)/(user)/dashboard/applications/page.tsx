import Applications from "@/components/dashboard/applications";


import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `Applications | ${SITE_TITLE_SUFFIX}`,
};

export default function page() {
  return (
    <div className="flex gap-4 flex-col">
      <Applications></Applications>
    </div>
  );
}
