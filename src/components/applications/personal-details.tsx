"use client";

import { useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepComponentProps } from "./type";
import { useAccountStore } from "@/store/user.store";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { DynamicSelect } from "../common/select";
import { DynamicInput } from "../common/input";
import { DynamicDateInput } from "../common/date-input";
import { calculateAge } from "@/utils";
import { DynamicPhoneInput } from "../common/mobile-input";
import { DynamicYearInput } from "../common/year-input";
import { ApplicationFormFooter } from "./application-footer";
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
    email_id: z.email("Enter a valid email_id"),
    mobile_number: z.string().min(10, "Enter a valid mobile_number number"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    age_as_on_30th_june_2026: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    if_other_please_enter_here: z.string().optional(),
    physically_challenged: z.string().min(1, "Please select an option"),
    if_yes_please_specify: z.string().optional(),
    which_of_these_vedica_offerings_is_the_most_important_to_you: z
      .string("Select one option")
      .min(1, "Select one option"),
    where_did_you_hear_about_vedica_: z.string().min(1, "Required"),
    have_you_applied_to_vedica_before: z.string().min(1, "Required"),
    which_year: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    choose_the_one_that_describes_you: z
      .string()
      .min(1, "Please select an option"),
    how_do_you_plan_to_finance_your_education: z
      .string()
      .min(1, "Please select an option"),
    program: z.string("This field is required"),
  })
  .superRefine((data, ctx) => {
    console.log("Category:", JSON.stringify(data.category));
    if (
      data.physically_challenged === "Yes" &&
      !data.if_yes_please_specify?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["if_yes_please_specify"],
        message: "Please specify the disability",
      });
    }
    if (data.category === "Other" && !data.if_other_please_enter_here?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["if_other_please_enter_here"],
        message: "Please specify the category",
      });
    }

    if (
      data.have_you_applied_to_vedica_before === "Yes" &&
      !data.which_year?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["which_year"],
        message: "Please enter a valid date",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export function PersonalDetailsForm({
  onNext,
  onExit,
  onBack,
  step,
}: StepComponentProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      choose_the_one_that_describes_you: "",
      how_do_you_plan_to_finance_your_education: "",
      program: "PG Programme in Management Practice and Leadership",
      title: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email_id: "",
      mobile_number: "",
      date_of_birth: "",
      age_as_on_30th_june_2026: "",
      category: "",
      if_other_please_enter_here: "",
      physically_challenged: "",
      which_of_these_vedica_offerings_is_the_most_important_to_you: "",
      where_did_you_hear_about_vedica_: "",
      have_you_applied_to_vedica_before: "",
      which_year: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
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

  const onSubmit = async (values: FormValues) => {
    try {
      await handleSubmit(values);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };

  const { data: user } = useAccountStore();
  const onError = (err: any) => console.log(err);
  useEffect(() => {
    if (!user) return;

    const nameParts = (user.first_name ?? "").trim().split(/\s+/);
    form.setValue("first_name", nameParts[0] ?? "");
    form.setValue(
      "middle_name",
      nameParts.length > 1
        ? nameParts.slice(1).join(" ")
        : (user.middle_name ?? "."),
    );
    form.setValue("last_name", user.last_name);
    form.setValue("email_id", user.custom_emailss);
    form.setValue("mobile_number", user.custom_mobile_nos);
  }, [user]);

  const dobValue = form.watch("date_of_birth");

  useEffect(() => {
    if (!dobValue) {
      form.setValue("age_as_on_30th_june_2026", "");
      return;
    }
    form.setValue("age_as_on_30th_june_2026", calculateAge(dobValue), {
      shouldValidate: true,
    });
  }, [dobValue, form]);

  // useEffect(() => {
  //   const sub = form.watch((values, info) => {
  //     console.log("FORM WATCH", {
  //       field: info.name,
  //       type: info.type,
  //       dob: values.date_of_birth,
  //     });
  //   });

  //   return () => sub.unsubscribe();
  // }, [form]);

  const have_you_applied_to_vedica_before = form.watch(
    "have_you_applied_to_vedica_before",
  );
  const category = form.watch("category");
  const physically_challenged = form.watch("physically_challenged");
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold leading-tight text-[#293d8f]">
          Welcome to the Vedica Scholars Programme Application Process.
        </h2>

        <p className="text-[18px] font-semibold leading-tight text-[#293d8f]">
          You are applying for a full-time residential management programme in
          Delhi.
        </p>
      </div>

      {/* FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 px-4 py-5"
        >
          {/* TOP SELECTS */}
          <div className="grid gap-4 md:grid-cols-2 items-start">
            <DynamicSelect
              form={form}
              doctype={doctype}
              name="choose_the_one_that_describes_you"
              required
              search={false}
            />

            <DynamicSelect
              form={form}
              doctype={doctype}
              name="how_do_you_plan_to_finance_your_education"
              required
              search={false}
            />
          </div>

          {/* COURSE PREFERENCE */}
          <section className="space-y-4">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Course Preference
            </h3>

            <div className="max-w-[500px]">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="program"
                required
                search={false}
              />
            </div>
          </section>

          {/* PERSONAL DETAILS */}
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Personal Details
            </h3>

            {/* ROW 1 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start ">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="title"
                required
                disabled
                search={false}
              />

              <DynamicInput
                form={form}
                doctype={doctype}
                name="first_name"
                required
                disabled
              />

              <DynamicInput
                form={form}
                disabled
                doctype={doctype}
                name="middle_name"
              />

              <DynamicInput
                form={form}
                doctype={doctype}
                name="last_name"
                required
                disabled
              />
            </div>

            {/* ROW 2 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
              <DynamicInput
                disabled
                form={form}
                doctype={doctype}
                name="email_id"
                required
              />
              <DynamicPhoneInput
                disabled
                form={form}
                doctype={doctype}
                name="mobile_number"
                required
              />
              <DynamicDateInput
                form={form}
                doctype={doctype}
                name={"date_of_birth"}
                required
              />
              <DynamicInput
                form={form}
                doctype={doctype}
                name="age_as_on_30th_june_2026"
                readOnly
                label="Age as on 30 June 2026"
              />
            </div>

            {/* ROW 3 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="category"
                required
                search={false}
              ></DynamicSelect>
              {category === "Other" && (
                <DynamicInput
                  form={form}
                  doctype={doctype}
                  name="if_other_please_enter_here"
                  required
                ></DynamicInput>
              )}
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="physically_challenged"
                required
                search={false}
              ></DynamicSelect>

              {physically_challenged === "Yes" && (
                <DynamicInput
                  form={form}
                  doctype={doctype}
                  name="if_yes_please_specify"
                  required
                ></DynamicInput>
              )}
            </div>
          </section>
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Social Media Handles
            </h3>

            {/* ROW 1 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start ">
              {["facebook", "instagram", "linkedin", "twitter"].map((item) => (
                <DynamicInput form={form} doctype={doctype} name={item} />
              ))}
            </div>
          </section>
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Additional Information
            </h3>

            {/* EXTRA QUESTIONS */}
            <div className=" space-y-5">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="where_did_you_hear_about_vedica_"
                required
                search={false}
              ></DynamicSelect>

              <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 items-start">
                <DynamicSelect
                  form={form}
                  doctype={doctype}
                  name="have_you_applied_to_vedica_before"
                  required
                  search={false}
                ></DynamicSelect>

                {have_you_applied_to_vedica_before === "Yes" && (
                  <DynamicYearInput
                    form={form}
                    min={2015}
                    max={new Date().getFullYear()}
                    doctype={doctype}
                    name="which_year"
                    required
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="which_of_these_vedica_offerings_is_the_most_important_to_you"
              render={({ field }) => {
                const values = field.value || "";
                const toggleValue = (item: string) => {
                  field.onChange(item);
                };

                return (
                  <FormItem>
                    <p className="text-[12px] font-semibold text-black">
                      Which of these Vedica offerings is the most important to
                      you?
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
                      {[
                        "Career growth",
                        "Liberal Arts",
                        "Women Empowerment",
                        "Personal Growth",
                        "Shadow a Woman Leader Module",
                        "Curriculum",
                      ].map((item) => (
                        <label key={item} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={values === item}
                            onChange={() => toggleValue(item)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </section>

          {/* ACTIONS */}
          <ApplicationFormFooter
            form={form}
            onSave={handleSubmit}
            onBack={onBack}
            onNext={onNext}
            onExit={onExit}
            showBack={false}
          />
        </form>
      </Form>
    </div>
  );
}
