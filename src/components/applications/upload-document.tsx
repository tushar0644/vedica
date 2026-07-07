"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { StepComponentProps } from "./type";
import React, { useEffect } from "react";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";

import { DynamicFileInput } from "@/components/common/file-input";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { ApplicationFormFooter } from "./application-footer";

const formSchema = z.object({
  upload_your_recent_passport_size_photograph: z.string().min(1, "Required"),
  upload_your_resume: z.string().min(1, "Required"),
  "10th_marksheet": z.string().min(1, "Required"),
  "12th_marksheet": z.string().min(1, "Required"),
  under_graduation: z.string().min(1, "Required"),
  post_graduate: z.string().optional(),
  // experience_letter: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const uploadFields = [
  {
    name: "upload_your_recent_passport_size_photograph",
    required: true,
    maxSizeMB: 1,
    accept: ".jpeg,.jpg,.png",
  },
  {
    name: "upload_your_resume",
    required: true,
    maxSizeMB: 5,
    accept: ".pdf",
  },
  {
    name: "10th_marksheet",
    required: true,
    maxSizeMB: 2,
    accept: ".jpeg,.jpg,.png,.pdf",
  },
  {
    name: "12th_marksheet",
    required: true,
    maxSizeMB: 2,
    accept: ".jpeg,.jpg,.png,.pdf",
  },
  {
    name: "under_graduation",
    required: true,
    maxSizeMB: 2,
    accept: ".jpeg,.jpg,.png,.pdf",
  },
  {
    name: "post_graduate",
    required: false,
    maxSizeMB: 2,
    accept: ".jpeg,.jpg,.png,.pdf",
  },
  // {
  //   name: "experience_letter",
  //   required: false,
  //   maxSizeMB: 2,
  //   accept: ".jpeg,.jpg,.png,.pdf",
  // },
];

export function UploadDocumentsForm({
  onNext,
  onBack,
  onExit,
  step,
}: StepComponentProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upload_your_recent_passport_size_photograph: "",
      upload_your_resume: "",
      "10th_marksheet": "",
      "12th_marksheet": "",
      under_graduation: "",
      post_graduate: "",
      // experience_letter: "",
    },
  });

  const { data: doctype } = useApplicationFormDocTypeStore();
  const { data } = useApplicationFormStore();
  const { handleSubmit } = useApplication();

  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (!data || initialized.current) return;

    form.reset(data);
    initialized.current = true;
  }, [data, form]);
  const onSubmit = async (values: FormValues) => {
    try {
      await handleSubmit(values);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4 sm:px-6">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[16px] font-semibold text-[#293d8f] sm:text-[18px]">
          Upload Files
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="
          grid grid-cols-1 
          gap-x-6 gap-y-8 
          px-4 py-6 
          sm:px-6 
          lg:grid-cols-2
          items-start
        "
        >
          {uploadFields.map((item) => (
            <DynamicFileInput
              key={item.name}
              form={form}
              doctype={doctype}
              name={item.name}
              required={item.required}
              maxSizeMB={item.maxSizeMB}
              accept={item.accept}
            />
          ))}
          <div className=" w-full col-span-1  lg:col-span-2">
            <ApplicationFormFooter
              form={form}
              onSave={handleSubmit}
              onBack={onBack}
              onNext={onNext}
              onExit={onExit}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
