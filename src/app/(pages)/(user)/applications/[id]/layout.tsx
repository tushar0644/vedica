import { ApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { ApplicationFormStore } from "@/store/application-form/get.store";
import { ApplicationTableFormDocTypeStore } from "@/store/application-form/table-doctype.store";
import { QualificationFormDocTypeStore } from "@/store/qualification-form/doctype.store";
import { QualificationFormStore } from "@/store/qualification-form/get.store";
import { ReactNode } from "react";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ApplicationFormStore>
      <ApplicationFormDocTypeStore>
        <ApplicationTableFormDocTypeStore>
          <QualificationFormDocTypeStore>
            <QualificationFormStore>{children}</QualificationFormStore>
          </QualificationFormDocTypeStore>
        </ApplicationTableFormDocTypeStore>
      </ApplicationFormDocTypeStore>
    </ApplicationFormStore>
  );
}
