"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { StepComponentProps } from "./type";
import { useAccountStore } from "@/store/user.store";
import { useEffect } from "react";
import { useApplication } from "./provider";
import { DynamicInput } from "../common/input";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { DynamicDateInput } from "../common/date-input";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useRouter } from "next/navigation";
import { ApplicationFormFooter } from "./application-footer";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  applicant_name: z.string().min(1, "Applicant name is required"),
  parent_name: z.string().min(1, "Parent name is required"),
  date: z.string().min(1, "Date is required"),
  i_agree: z.boolean().refine((val) => val, {
    message: "Required Field",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DeclarationForm({
  onNext,
  onBack,
  onExit,
  step,
}: StepComponentProps) {
  const { data: user } = useAccountStore();
  const { data } = useApplicationFormStore();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      i_agree: false,
      applicant_name: "",
      parent_name: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (!user || !data) return;
    form.setValue(
      "applicant_name",
      [user.first_name, user.last_name].join(" "),
    );
    // @ts-ignore
    // form.setValue("parent_name", data["fathers_full_name"] as string);
    form.setValue("date", new Date().toISOString().split("T")[0]);
  }, [user, data]);

  const { handleFinalSubmit, handleSubmit } = useApplication();
  const { replace } = useRouter();
  const onSubmit = async (values: any) => {
    try {
      await handleSubmit(values);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: doctype } = useApplicationFormDocTypeStore();

  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Declaration
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-6"
        >
          {/* DECLARATION TEXT */}
          <div className="space-y-3">
            <p className="text-sm leading-7 text-[#444]">
              I hereby declare that all the particulars stated in the
              application form are true to the best of my knowledge and belief.
              In the event of fraudulent, incorrect or false information or
              suppression or distortion of any fact like educational
              qualification, marks, nationality etc., I understand that my
              admission/degree is liable for cancellation. I further understand
              that my application is purely provisional subject to the
              verification of the eligible condition.
            </p>
          </div>

          {/* FORM FIELDS */}
          <div className="grid gap-6 md:grid-cols-2">
            <DynamicInput
              disabled
              name="applicant_name"
              form={form}
              doctype={doctype}
              required
            ></DynamicInput>
            <DynamicInput
              name="parent_name"
              form={form}
              doctype={doctype}
              required
            ></DynamicInput>
            <DynamicDateInput
              disabled
              name="date"
              form={form}
              doctype={doctype}
              required
            />
          </div>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="i_agree"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(e) => field.onChange(e.valueOf())}
                      />
                      <p className="text-[12px] font-semibold text-black">
                        I Agree
                      </p>
                    </label>
                  </div>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
          </div>
          {/* FOOTER */}
          <ApplicationFormFooter
            form={form}
            showNext={false}
            nextText="Save & Submit"
            onSave={() => {
              form.handleSubmit(onSubmit)();
            }}
            onBack={onBack}
            onNext={() => {}}
            onExit={onExit}
          />
        </form>
      </Form>
    </div>
  );
}
