import Payments from "@/components/dashboard/payments";
import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `My Payments | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return <Payments />;
}
