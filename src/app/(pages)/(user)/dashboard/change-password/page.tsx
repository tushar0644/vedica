import ChangePasswordForm from "@/components/dashboard/change-password";

import type { Metadata } from "next";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

export const metadata: Metadata = {
  title: `Change Password | ${SITE_TITLE_SUFFIX}`,
};

export default function page() {
  return (
    <div className="flex gap-4 flex-col flex-1 h-full items-center justify-center ">
      <ChangePasswordForm></ChangePasswordForm>
    </div>
  );
}
