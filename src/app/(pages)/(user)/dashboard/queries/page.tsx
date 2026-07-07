import Queries from "@/components/dashboard/queries";
import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `My Queries | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return <Queries></Queries>;
}
