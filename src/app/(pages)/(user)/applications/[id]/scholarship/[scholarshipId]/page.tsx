import Applications from "@/components/applications";
import ApplicationHeader from "@/components/applications/header";
import { ScholarshipForm } from "@/components/scholarship/form";
import ScholarshipCarousel from "@/components/scholarship/scholarship-carousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Form",
};

export default function Page() {
  return (
    <main className="flex w-full justify-center bg-white">
      <div className="space-y-10 w-full   min-h-screen relative">
        <ApplicationHeader></ApplicationHeader>
        <div className="max-w-280 mx-auto sm:p-0 p-4">
          <ScholarshipCarousel></ScholarshipCarousel>
          <ScholarshipForm></ScholarshipForm>
        </div>
      </div>
    </main>
  );
}
