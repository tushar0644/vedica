"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";
import { StepComponentProps } from "./type";
import { toast } from "sonner";
import React from "react";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { DynamicInput } from "../common/input";
import { useApplicationTableFormDocTypeStore } from "@/store/application-form/table-doctype.store";
import { DynamicTextarea } from "../common/textarea";
import { ApplicationFormFooter } from "./application-footer";

const extraCurricularSchema = z.object({
  name_of_activity: z.string().optional(),
  duration: z.string().optional(),
  descriptionachievements: z.string().optional(),
});

const formSchema = z.object({
  extra_curricular_activities: z.array(extraCurricularSchema).default([]),
  blog__personal_website: z.string().optional(),
  any_thing_else: z.string().optional(),
  website: z.string().optional(),
});

export function ExtraCurricularDetails({
  onNext,
  onExit,
  onBack,
  step,
}: StepComponentProps) {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      extra_curricular_activities: [
        {
          name_of_activity: "",
          duration: "",
          descriptionachievements: "",
        },
      ],
      blog__personal_website: "",
    },
  });

  const addExtra = () => {
    const current = form.getValues("extra_curricular_activities") || [];
    if (current.length >= 5) {
      toast.error("Maximum 5 extra-curricular activities allowed");
      return;
    }
    form.setValue("extra_curricular_activities", [
      ...current,
      {
        name_of_activity: "",
        duration: "",
        descriptionachievements: "",
      },
    ]);
  };

  const removeExtra = (index: number) => {
    const current = form.getValues("extra_curricular_activities") || [];
    form.setValue(
      "extra_curricular_activities",
      current.filter((_: any, i: number) => i !== index),
    );
  };
  const { data } = useApplicationFormStore();
  const { handleSubmit } = useApplication();
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (!data || initialized.current) return;

    form.reset(data);
    initialized.current = true;
  }, [data, form]);
  const onSubmit = async (values: any) => {
    try {
      await handleSubmit(values);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };
  const { data: doctype } = useApplicationFormDocTypeStore();

  const { data: tableDoctype } = useApplicationTableFormDocTypeStore();
  const { extraCur } = tableDoctype!!;
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Extra-Curricular Activities Details
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-5"
        >
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Extra-Curricular Activities
              </h3>

              <Button
                type="button"
                onClick={addExtra}
                className="rounded-none bg-[#0b6b63]"
              >
                + More
              </Button>
            </div>

            {/* @ts-ignore */}
            {form
              .watch("extra_curricular_activities")
              ?.map((_: any, index: number) => (
                <div key={index} className="border p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">
                      Name of Activity {index + 1}
                    </h4>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => removeExtra(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  {/* ROW 1 - 2 INPUTS */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <DynamicInput
                      form={form}
                      name={`extra_curricular_activities.${index}.name_of_activity`}
                      doctype={extraCur}
                    />

                    <DynamicInput
                      form={form}
                      name={`extra_curricular_activities.${index}.duration`}
                      doctype={extraCur}
                    />
                  </div>

                  <DynamicTextarea
                    form={form}
                    name={`extra_curricular_activities.${index}.descriptionachievements`}
                    doctype={extraCur}
                  />
                </div>
              ))}
          </section>

          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Tell Us More
            </h3>

            <div className="grid gap-4">
              {[
                // "website",
                // "facebook",
                // "instagram",
                // "linkedin",
                // "twitter",
                "blog__personal_website",
                "any_thing_else",
              ].map((item) => (
                <DynamicInput form={form} doctype={doctype} name={item} />
              ))}
            </div>
          </section>
          <ApplicationFormFooter
            form={form}
            onSave={handleSubmit}
            onBack={onBack}
            onNext={onNext}
            onExit={onExit}
          />
        </form>
      </Form>
    </div>
  );
}
