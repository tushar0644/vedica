// applications.tsx
"use client";

import { AddressDetailsForm } from "@/components/applications/address-form";
import { DeclarationForm } from "@/components/applications/declaration";
import { ExtraCurricularDetails } from "@/components/applications/extra-curricular-activities-details";
import { ParentDetailsForm } from "@/components/applications/parents-details";
import { PersonalDetailsForm } from "@/components/applications/personal-details";
import { QualificationDetailsForm } from "@/components/applications/qualiification-details";
import { UploadDocumentsForm } from "@/components/applications/upload-document";
import { WorkDetailsForm } from "@/components/applications/work-details";

import ApplicationCarousel from "./application-carousel";
import ApplicationProvider, { useApplication } from "./provider";
import ApplicationHeader from "./header";
import { useRouter } from "next/navigation";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useAccountStore } from "@/store/user.store";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { useApplicationTableFormDocTypeStore } from "@/store/application-form/table-doctype.store";

function RenderCurrentForm() {
  const { isLoading: formLoading } = useApplicationFormStore();
  const { isLoading: userLoading } = useAccountStore();
  const { isLoading: doctypeLoading } = useApplicationFormDocTypeStore();
  const { isLoading: tableDoctypeLoading } =
    useApplicationTableFormDocTypeStore();
  const isLoading =
    formLoading || userLoading || doctypeLoading || tableDoctypeLoading;

  const { currentStep, nextStep, prevStep } = useApplication();
  const { replace } = useRouter();

  if (isLoading) {
    return (
      <div className="flex fixed top-0 left-0 z-100 backdrop-blur-xl h-screen w-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#293d8f] border-t-transparent" />
          <h3 className="text-lg font-semibold text-[#293d8f]">
            Loading Form Details
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Please wait while we load your application...
          </p>
        </div>
      </div>
    );
  }

  const commonProps = {
    onNext: nextStep,
    onBack: prevStep,
    onExit: () => replace("/dashboard"),
    step: currentStep,
  };

  switch (currentStep) {
    case 0:
      return <PersonalDetailsForm {...commonProps} />;
    case 1:
      return <ParentDetailsForm {...commonProps} />;
    case 2:
      return <AddressDetailsForm {...commonProps} />;
    case 3:
      return <QualificationDetailsForm {...commonProps} />;
    case 4:
      return <WorkDetailsForm {...commonProps} />;
    case 5:
      return <ExtraCurricularDetails {...commonProps} />;
    case 6:
      return <UploadDocumentsForm {...commonProps} />;
    case 7:
      return <DeclarationForm {...commonProps} />;
    default:
      return null;
  }
}

export default function Applications() {
  return (
    <ApplicationProvider>
      <div className="space-y-10 w-full   min-h-screen relative">
        <ApplicationHeader></ApplicationHeader>
        <div className="max-w-280 mx-auto sm:p-0 p-4">
          <ApplicationCarousel />

          <RenderCurrentForm />
        </div>
      </div>
    </ApplicationProvider>
  );
}
