import { ApplicationFormListStore } from "@/store/application-form/list.store";
import { AccountStore } from "@/store/user.store";
import { ReactNode } from "react";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ApplicationFormListStore>
      <AccountStore>{children}</AccountStore>
    </ApplicationFormListStore>
  );
}
