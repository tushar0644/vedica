import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";
import FAQSection from "@/components/dashboard/faqs";
import { FAQStore } from "@/store/faq.store";
export const metadata: Metadata = {
  title: `FAQ | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return (
    <FAQStore>
      <FAQSection />
    </FAQStore>
  );
}
