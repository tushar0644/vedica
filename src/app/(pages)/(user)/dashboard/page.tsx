import Applications from "@/components/dashboard/applications";
import React from "react";

import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";
import ApplicationStats from "@/components/dashboard/applications/stats";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Applications | ${SITE_TITLE_SUFFIX}`,
};

export default function page() {
  return (
    <>
      <div className=" w-full relative h-45 sm:h-55 md:h-85 lg:h-110 xl:h-125 mb-5">
        <Image fill src="/banner.webp" alt="" className="object-left"></Image>
      </div>
      <div className="flex gap-4 flex-col">
        <ApplicationStats></ApplicationStats>
        <Applications></Applications>
      </div>
    </>
  );
}
