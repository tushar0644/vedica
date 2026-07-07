import { ScholarshipFormDocTypeStore } from "@/store/scholarship-form/doctype.store";
import { ScholarshipFormStore } from "@/store/scholarship-form/get.store";
import { ScholarshipTableFormDocTypeStore } from "@/store/scholarship-form/table-doctype.store";
import { ReactNode } from "react";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ScholarshipFormStore>
      <ScholarshipFormDocTypeStore>
        <ScholarshipTableFormDocTypeStore>
          {children}
        </ScholarshipTableFormDocTypeStore>
      </ScholarshipFormDocTypeStore>
    </ScholarshipFormStore>
  );
}
