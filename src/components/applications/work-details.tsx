"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepComponentProps } from "./type";
import React, { useEffect } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";
import { DynamicSelect } from "../common/select";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { useApplicationTableFormDocTypeStore } from "@/store/application-form/table-doctype.store";
import { DynamicInput } from "../common/input";
import { DynamicTextarea } from "../common/textarea";
import { DynamicPhoneInput } from "../common/mobile-input";
import { ApplicationFormFooter } from "./application-footer";
import { useAccountStore } from "@/store/user.store";
import { getAllCities } from "@/actions/extras/states-cities";

const workExperienceSchema = z
  .object({
    employment_type: z.enum([
      "Freelancer",
      "Independent Consultant",
      "Full Time",
    ]),
    name_of_organization: z.string().min(1, "Required"),
    organization: z.enum([
      "Autonomous",
      "Government Central",
      "Government State",
      "Government Local Bodies",
      "Private Sector",
      "Public Sector",
      "NGO",
      "Self Employed",
      "Other",
    ]),
    if_other_please_specify: z.string().optional(),
    duration_in_months: z
      .string()
      .min(1, "duration_in_months required")
      .regex(/^\d+$/, "Only numbers allowed"),
    joined_as: z.string().optional(),
    last_drawn_salary_inryear: z
      .string()
      .regex(/^\d*$/, "Only numbers allowed")
      .optional(),
    current_designation: z.string().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    if_other_please_specifys_city: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const addError = (path: string | (string | number)[], message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: Array.isArray(path) ? path : path.split("."),
        message,
      });
    };
    if (
      data.organization === "Other" &&
      (!data.if_other_please_specify || data.if_other_please_specify === "")
    ) {
      addError(["if_other_please_specify"], "Please specific");
    }
    if (
      data.city === "Other" &&
      (!data.if_other_please_specifys_city ||
        data.if_other_please_specifys_city === "")
    ) {
      addError(["if_other_please_specifys_city"], "Please specific");
    }
  });

const internshipSchema = z
  .object({
    employment_type: z.enum(["Paid", "Unpaid"]),

    name_of_organization: z.string("Required").min(1, "Required"),

    organization: z.enum([
      "Autonomous",
      "Government Central",
      "Government State",
      "Government Local Bodies",
      "Private Sector",
      "Public Sector",
      "NGO",
      "Self Employed",
      "Other",
    ]),
    other_organization: z.string().optional(),
    duration_in_months: z
      .string()
      .min(1, "duration_in_months required")
      .regex(/^\d+$/, "Only numbers allowed"),
    joined_as: z.string().optional(),
    description: z.string().optional(),

    city: z.string().optional(),
    if_other_please_specify: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const addError = (path: string | (string | number)[], message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: Array.isArray(path) ? path : path.split("."),
        message,
      });
    };
    if (
      data.organization === "Other" &&
      (!data.other_organization || data.other_organization === "")
    ) {
      addError(["other_organization"], "Please specific");
    }
    if (
      data.city === "Other" &&
      (!data.if_other_please_specify || data.if_other_please_specify === "")
    ) {
      addError(["if_other_please_specifys_city"], "Please specific");
    }
  });
const wordCount = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;
const workDetailsSchema = z
  .object({
    do_you_have_any_work_experience: z.string("Required").default("No"),
    do_you_have_internship_experience: z.string("Required").default("No"),
    do_you_have_any_work_references: z.string("Required").default("No"),

    work_experience: z
      .array(workExperienceSchema)
      .max(5, "Maximum 5 work experiences allowed")
      .default([]),
    internship_details: z
      .array(internshipSchema)
      .max(5, "Maximum 5 internships allowed")
      .default([]),
    full_name: z
      .string()
      .optional()
      .refine((v) => !v || v.trim().length >= 2, {
        message: "Name must be at least 2 characters",
      }),

    email: z
      .string()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, {
        message: "Invalid email",
      }),
    work_experience_mobilenumber: z.string().optional(),
    organization_name: z
      .string()
      .optional()
      .refine((v) => !v || v.trim().length > 0, {
        message: "Organization Name is required",
      }),

    designation: z
      .string()
      .optional()
      .refine((v) => !v || v.trim().length > 0, {
        message: "Designation is required",
      }),

    website: z
      .string()
      .optional()
      .refine((v) => !v || z.string().url().safeParse(v).success, {
        message: "Invalid website",
      }),

    social_media_links: z
      .string()
      .optional()
      .refine((v) => !v || z.string().url().safeParse(v).success, {
        message: "Invalid URL",
      }),

    women_independence: z.string("Required").min(1, "Required"),
    challenge_overcome: z
      .string("Required")
      .min(1, "Required")
      .refine((v) => wordCount(v) <= 300, {
        message: "Maximum 300 words",
      }),

    career_aspirations: z
      .string("Required")
      .min(1, "Required")
      .refine((v) => wordCount(v) <= 300, {
        message: "Maximum 300 words",
      }),

    explain_dedica: z
      .string("Required")
      .min(1, "Required")
      .refine((v) => wordCount(v) >= 200, {
        message: "Minimum 200 words",
      })
      .refine((v) => wordCount(v) <= 300, {
        message: "Maximum 300 words",
      }),
  })
  .superRefine((data, ctx) => {
    if (
      data.do_you_have_any_work_experience === "Yes" &&
      data.work_experience.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["work_experience"],
        message: "At least one work experience is required",
      });
    }

    if (
      data.do_you_have_internship_experience === "Yes" &&
      data.internship_details.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["internship_details"],
        message: "At least one internship is required",
      });
    }
    if (data.work_experience_mobilenumber) {
      const digits = data.work_experience_mobilenumber.replace(/\D/g, "");

      if (digits.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fathers_mobile_number"],
          message: "Enter a valid mobile number",
        });
      }
    }
  });

export function WorkDetailsForm({
  onNext,
  onBack,
  onExit,
  step,
}: StepComponentProps) {
  const form = useForm<any>({
    resolver: zodResolver(workDetailsSchema),
    defaultValues: {
      do_you_have_any_work_experience: "No",
      do_you_have_internship_experience: "No",
      do_you_have_any_work_references: "No",
      work_experience: [],
      internship_details: [],
      psychometric: {
        women_independence: "",
        challenge_overcome: "",
        career_aspirations: "",
        explain_dedica: "",
      },
    },
  });

  const [cities, setCities] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await getAllCities();

      setCities(res.cities);
    })();
  }, [getAllCities]);
  const do_you_have_any_work_experience =
    form.watch("do_you_have_any_work_experience") === "Yes";
  const do_you_have_internship_experience =
    form.watch("do_you_have_internship_experience") === "Yes";
  const do_you_have_any_work_references =
    form.watch("do_you_have_any_work_references") === "Yes";
  /* -------------------------
     ADD HANDLERS
  --------------------------*/

  const removeItem = (key: string, index: number) => {
    const current = form.getValues(key) || [];

    const updated = current.filter((_: any, i: number) => i !== index);

    form.setValue(key as any, updated);

    if (updated.length === 0) {
      switch (key) {
        case "work_experience":
          form.setValue("do_you_have_any_work_experience", "No");
          break;

        case "internship_details":
          form.setValue("do_you_have_internship_experience", "No");
          break;

        case "workReferenceExperience":
          form.setValue("do_you_have_any_work_references", "No");
          break;
      }
    }
  };
  const addWorkExperience = () => {
    const current = form.getValues("work_experience") || [];

    if (current.length >= 5) {
      toast.error("Maximum 5 work experiences allowed");
      return;
    }

    form.setValue("work_experience", [
      ...current,
      {
        employment_type: "Full Time",
        organization: "Private Sector",
        name_of_organization: "",
        duration_in_months: "",
        joined_as: "",
        current_designation: "",
        last_drawn_salary_inryear: "",
        description: "",
        city: "",
      },
    ]);
  };

  const addInternExperience = () => {
    const current = form.getValues("internship_details") || [];

    if (current.length >= 5) {
      toast.error("Maximum 5 internships allowed");
      return;
    }

    form.setValue("internship_details", [
      ...current,
      {
        employment_type: "Paid",
        name_of_organization: "",
        organization: "Private Sector",
        duration_in_months: "",
        joined_as: "",
        description: "",
        city: "",
      },
    ]);
  };

  const { data: doctype } = useApplicationFormDocTypeStore();
  const { data } = useApplicationFormStore();
  const { data: tableDoctype } = useApplicationTableFormDocTypeStore();
  const { workEx, intern } = tableDoctype!!;
  const { handleSubmit } = useApplication();
  const { data: user } = useAccountStore();
  const initialized = React.useRef(false);
  const onError = (error: any) => {
    console.log(error);
  };

  const we = form.watch("do_you_have_any_work_experience") === "Yes";
  useEffect(() => {
    if (we && form.getValues("work_experience").length === 0)
      addWorkExperience();
  }, [we]);

  const _in = form.watch("do_you_have_internship_experience") === "Yes";
  useEffect(() => {
    if (_in && form.getValues("internship_details").length === 0)
      addInternExperience();
  }, [_in]);
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
  console.log(
    user?.custom_select_current_total_work_experience,
    typeof user?.custom_select_current_total_work_experience,
  );
  const showWorkExperience =
    user && user.custom_select_current_total_work_experience !== "Fresher";
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] text-white">
          Step {step + 1} of 8
        </div>
        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Work Details
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 px-4 py-5"
        >
          <section className="space-y-4">
              <DynamicSelect
                search={false}
                form={form}
                doctype={doctype}
                name="do_you_have_any_work_experience"
                required
              ></DynamicSelect>

              {do_you_have_any_work_experience && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#293d8f]">
                      Work Experience
                    </h3>

                    <Button
                      type="button"
                      className="rounded-none bg-[#0b6b63] hover:bg-[#0b6b63]"
                      size="sm"
                      onClick={addWorkExperience}
                    >
                      + More
                    </Button>
                  </div>
                  {/* @ts-ignore */}
                  {(Array.isArray(form.watch("work_experience")) ? form.watch("work_experience") : []).map((_, index) => (
                    <section key={index} className="space-y-5 border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[#293d8f]">
                          Work Experience {index + 1}
                        </h3>

                        <Button
                          className="rounded-none"
                          type="button"
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => removeItem("work_experience", index)}
                        >
                          <Trash2></Trash2>
                        </Button>
                      </div>

                      {/* ROW 1 */}
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
                        <DynamicSelect
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.employment_type`}
                          required
                        ></DynamicSelect>
                        <DynamicInput
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.name_of_organization`}
                          required
                        ></DynamicInput>
                        <DynamicSelect
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.organization`}
                          required
                        ></DynamicSelect>
                        {form.watch(`work_experience.${index}.organization`) ===
                          "Other" && (
                          <>
                            <DynamicInput
                              form={form}
                              doctype={workEx}
                              name={`work_experience.${index}.if_other_please_specify`}
                              required
                            />
                          </>
                        )}
                        <DynamicInput
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.duration_in_months`}
                          required
                        ></DynamicInput>
                        <DynamicInput
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.joined_as`}
                        ></DynamicInput>
                        <DynamicInput
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.current_designation`}
                        ></DynamicInput>
                        <DynamicInput
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.last_drawn_salary_inryear`}
                        ></DynamicInput>
                        <DynamicSelect
                          form={form}
                          doctype={workEx}
                          name={`work_experience.${index}.city`}
                          options={cities}
                        ></DynamicSelect>
                        {form.watch(`work_experience.${index}.city`) ===
                          "Other" && (
                          <>
                            <DynamicInput
                              form={form}
                              doctype={workEx}
                              name={`work_experience.${index}.if_other_please_specifys_city`}
                              required
                            />
                          </>
                        )}
                      </div>
                      <DynamicTextarea
                        form={form}
                        doctype={workEx}
                        name={`work_experience.${index}.description`}
                      />
                    </section>
                  ))}
                </>
              )}
            </section>
          {/* ================= INTERN EXPERIENCE ================= */}
          <section className="space-y-4">
            <DynamicSelect
              search={false}
              form={form}
              doctype={doctype}
              name="do_you_have_internship_experience"
              required
            ></DynamicSelect>

            {do_you_have_internship_experience && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#293d8f]">
                    Intern Experience
                  </h3>

                  <Button
                    type="button"
                    className="rounded-none bg-[#0b6b63] hover:bg-[#0b6b63]"
                    size="sm"
                    onClick={addInternExperience}
                  >
                    + More
                  </Button>
                </div>
                {/* @ts-ignore */}
                {(Array.isArray(form.watch("internship_details")) ? form.watch("internship_details") : []).map((_, index) => (
                  <section key={index} className="space-y-5 border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-semibold text-[#293d8f]">
                        Intern Experience {index + 1}
                      </h3>

                      <Button
                        className="rounded-none"
                        type="button"
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => removeItem("internship_details", index)}
                      >
                        <Trash2></Trash2>
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <DynamicSelect
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.employment_type`}
                        required
                      ></DynamicSelect>
                      <DynamicInput
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.name_of_organization`}
                        required
                      ></DynamicInput>
                      <DynamicSelect
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.organization`}
                        required
                      ></DynamicSelect>
                      {form.watch(
                        `internship_details.${index}.organization`,
                      ) === "Other" && (
                        <>
                          <DynamicInput
                            form={form}
                            doctype={intern}
                            name={`internship_details.${index}.other_organization`}
                            required
                          />
                        </>
                      )}
                      <DynamicInput
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.duration_in_months`}
                        required
                      ></DynamicInput>
                      <DynamicInput
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.joined_as`}
                      ></DynamicInput>
                      <DynamicInput
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.last_drawn_salary_inryear`}
                      ></DynamicInput>
                      <DynamicSelect
                        form={form}
                        doctype={intern}
                        name={`internship_details.${index}.city`}
                        options={cities}
                      ></DynamicSelect>
                      {form.watch(`internship_details.${index}.city`) ===
                        "Other" && (
                        <>
                          <DynamicInput
                            form={form}
                            doctype={workEx}
                            name={`internship_details.${index}.if_other_please_specify`}
                            required
                          />
                        </>
                      )}
                    </div>

                    <DynamicTextarea
                      form={form}
                      doctype={intern}
                      name={`internship_details.${index}.description`}
                    />
                  </section>
                ))}
              </>
            )}
          </section>

          {/* ================= WORK REFERENCE ================= */}
          <section className="space-y-4">
            <DynamicSelect
              form={form}
              doctype={doctype}
              name="do_you_have_any_work_references"
              required
              search={false}
            ></DynamicSelect>

            {do_you_have_any_work_references && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#293d8f]">
                    Work Reference
                  </h3>
                </div>

                <section className="space-y-5 border p-4">
                  {/* ROW 1 */}
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`full_name`}
                    ></DynamicInput>

                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`email`}
                    ></DynamicInput>

                    <DynamicPhoneInput
                      form={form}
                      doctype={doctype}
                      name={`work_experience_mobilenumber`}
                    />

                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`organization_name`}
                    ></DynamicInput>

                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`designation`}
                    ></DynamicInput>

                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`website`}
                    ></DynamicInput>
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name={`social_media_links`}
                    ></DynamicInput>
                  </div>
                </section>
              </>
            )}
            <section className="space-y-5">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Psychometric Questions
              </h3>

              <div className="rounded-md border border-red-300 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-600 text-lg">
                    <AlertCircle></AlertCircle>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-700">
                      Warning: AI-Generated Responses
                    </h3>

                    <p className="mt-1 text-sm text-red-700">
                      Detection of ChatGPT or other AI-generated content in
                      essay responses may lead to the rejection of your
                      application. Please ensure all answers are written in your
                      own words and accurately reflect your personal
                      experiences, opinions, and aspirations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Q1 (MCQ not textarea) */}
              <div className="space-y-2">
                <DynamicSelect
                  form={form}
                  doctype={doctype}
                  name="women_independence"
                  required
                  search={false}
                ></DynamicSelect>

                <DynamicTextarea
                  form={form}
                  doctype={doctype}
                  name="challenge_overcome"
                  required
                  maxWords={300}
                />
                <DynamicTextarea
                  form={form}
                  doctype={doctype}
                  name="career_aspirations"
                  required
                  maxWords={300}
                />
                <DynamicTextarea
                  form={form}
                  doctype={doctype}
                  name="explain_dedica"
                  required
                  maxWords={300}
                />
              </div>
            </section>
          </section>

          {/* ================= FOOTER ================= */}
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
