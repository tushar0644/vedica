import ProfileForm from "@/components/dashboard/profile";
import React from "react";
import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `Profile | ${SITE_TITLE_SUFFIX}`,
};
export default function page() {
  return <ProfileForm></ProfileForm>;
}
