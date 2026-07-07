import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
interface ApplicationFormFooterProps {
  form: UseFormReturn<any>;

  nextText?: string;
  backText?: string;
  exitText?: string;

  onSave: (values: any) => void;

  onNext: () => void;
  onBack: () => void;
  onExit: () => void;

  showBack?: boolean;
  showNext?: boolean;
  showExit?: boolean;
}

export function ApplicationFormFooter({
  form,
  onSave,
  onNext,
  onBack,
  onExit,
  showBack = true,
  showNext = true,
  showExit = true,
  backText = "Save & Back",
  nextText = "Save & Next",
  exitText = "Save & Exit",
}: ApplicationFormFooterProps) {
  const [backDialogOpen, setBackDialogOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState<
    "next" | "back" | "exit" | null
  >(null);

  const loading =
    actionLoading !== null ||
    form.formState.isSubmitting ||
    form.formState.isLoading;
  async function save() {
    const valid = await form.trigger(undefined, {
      shouldFocus: true,
    });

    if (!valid) {
      toast.error("Form is invalid. Please correct the highlighted fields.");
      return false;
    }

    await onSave(form.getValues());

    return true;
  }

  return (
    <>
      <div className="flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between">
        {showBack ? (
          <Button
            type="button"
            disabled={loading}
            onClick={() => setBackDialogOpen(true)}
            className="h-9 w-full rounded-none bg-[#ff6b1a]! px-8 hover:bg-[#ff6b1a]! md:w-fit"
          >
            {backText}
          </Button>
        ) : (
          <div />
        )}

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          {showExit && (
            <Button
              className="h-9 w-full rounded-none bg-[#ff6b1a]! px-8 hover:bg-[#ff6b1a]! md:w-fit"
              type="button"
              disabled={loading}
              onClick={async () => {
                setActionLoading("exit");

                try {
                  if (!(await save())) return;
                  onExit();
                } finally {
                  setActionLoading(null);
                }
              }}
            >
              {actionLoading === "exit" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                exitText
              )}
            </Button>
          )}

          {showNext && (
            <Button
              className="h-9 w-full rounded-none bg-[#ff6b1a]! px-8 hover:bg-[#ff6b1a]! md:w-fit"
              type="button"
              disabled={loading}
              onClick={async () => {
                setActionLoading("next");

                try {
                  if (!(await save())) return;
                  onNext();
                } finally {
                  setActionLoading(null);
                }
              }}
            >
              {actionLoading === "next" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                nextText
              )}
            </Button>
          )}
        </div>
      </div>
      <AlertDialog open={backDialogOpen} onOpenChange={setBackDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this step?</AlertDialogTitle>

            <AlertDialogDescription>
              Would you like to save your changes before returning to the
              previous step?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setBackDialogOpen(false);
                onBack();
              }}
            >
              Don't Save
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-maroon! hover:bg-maroon!"
              onClick={async (e) => {
                e.preventDefault();

                setBackDialogOpen(false);
                setActionLoading("back");

                try {
                  if (!(await save())) return;
                  onBack();
                } finally {
                  setActionLoading(null);
                }
              }}
            >
              {actionLoading === "back" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Go Back"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
