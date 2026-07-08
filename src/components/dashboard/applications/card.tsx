"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApplicationFormView } from "@/types/application-form";
import { cn } from "@/lib/utils";
import { FormStatus } from "@/types";
import { Download, Loader2 } from "lucide-react";
import { useInterviewStatus } from "@/hooks/use-interview";
import {
  isApplicationSubmitted,
  isOfferLetterIssued,
  isOfferLetterAccepted,
  isInterviewEligible,
  isPaymentEligible,
} from "@/lib/interview-eligibility";

// ── Reusable Step Indicator ──────────────────────────────────
function StepIndicator({
  active,
  color = "green",
}: {
  active: boolean;
  color?: "green" | "orange" | "gray";
}) {
  const colorMap = {
    green: { border: "border-green-600", bg: "bg-green-600" },
    orange: { border: "border-orange-500", bg: "bg-orange-500" },
    gray: { border: "border-gray-300", bg: "bg-gray-300" },
  };
  const c = active ? colorMap[color] : colorMap.gray;
  return (
    <div
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-full border",
        c.border
      )}
    >
      <div className={cn("h-2 w-2 rounded-full", c.bg)} />
    </div>
  );
}

function StepBadge({
  label,
  active,
  color = "green",
}: {
  label: string;
  active: boolean;
  color?: "green" | "orange" | "gray";
}) {
  const styles = {
    green: "bg-green-600 text-white",
    orange: "bg-orange-500 text-white",
    gray: "border border-gray-300 bg-white text-gray-500",
  };
  return (
    <span
      className={cn(
        "rounded-full px-4 py-1 text-xs font-medium",
        active ? styles[color] : styles.gray
      )}
    >
      {label}
    </span>
  );
}

// ── Main Card Component ──────────────────────────────────────
export default function ApplicationStatusCard({
  name,
  modified,
  docstatus,
  workflow_state,
}: ApplicationFormView) {
  const app = { name, modified, docstatus, workflow_state, enable_scholarship_form: 0 };

  const isInitiated = docstatus >= FormStatus.Draft;
  const isCompleted = isApplicationSubmitted(app);
  const offerIssued = isOfferLetterIssued(app);
  const offerAccepted = isOfferLetterAccepted(app);
  const interviewEligible = isInterviewEligible(app);

  // Retrieve interview booking info
  const { data: booking, isLoading: interviewLoading } = useInterviewStatus();
  const isScheduled = !!booking;
  const paymentEligible = isPaymentEligible(app, isScheduled);

  return (
    <Card className="w-full rounded-xl border bg-white shadow-sm p-0!">
      <CardContent className="p-0!">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          {/* Left Section */}
          <div className="p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Application Form 2026 - 2027
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-muted-foreground">
                <p className="text-sm">Application No.</p>
                <p className="mt-2 text-base font-medium">{name}</p>
              </div>

              <div className="text-muted-foreground">
                <p className="text-sm">Last Modified No</p>
                <p className="mt-2 text-base font-medium">
                  {new Date(modified).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Action</p>
                <div className="flex gap-2">
                  {docstatus == FormStatus.Draft && (
                    <>
                      <Link href={`/applications/${name}`}>
                        <Button
                          size={"sm"}
                          variant="outline"
                          className="mt-2 border-base text-base hover:text-base hover:bg-base text-xs!"
                        >
                          Continue
                        </Button>
                      </Link>
                    </>
                  )}

                  <Link href={`/applications/${name}/scholarship`}>
                    <Button
                      size={"sm"}
                      variant="outline"
                      className="mt-2 border-base text-base hover:text-base hover:bg-base text-xs!"
                    >
                      Continue Scholarship
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section — Enrolment Journey Progress Tracker */}
          <div className="border-t bg-gray-50 p-4 lg:border-l lg:border-t-0">
            <h3 className=" font-semibold ">Enrolment Journey</h3>
            <div className="mt-3 space-y-4">
              {/* Step 1: Application Initiated */}
              <div className="flex items-center gap-3">
                <StepIndicator active={isInitiated} />
                <StepBadge label="Application Initiated" active={isInitiated} />
              </div>

              {/* Step 2: Application Completed */}
              <div className="flex items-center gap-3">
                <StepIndicator active={isCompleted} />
                <StepBadge label="Application Completed" active={isCompleted} />
              </div>

              {/* Step 3: Offer Letter Issued */}
              {isCompleted && (
                <div className="flex items-center gap-3">
                  <StepIndicator active={offerIssued} color={offerIssued ? "green" : "gray"} />
                  <StepBadge
                    label={offerIssued ? "Offer Letter Issued" : "Offer Letter Pending"}
                    active={offerIssued}
                  />
                </div>
              )}

              {/* Step 4: Offer Letter Accepted */}
              {offerIssued && (
                <div className="flex items-center gap-3">
                  <StepIndicator active={offerAccepted} color={offerAccepted ? "green" : "orange"} />
                  <StepBadge
                    label={offerAccepted ? "Offer Letter Accepted" : "Offer Acceptance Pending"}
                    active={offerAccepted}
                    color={offerAccepted ? "green" : "orange"}
                  />
                </div>
              )}

              {/* Step 5: Interview Scheduling */}
              {interviewEligible && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <StepIndicator
                      active={isScheduled}
                      color={isScheduled ? "green" : "orange"}
                    />
                    <StepBadge
                      label={isScheduled ? "Interview Scheduled" : "Interview Schedule"}
                      active={true}
                      color={isScheduled ? "green" : "orange"}
                    />
                  </div>

                  {/* Step Actions/Details */}
                  <div className="pl-7 flex flex-col gap-1 text-[11px] font-medium text-gray-500">
                    {interviewLoading ? (
                      <div className="flex items-center gap-1 text-gray-400 py-0.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Checking status...</span>
                      </div>
                    ) : isScheduled ? (
                      <div className="space-y-1">
                        <p className="text-gray-600 leading-tight">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })} at {booking.time} ({booking.mode})
                        </p>
                        <Link href="/dashboard/interview">
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-maroon! text-maroon! hover:bg-maroon/5! font-semibold px-2 py-0.5 text-[10px] h-auto! w-fit rounded-md!"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link href="/dashboard/interview" className="mt-0.5">
                        <Button
                          size="xs"
                          className="bg-base text-white hover:bg-base/90 font-semibold px-2 py-0.5 text-[10px] h-auto! rounded-md!"
                        >
                          Book Slot
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Admission Payment */}
              {paymentEligible && (
                <div className="flex items-center gap-3">
                  <StepIndicator
                    active={workflow_state === "Enrolled"}
                    color={workflow_state === "Enrolled" ? "green" : "orange"}
                  />
                  <StepBadge
                    label={workflow_state === "Enrolled" ? "Payment Completed" : "Admission Payment Pending"}
                    active={true}
                    color={workflow_state === "Enrolled" ? "green" : "orange"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t py-2 px-5">
          <p className="text-xs mb-2">Documents</p>
          <div className="flex gap-2 items-center">
            <Button className="bg-maroon rounded-sm! py-1! h-auto!" size={"xs"}>
              <Download className="stroke-blue-600"></Download>
              Download Offer Letter
            </Button>
            <Button
              className="  rounded-sm! py-1! h-auto!"
              variant={"outline"}
              size={"xs"}
            >
              <Download className="stroke-blue-600"></Download>
              Application Form
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
