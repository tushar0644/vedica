"use client";
import React, { useEffect } from "react";
import SchedulePage from "@/components/interview-scheduler/interview/app/schedule/page";
import { useApplicationFormListStore } from "@/store/application-form/list.store";
import { isInterviewEligible } from "@/lib/interview-eligibility";
import { useRouter } from "next/navigation";

export default function InterviewScheduler() {
  const router = useRouter();
  const { data: applications, isLoading } = useApplicationFormListStore();
  const activeApp = applications && applications.length > 0 ? applications[0] : null;

  useEffect(() => {
    if (activeApp?.name) {
      sessionStorage.setItem("application_id", activeApp.name);
    }

    if (!isLoading && activeApp && !isInterviewEligible(activeApp)) {
      router.replace("/dashboard");
    }
  }, [activeApp, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (activeApp && !isInterviewEligible(activeApp)) {
    return null;
  }

  return <SchedulePage />;
}
