import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createApplicationForm } from "@/actions/application-forms/create.action";
import { useState } from "react";
import { toast } from "sonner";

import { useApplicationFormListStore } from "@/store/application-form/list.store";
export default function StartApplicationStatusCard() {
  const { isFetching, isLoading, refetch } = useApplicationFormListStore();

  const [isCreating, setIsCreating] = useState(false);
  if (isFetching || isLoading) return null;

  const handleCreateApplication = async () => {
    try {
      setIsCreating(true);

      const response = await createApplicationForm();

      if (response.success) {
        toast.success(response.message);
        refetch?.();
        window.open(`/applications/${response.id}`, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create application");
    } finally {
      setIsCreating(false);
    }
  };
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
                <p>-</p>
              </div>

              <div className="text-muted-foreground">
                <p className="text-sm">Last Modified No</p>
                <p>-</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Action</p>
                <div className="flex gap-2">
                  <Button
                    disabled={isCreating}
                    onClick={handleCreateApplication}
                    size={"sm"}
                    variant="outline"
                    className="mt-2 border-base text-base hover:text-base hover:bg-base text-xs!"
                  >
                    Start New Application
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t bg-gray-50 p-4 lg:border-l lg:border-t-0">
            <h3 className=" font-semibold ">Enrolment Journey</h3>
            <div className="mt-3 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border border-gray-300",
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full bg-gray-300")} />
                </div>

                <span
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-medium",
                    "border border-gray-300 bg-white text-gray-500",
                  )}
                >
                  Application Initiated
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border  border-gray-300",
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full bg-gray-300")} />
                </div>

                <span
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-medium border border-gray-300 bg-white text-gray-500",
                  )}
                >
                  Application Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
