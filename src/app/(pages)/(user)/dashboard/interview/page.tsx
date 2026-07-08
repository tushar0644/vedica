import React from "react";
import InterviewScheduler from "@/components/interview/interview-scheduler";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `Schedule Interview | ${SITE_TITLE_SUFFIX}`,
};

export default function page() {
  return (
    <div className="w-full">
      <InterviewScheduler />
    </div>
  );
}

