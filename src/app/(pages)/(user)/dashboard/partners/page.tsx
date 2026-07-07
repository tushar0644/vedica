import LoanPartners from "@/components/dashboard/partners";
import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `Loan Partners | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return <LoanPartners />;
}
