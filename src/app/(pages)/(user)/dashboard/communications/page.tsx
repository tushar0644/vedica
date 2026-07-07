import Communications from "@/components/dashboard/communication";
import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `My Communications | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return <Communications />;
}
