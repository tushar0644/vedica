"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ApplicationFormView } from "@/types/application-form";
import { cn } from "@/lib/utils";
import { FormStatus } from "@/types";
import { Download, Loader2 } from "lucide-react";
import { useInterviewStatus } from "@/hooks/use-interview";
import { isInterviewEligible } from "@/lib/interview-eligibility";

export default function ApplicationStatusCard({
  name,
  modified,
  docstatus,
  workflow_state,
}: ApplicationFormView) {
  const isInitiated = docstatus >= FormStatus.Draft;
  const isCompleted = docstatus >= FormStatus.Submitted;
  const isEligible = isInterviewEligible({ name, modified, docstatus, workflow_state, enable_scholarship_form: 0 });

  // Retrieve interview booking info
  const { data: booking, isLoading: interviewLoading } = useInterviewStatus();
  const isScheduled = !!booking;

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

          <div className="border-t bg-gray-50 p-4 lg:border-l lg:border-t-0">
            <h3 className=" font-semibold ">Enrolment Journey</h3>
            <div className="mt-3 space-y-4">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    isInitiated ? "border-green-600" : "border-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isInitiated ? "bg-green-600" : "bg-gray-300",
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-medium",
                    isInitiated
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 bg-white text-gray-500",
                  )}
                >
                  Application Initiated
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border",
                    isCompleted ? "border-green-600" : "border-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isCompleted ? "bg-green-600" : "bg-gray-300",
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-medium",
                    isCompleted
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 bg-white text-gray-500",
                  )}
                >
                  Application Completed
                </span>
              </div>

              {/* Step 3: Interview Scheduling */}
              {isEligible && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        !isCompleted
                          ? "border-gray-300"
                          : isScheduled
                          ? "border-green-600"
                          : "border-orange-500",
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          !isCompleted
                            ? "bg-gray-300"
                            : isScheduled
                            ? "bg-green-600"
                            : "bg-orange-500",
                        )}
                      />
                    </div>

                    <span
                      className={cn(
                        "rounded-full px-4 py-1 text-xs font-medium",
                        !isCompleted
                          ? "border border-gray-300 bg-white text-gray-500"
                          : isScheduled
                          ? "bg-green-600 text-white"
                          : "bg-orange-500 text-white",
                      )}
                    >
                      {!isCompleted
                        ? "Interview Pending"
                        : isScheduled
                        ? "Interview Scheduled"
                        : "Interview Schedule"}
                    </span>
                  </div>

                  {/* Step Actions/Details */}
                  {isCompleted && (
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
                  )}
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

