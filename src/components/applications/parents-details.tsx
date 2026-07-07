"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicSelect } from "../common/select";
import { DynamicInput } from "../common/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepComponentProps } from "./type";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";
import { DynamicPhoneInput } from "../common/mobile-input";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { isValidPhoneNumber } from "react-phone-number-input";
import { ApplicationFormFooter } from "./application-footer";
const parentDetailsSchema = z
  .object({
    fathers_title: z.string().min(1, "Required"),
    fathers_full_name: z.string().min(1, "Required"),
    fathers_mobile_number: z.string().optional(),
    fathers_email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.email().safeParse(value).success,
        "Enter valid email",
      ),
    fathers_organisation: z.string().optional(),
    father_organisation__reason: z.string().optional(),
    father_sector: z.string().optional(),
    fathers_designation: z.string().optional(),
    name_of_business_for_father: z.string().optional(),
    company_name_father: z.string().optional(),
    mothers_title: z.string().min(1, "Required"),
    mothers_full_name: z.string().min(1, "Required"),
    mothers_email: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Enter valid email",
      ),
    mothers_mobile_number: z.string().optional(),
    mothers_organisation: z.string().optional(),
    mothers_organisation__reason: z.string().optional(),
    mother_sectors: z.string().optional(),
    mothers_designation: z.string().optional(),
    mother_name_of_bussiness: z.string().optional(),
    mother_company_name: z.string().optional(),
    annual_family_income_family_yours_if_working: z.string().min(1, "Required"),

    guardians_title: z.string().optional(),
    guardian_full_name: z.string().optional(),
    guardians_mobile_number: z.string().optional(),
    guardians_email: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Enter valid email",
      ),
    guardians_organisation: z.string().optional(),
    company_name: z.string().optional(),
    business_name: z.string().optional(),
    guardians_organisation_other_resaon: z.string().optional(),
    guardians_designation: z.string().optional(),
    guardians_academic_qualification: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log(data, ctx);
    // Fathe\
    if (data.fathers_title !== "Late") {
      if (!data.fathers_mobile_number?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fathers_mobile_number"],
          message: "Mobile number is required",
        });
      } else if (!isValidPhoneNumber(data.fathers_mobile_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fathers_mobile_number"],
          message: "Enter a valid mobile number",
        });
      }
      if (!data.fathers_email?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fathers_email"],
          message: "Enter a valid email",
        });
      }

      if (!data.fathers_organisation?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fathers_organisation"],
          message: "Organisation is required",
        });
      }
      if (data.fathers_organisation === "Salaried") {
        if (!data.father_sector?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["father_sector"],
            message: "Sector is required",
          });
        }

        if (!data.fathers_designation?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["fathers_designation"],
            message: "Designation is required",
          });
        }
        if (!data.company_name_father?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["company_name_father"],
            message: "Company name is required",
          });
        }
      }
      if (data.fathers_organisation === "Business") {
        if (!data.name_of_business_for_father?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["name_of_business_for_father"],
            message: "Business name is required",
          });
        }
      }
      if (data.fathers_organisation === "Other") {
        if (!data.father_organisation__reason?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["father_organisation__reason"],
            message: "Please specify organisation",
          });
        }
      }
    }

    if (data.mothers_title !== "Late") {
      if (!data.mothers_mobile_number?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mothers_mobile_number"],
          message: "Mobile number is required",
        });
      } else if (!isValidPhoneNumber(data.mothers_mobile_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mothers_mobile_number"],
          message: "Enter a valid mobile number",
        });
      }

      if (!data.mothers_email?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mothers_email"],
          message: "Enter a valid email",
        });
      }

      if (!data.mothers_organisation?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mothers_organisation"],
          message: "Organisation is required",
        });
      }
      if (data.mothers_organisation === "Salaried") {
        if (!data.mother_sectors?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mother_sectors"],
            message: "Sector is required",
          });
        }

        if (!data.mothers_designation?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mothers_designation"],
            message: "Designation is required",
          });
        }
        if (!data.mother_company_name?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mother_company_name"],
            message: "Company name is required",
          });
        }
      }
      if (data.mothers_organisation === "Business") {
        if (!data.mother_name_of_bussiness?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mother_name_of_bussiness"],
            message: "Business name is required",
          });
        }
      }
      if (data.mothers_organisation === "Other") {
        if (!data.mothers_organisation__reason?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mothers_organisation__reason"],
            message: "Please specify organisation",
          });
        }
      }
    }

    if (data.guardians_mobile_number) {
      if (!data.guardians_mobile_number?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardians_mobile_number"],
          message: "Mobile number is required",
        });
      } else if (!isValidPhoneNumber(data.guardians_mobile_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardians_mobile_number"],
          message: "Enter a valid mobile number",
        });
      }
    }

    if (data.guardians_email && !data.guardians_email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardians_email"],
        message: "Enter a valid email",
      });
    }
    if (
      data.guardians_organisation &&
      data.guardians_organisation === "Salaried"
    ) {
      if (!data.guardians_designation?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardians_designation"],
          message: "Designation is required",
        });
      }
      if (!data.company_name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["company_name"],
          message: "Company name is required",
        });
      }
    }

    if (
      data.guardians_organisation &&
      data.guardians_organisation === "Business"
    ) {
      if (!data.business_name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["business_name"],
          message: "Business name is required",
        });
      }
    }
    if (
      data.guardians_organisation &&
      data.guardians_organisation === "Other"
    ) {
      if (!data.guardians_organisation_other_resaon?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["guardians_organisation_other_resaon"],
          message: "Please specify organisation",
        });
      }
    }
  });

type ParentDetailsValues = z.infer<typeof parentDetailsSchema>;

export function ParentDetailsForm({
  onNext,
  onExit,
  onBack,
  step,
}: StepComponentProps) {
  const form = useForm<ParentDetailsValues>({
    resolver: zodResolver(parentDetailsSchema),

    defaultValues: {
      fathers_title: "",
      fathers_full_name: "",
      fathers_mobile_number: "",
      fathers_email: "",
      fathers_organisation: "",
      father_sector: "",
      fathers_designation: "",
      mothers_title: "",
      mothers_full_name: "",
      mothers_mobile_number: "",
      mothers_email: "",
      mothers_organisation: "",
      mothers_organisation__reason: "",
      mother_sectors: "",
      mothers_designation: "",
      annual_family_income_family_yours_if_working: "",

      guardians_title: "",
      guardian_full_name: "",
      guardians_mobile_number: "",
      guardians_email: "",
      guardians_organisation: "",
      guardians_academic_qualification: "",
    },
  });

  const { data } = useApplicationFormStore();
  const { data: doctype } = useApplicationFormDocTypeStore();
  const { handleSubmit } = useApplication();

  const initialized = useRef(false);

  useEffect(() => {
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
  const onError = (val: any) => {
    console.log(val);
  };
  const mothers_organisation = form.watch("mothers_organisation");
  const fathers_organisation = form.watch("fathers_organisation");

  const guardians_organisation = form.watch("guardians_organisation");
  const fathers_title = form.watch("fathers_title");
  const mothers_title = form.watch("mothers_title");
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Parent Details
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 px-4 py-5"
        >
          {/* FATHER DETAILS */}
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Father's Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
              {/* FATHER TITLE */}
              <DynamicSelect
                name="fathers_title"
                form={form}
                search={false}
                doctype={doctype}
                required
              />
              <DynamicInput
                form={form}
                doctype={doctype}
                name={"fathers_full_name"}
                required
              />

              {fathers_title !== "Late" && (
                <>
                  <DynamicPhoneInput
                    form={form}
                    doctype={doctype}
                    name="fathers_mobile_number"
                    required
                  />
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="fathers_email"
                    required
                  />
                  <DynamicSelect
                    form={form}
                    search={false}
                    doctype={doctype}
                    name="fathers_organisation"
                    required
                  />
                  {fathers_organisation === "Business" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="name_of_business_for_father"
                        required
                      />
                    </>
                  )}
                  {fathers_organisation === "Salaried" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="company_name_father"
                        required
                      />
                      <DynamicSelect
                        search={false}
                        form={form}
                        doctype={doctype}
                        name="father_sector"
                        required
                      />
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="fathers_designation"
                        required
                      />
                    </>
                  )}
                  {fathers_organisation === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="father_organisation__reason"
                        required
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          {/* MOTHER DETAILS */}
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Mother's Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
              {/* FATHER TITLE */}
              <DynamicSelect
                search={false}
                form={form}
                doctype={doctype}
                name="mothers_title"
                required
              />
              <DynamicInput
                form={form}
                doctype={doctype}
                name="mothers_full_name"
                required
              />

              {mothers_title !== "Late" && (
                <>
                  <DynamicPhoneInput
                    form={form}
                    doctype={doctype}
                    name="mothers_mobile_number"
                    required
                  />
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="mothers_email"
                    required
                  />
                  <DynamicSelect
                    form={form}
                    search={false}
                    doctype={doctype}
                    name="mothers_organisation"
                    required
                  />

                  {mothers_organisation === "Business" && (
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name="mother_name_of_bussiness"
                      required
                    />
                  )}
                  {mothers_organisation === "Salaried" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="mother_company_name"
                        required
                      />
                      <DynamicSelect
                        search={false}
                        form={form}
                        doctype={doctype}
                        name="mother_sectors"
                        required
                      />
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="mothers_designation"
                        required
                      />
                    </>
                  )}
                  {mothers_organisation === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={doctype}
                        name="mothers_organisation__reason"
                        required
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
              <DynamicSelect
                form={form}
                search={false}
                doctype={doctype}
                name="annual_family_income_family_yours_if_working"
                required
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Guardian's Details (if applicable)
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
              {/* FATHER TITLE */}
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="guardians_title"
                search={false}
                // required
              />
              <DynamicInput
                form={form}
                doctype={doctype}
                name="guardian_full_name"
                // required
              />

              <DynamicPhoneInput
                form={form}
                doctype={doctype}
                name="guardians_mobile_number"
                // required
              />
              <DynamicInput
                form={form}
                doctype={doctype}
                name="guardians_email"
                // required
              />
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="guardians_organisation"
                search={false}
                // required
              />
              {guardians_organisation === "Salaried" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="company_name"
                    // required
                  />
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="guardians_designation"
                    // required
                  />
                </>
              )}
              {guardians_organisation === "Business" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="business_name"
                    // required
                  />
                </>
              )}
              {guardians_organisation === "Other" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="guardians_organisation_other_resaon"
                    // required
                  />
                </>
              )}
              <DynamicInput
                form={form}
                doctype={doctype}
                name="guardians_academic_qualification"
                // required
              />
            </div>
          </section>
          <ApplicationFormFooter
            form={form}
            onSave={onSubmit}
            onBack={onBack}
            onNext={onNext}
            onExit={onExit}
          />
        </form>
      </Form>
    </div>
  );
}
