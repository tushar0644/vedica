"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAccountStore } from "@/store/user.store";
import PhoneInputWithCountry from "../ui/phone-input";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

import { DynamicInput } from "../common/input";
import { DynamicSelect } from "../common/select";
import { useScholarshipFormDocTypeStore } from "@/store/scholarship-form/doctype.store";
import { useScholarshipFormStore } from "@/store/scholarship-form/get.store";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { DynamicFileInput } from "../common/file-input";
import { DynamicTextarea } from "../common/textarea";
import { DynamicDateInput } from "../common/date-input";
import { useScholarshipTableFormDocTypeStore } from "@/store/scholarship-form/table-doctype.store";
import { DynamicPhoneInput } from "../common/mobile-input";
import { updateScholarshipForm } from "@/actions/scholarship-forms/update.action";
import { useParams, useRouter } from "next/navigation";

const siblingSchema = z.object({
  name1: z.string().optional(),
  highest_education: z.string().optional(),
  organisation: z.string().optional(),
  designation: z.string().optional(),
});

const referenceSchema = z.object({
  name1: z.string().min(1, "Reference name is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  current_designation: z.string().min(1, "Designation is required"),
});

const formSchema = z.object({
  application_id__vs_id: z.string().min(1, "Required"),
  title: z.string().min(1, "Required"),
  data_ptxx: z.string().min(2, "First name is required"),
  data_qmxu: z.string().min(2, "Last name is required"),
  data_yesr: z.string().min(2, "Scholarship category is required"),

  sibling_details: z.array(siblingSchema),

  number_of_earning_members_in_the_family: z.string().optional(),

  total_annual_family_income: z
    .string()
    .min(1, "Total annual family income is required"),

  any_additional_sources_of_family_income: z.string().optional(),

  mention_ownership_of_residence: z.string().optional(),

  // last_3_years_itrs_of_all_earning_members: z.array(z.string()).optional(),

  // last_3_months_salary_slips_of_all_earning_members: z
  //   .array(z.string())
  //   .optional(),

  // last_6_months_bank_statements_all_earning_members_and_applicant: z
  //   .array(z.string())
  //   .optional(),

  // proof_of_employment_for_all_earning_members_idoffer_letter: z
  //   .array(z.string())
  //   .optional(),

  // ewsncl_certificate_if_applicable: z.array(z.string()).optional(),

  // ownership_of_residence_ownancestralpartial: z.array(z.string()).optional(),

  last_3_years_itrs_of_all_earning_members: z.string(),

  last_3_months_salary_slips_of_all_earning_members: z.string(),
  last_6_months_bank_statements_all_earning_members_and_applicant: z.string(),
  proof_of_employment_for_all_earning_members_idoffer_letter: z.string(),
  ewsncl_certificate_if_applicable: z.string(),

  ownership_of_residence_ownancestralpartial: z.string(),

  properties_details: z.string().optional(),

  annual_ugpg_fee_paid_if_applicable: z.string().optional(),

  annual_schoolcollege_fee_paid_for_siblings: z.string().optional(),

  details_of_outstanding_loansemis: z.string().optional(),

  other_annual_family_expenses: z.string().optional(),

  sop: z
    .string()
    .max(400, "Statement of Purpose cannot exceed 400 words")
    .optional(),

  portfolio_of_extracurricular_achievements_if_any: z.string().optional(),

  academic_professional: z
    .array(referenceSchema)
    .min(2, "Minimum 2 are required"),

  applicant_name: z.string().min(1, "Applicant name is required"),

  date: z.string("Required Field"),

  i_agree: z.boolean("Required Field"),
});

type FormValues = z.infer<typeof formSchema>;

export function ScholarshipForm() {
  const uploadFields = [
    {
      name: "last_3_years_itrs_of_all_earning_members",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "last_3_months_salary_slips_of_all_earning_members",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "last_6_months_bank_statements_all_earning_members_and_applicant",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "proof_of_employment_for_all_earning_members_idoffer_letter",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "ewsncl_certificate_if_applicable",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "ownership_of_residence_ownancestralpartial",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
    {
      name: "properties_details",
      required: false,
      maxSizeMB: 5,
      accept: ".jpeg,.jpg,.png,.pdf",
    },
  ];
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Family Information
      number_of_earning_members_in_the_family: "",
      total_annual_family_income: "",
      // any_additional_sources_of_family_income: "",
      mention_ownership_of_residence: "",

      // Upload Documents
      // last_3_years_itrs_of_all_earning_members: [],
      // last_3_months_salary_slips_of_all_earning_members: [],
      // last_6_months_bank_statements_all_earning_members_and_applicant: [],
      // proof_of_employment_for_all_earning_members_idoffer_letter: [],
      // ewsncl_certificate_if_applicable: [],
      // ownership_of_residence_ownancestralpartial: [],

      last_3_years_itrs_of_all_earning_members: "",
      last_3_months_salary_slips_of_all_earning_members: "",
      last_6_months_bank_statements_all_earning_members_and_applicant: "",
      proof_of_employment_for_all_earning_members_idoffer_letter: "",
      ewsncl_certificate_if_applicable: "",
      ownership_of_residence_ownancestralpartial: "",

      // Additional Requirements
      annual_ugpg_fee_paid_if_applicable: "",
      annual_schoolcollege_fee_paid_for_siblings: "",
      details_of_outstanding_loansemis: "",
      other_annual_family_expenses: "",
      properties_details: "",
      sop: "",
      portfolio_of_extracurricular_achievements_if_any: "",

      // Siblings
      sibling_details: [],

      // academic_professional
      academic_professional: [],

      // Declaration
      applicant_name: "",
      date: new Date().toISOString().split("T")[0],
      i_agree: false,
      data_yesr: "",
    },
  });
  const { scholarshipId } = useParams();
  const { replace } = useRouter();
  const onSubmit = async (values: FormValues) => {
    try {
      const res = await updateScholarshipForm({
        id: scholarshipId as string,
        data: values,
      });
      toast.info(res.message);
      replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  const { data: user, isLoading: userLoading } = useAccountStore();
  const { data: application, isLoading: formLoading } =
    useApplicationFormStore();
  const { data: doctype, isLoading: doctypeLoading } =
    useScholarshipFormDocTypeStore();
  const { data: tableDoctype, isLoading: tableDoctypeLoading } =
    useScholarshipTableFormDocTypeStore();
  const { data } = useScholarshipFormStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!data || !user || initialized.current) return;
    console.log(data);
    form.reset({
      ...data,
      applicant_name: [user.first_name, user?.last_name].join(" "),
      date: new Date().toISOString().split("T")[0],
      i_agree: data.i_agree === 1,
      sibling_details:
        data.sibling_details.length === 0
          ? [
              {
                name1: "",
                highest_education: "",
                organisation: "",
                designation: "",
              },
            ]
          : data.sibling_details,
      academic_professional:
        data.sibling_details.length === 0
          ? [
              {
                name1: "",
                contact_number: "",
                current_designation: "",
              },
              {
                name1: "",
                contact_number: "",
                current_designation: "",
              },
            ]
          : data.academic_professional,
    });
    initialized.current = true;
  }, [data, form, user]);
  const addSibling = () => {
    const current = form.getValues("sibling_details") || [];
    if (current.length >= 5) {
      toast.error("Maximum 5 sibling details allowed");
      return;
    }
    form.setValue("sibling_details", [
      ...current,
      {
        name1: "",
        designation: "",
        highest_education: "",
        organisation: "",
      },
    ]);
  };

  const removeSibling = (index: number) => {
    const current = form.getValues("sibling_details") || [];
    form.setValue(
      "sibling_details",
      current.filter((_: any, i: number) => i !== index),
    );
  };

  const noOfReference = (form.watch("academic_professional") || []).length;
  const addReference = () => {
    const current = form.getValues("academic_professional") || [];
    if (current.length >= 5) {
      toast.error("Maximum 5 sibling details allowed");
      return;
    }
    form.setValue("academic_professional", [
      ...current,
      {
        name1: "",
        contact_number: "",
        current_designation: "",
      },
    ]);
  };

  const removeReference = (index: number) => {
    const current = form.getValues("academic_professional") || [];
    form.setValue(
      "academic_professional",
      current.filter((_: any, i: number) => i !== index),
    );
  };

  useEffect(() => {
    if (!user || !application) return;
    form.setValue("title", application.title);
    form.setValue("application_id__vs_id", application.name);
    form.setValue("data_ptxx", user.first_name);
    form.setValue("data_qmxu", user.last_name);
    form.setValue(
      "applicant_name",
      [user.first_name, user.last_name].join(" "),
    );
  }, [user, application]);

  const isLoading =
    formLoading || userLoading || doctypeLoading || tableDoctypeLoading;

  if (isLoading) {
    return (
      <div className="flex fixed top-0 left-0 z-100 backdrop-blur-xl h-screen w-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#293d8f] border-t-transparent" />
          <h3 className="text-lg font-semibold text-[#293d8f]">
            Loading Form Details
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Please wait while we load your application...
          </p>
        </div>
      </div>
    );
  }
  const { sibling, reference } = tableDoctype!!;
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step 1 of 1
        </div>

        <p className="text-sm mt-4 font-semibold leading-tight text-[#293d8f]">
          Vedica is committed to supporting students in overcoming financial
          barriers to postgraduate education. Our mission to empower more women
          in India towards financial independence is most effectively realised
          when we provide such pathways ourselves. In return, Vedica expects
          commitment, trust, and responsibility from scholars in managing their
          own finances. Our scholarship is open only to candidates who have
          confirmed their seat in the upcoming cohort by submitting a signed
          acceptance letter and security deposit. Please note that the Vedica
          Scholarship does not cover hostel and boarding fees. Tuition fee
          waivers are granted on a combination of factors: need, merit, and
          diversity.
        </p>
      </div>

      {/* FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-5"
        >
          {/* TOP SELECTS */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2  lg:grid-cols-4  items-start">
            <DynamicInput
              doctype={doctype}
              form={form}
              name="application_id__vs_id"
              required
              disabled
            ></DynamicInput>
            <DynamicInput
              doctype={doctype}
              form={form}
              name="title"
              required
              disabled
            ></DynamicInput>
            <DynamicInput
              doctype={doctype}
              form={form}
              name="data_ptxx"
              required
              disabled
            ></DynamicInput>
            <DynamicInput
              doctype={doctype}
              form={form}
              name="data_qmxu"
              required
              disabled
            ></DynamicInput>

            <DynamicSelect
              className="col-span-1 sm:col-span-2  lg:col-span-4"
              doctype={doctype}
              form={form}
              name="data_yesr"
              required
            ></DynamicSelect>
          </div>

          {/* COURSE PREFERENCE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Sibling(s) Details
              </h3>

              <Button
                type="button"
                onClick={addSibling}
                className="rounded-none bg-[#0b6b63]"
              >
                + More
              </Button>
            </div>
            {form.watch("sibling_details")?.map((_: any, index: number) => (
              <>
                <div key={index} className="border p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">
                      Sibling {index + 1}
                    </h4>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => removeSibling(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  {/* ROW 1 - 2 INPUTS */}
                  <div className="grid sm:grid-cols-2  md:grid-cols-4 gap-4">
                    <DynamicInput
                      doctype={sibling}
                      form={form}
                      name={`sibling_details.${index}.name1`}
                    ></DynamicInput>
                    <DynamicInput
                      doctype={sibling}
                      form={form}
                      name={`sibling_details.${index}.highest_education`}
                    ></DynamicInput>
                    <DynamicInput
                      doctype={sibling}
                      form={form}
                      name={`sibling_details.${index}.organisation`}
                    ></DynamicInput>
                    <DynamicInput
                      doctype={sibling}
                      form={form}
                      name={`sibling_details.${index}.designation`}
                    ></DynamicInput>
                  </div>
                </div>
              </>
            ))}
          </section>

          {/* PERSONAL DETAILS */}
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Family & Financial Information
            </h3>

            {/* ROW 1 */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start ">
              <DynamicInput
                doctype={doctype}
                form={form}
                name="number_of_earning_members_in_the_family"
              ></DynamicInput>
              <DynamicInput
                doctype={doctype}
                form={form}
                name="total_annual_family_income"
                required
              ></DynamicInput>
              <DynamicInput
                doctype={doctype}
                form={form}
                name="any_additional_sources_of_family_income"
              ></DynamicInput>
              <DynamicSelect
                className="col-span-1 sm:col-span-2  lg:col-span-3"
                doctype={doctype}
                form={form}
                name="mention_ownership_of_residence"
              ></DynamicSelect>
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Upload Documents
              </h3>
            </div>
            <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 items-start">
              {uploadFields.map((item) => (
                <DynamicFileInput
                  key={item.name}
                  form={form}
                  doctype={doctype}
                  name={item.name}
                  required={item.required}
                  maxSizeMB={item.maxSizeMB}
                  accept={item.accept}
                  // multiple
                />
              ))}
            </div>
          </section>
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Additional Requirements
            </h3>
            {/* ROW 1 */}
            <div className="grid gap-4 md:grid-cols-2  items-start ">
              <DynamicInput
                doctype={doctype}
                form={form}
                name="annual_ugpg_fee_paid_if_applicable"
              ></DynamicInput>
              <DynamicInput
                doctype={doctype}
                form={form}
                name="annual_schoolcollege_fee_paid_for_siblings"
              ></DynamicInput>

              <DynamicInput
                doctype={doctype}
                form={form}
                name="other_annual_family_expenses"
              ></DynamicInput>
              <DynamicInput
                doctype={doctype}
                form={form}
                name="details_of_outstanding_loansemis"
              ></DynamicInput>
            </div>
            <DynamicTextarea doctype={doctype} form={form} name="sop" />

            <DynamicInput
              doctype={doctype}
              form={form}
              name="portfolio_of_extracurricular_achievements_if_any"
            ></DynamicInput>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Academic/Professional
              </h3>
              <Button
                type="button"
                onClick={addReference}
                className="rounded-none bg-[#0b6b63]"
              >
                + More
              </Button>
            </div>
            {form
              .watch("academic_professional")
              ?.map((_: any, index: number) => (
                <>
                  <div key={index} className="border p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        Academic/Professional {index + 1}
                      </h4>
                      {noOfReference > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => removeReference(index)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>

                    {/* ROW 1 - 2 INPUTS */}
                    <div className="grid sm:grid-cols-3  gap-4 items-start">
                      <DynamicInput
                        doctype={reference}
                        form={form}
                        name={`academic_professional.${index}.name1`}
                        required
                      ></DynamicInput>
                      <DynamicPhoneInput
                        doctype={reference}
                        required
                        form={form}
                        name={`academic_professional.${index}.contact_number`}
                      />
                      <DynamicInput
                        doctype={reference}
                        required
                        form={form}
                        name={`academic_professional.${index}.current_designation`}
                      ></DynamicInput>{" "}
                    </div>
                  </div>
                </>
              ))}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Declaration
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm leading-7 text-[#444]">
                I declare that I have reviewed the Scholarship Form and will not
                request changes or additions post submission. I am fully aware
                that any false statements may lead to denial of admission
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <DynamicInput
                doctype={doctype}
                form={form}
                name="applicant_name"
                disabled
              ></DynamicInput>
              <DynamicDateInput
                doctype={doctype}
                form={form}
                name="date"
                disabled
              />

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
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-end pt-6">
            <Button
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              type="submit"
              className="h-9 rounded-none bg-[#ff6b1a] px-8 text-white hover:bg-[#ea5d10]"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
