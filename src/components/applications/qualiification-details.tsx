"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { StepComponentProps } from "./type";
import { Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useApplication } from "./provider";
import { DynamicSelect } from "../common/select";
import { DynamicInput } from "../common/input";
import { DynamicYearInput } from "../common/year-input";
import { useApplicationTableFormDocTypeStore } from "@/store/application-form/table-doctype.store";
import { useQualificationFormDocTypeStore } from "@/store/qualification-form/doctype.store";
import { useQualificationFormStore } from "@/store/qualification-form/get.store";
import { ApplicationFormFooter } from "./application-footer";
import { getAllCities } from "@/actions/extras/states-cities";

const requiredFloat = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.number({
    error: (issue) => {
      if (issue.input === undefined) return "Required";
      return "Must be a valid number";
    },
  }),
);

const requiredNumberOption = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    return val;
  },
  z.coerce
    .number({
      error: "Must be a number",
    })
    .optional(),
);

const requiredFloatOption = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    return val;
  },
  z.coerce
    .number({
      error: "Must be a valid number",
    })
    .optional(),
);
const yearSchema = z
  .string("Required")
  .regex(/^\d{4}$/, "Enter a valid 4-digit year");
const undergraduateSchema = z.object({
  name_of_institutions_undergraduate: z.string("Required").min(1, "Required"),
  university_undergraduate: z.string("Required").min(1, "Required"),
  if_other_please_specify_undergraduate: z.string().optional(),
  streams_undergradaute: z.string("Required").min(1, "Required"),
  if_other_please_specify_for_stream: z.string().optional(),
  course_undergraduate: z.string("Required").min(1, "Required"),
  city: z.string("Required").min(1, "Required"),
  other_city_under_graduate_details: z.string().optional(),
  year_of_passing_undergraduate: yearSchema,
  marking_scheme_undergraduate: z.string("Required").min(1, "Required"),
  maximum_marks_under_graduate: requiredNumberOption,
  marks_obtaineds_undergraduate: requiredNumberOption,
  obtained_percentage_cgpa_undergraduate: requiredFloat,
});
const pgSchema = z.object({
  name_of_institutions: z.string("Required").min(1, "Required"),
  university: z.string("Required").min(1, "Required"),
  if_other_please_specify: z.string("Required").optional(),
  streams: z.string("Required").min(1, "Required"),
  if_other_please_specify_for_stream: z.string().optional(),
  course_name: z.string().optional(),
  city: z.string("Required").min(1, "Required"),
  if_other_post_graduate_details: z.string().optional(),
  year_of_passing: yearSchema,
  marking_scheme: z.string("Required").min(1, "Required"),
  maximum_marks: requiredNumberOption, // number
  marks_obtaineds: requiredNumberOption, // number
  obtained_percentagecgpas: requiredFloat, // float
});
const competitiveExamSchema = z.object({
  examination: z.string("Required").min(1, "Required"),
  year: yearSchema,
  score: requiredNumberOption, // number
  percentile: requiredFloatOption, // float
});

export const qualificationDetailsSchema = z
  .object({
    name_of_institution: z.string("Required").min(1, "Required"),
    board: z.string("Required").min(1, "Required"),
    if_other_please_enter_resaon: z.string().optional(),
    year_of_passing: yearSchema,
    marking_scheme: z.string("Required").min(1, "Required"),

    maximum_marks: requiredNumberOption, // number
    marks_obtained: requiredNumberOption, // number
    obtained_percentage_cgpa: requiredFloat, // float

    medium_of_education: z.string("Required").min(1, "Required"),
    if_other_please_specify: z.string("Required").optional(),
    // after_xth_education: z.enum(AFTER_XTH),

    name_of_institution_12: z.string("Required").min(1, "Required"),
    board_12: z.string("Required").min(1, "Required"),
    if_other_please_enter_reason_12: z.string().optional(),
    stream_12: z.string("Required").min(1, "Required"),
    year_of_passing_12: yearSchema,
    marking_scheme_12: z.string("Required").min(1, "Required"),

    maximum_marks_12: requiredNumberOption, // number
    marks_obtained_12: requiredNumberOption, // number
    obtained_percentage_cgpa_12: requiredFloat, // float
    medium_of_education_12: z.string("Required").min(1, "Required"),
    other_medium_for_12: z.string("Required").optional(),

    institute_diploma: z.string("Required").optional(),
    rollno_diploma: z.string("Required").optional(),
    year_passing_diploma: z.string("Required").optional(),
    marking_schema_diploma: z.string("Required").optional(),
    maximum_marks_diploma: z.string("Required").optional(), // number
    marks_obtained_diploma: z.string("Required").optional(), // number
    percentage_diploma: z.string("Required").optional(), // float
    medium_education_diploma: z.string("Required").optional(),
    table_ug: z.array(undergraduateSchema).default([]),
    degree_completed: z.string("Required").default("No"),
    pg_enabled: z.string("Required").default("Yes"),
    table_pg: z.array(pgSchema).max(2).default([]),

    have_you_taken_any_competitive_exams_before: z.string().default("No"),
    competive: z.array(competitiveExamSchema).max(5).default([]),
  })
  .superRefine((data, ctx) => {
    const addError = (path: string | (string | number)[], message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: Array.isArray(path) ? path : path.split("."),
        message,
      });
    };

    /* =====================================================
     * X VALIDATIONS
     * ===================================================== */

    if (data.marking_scheme === "Percentage") {
      if (data.maximum_marks === undefined) {
        addError("maximum_marks", "Required");
      }

      if (data.marks_obtained === undefined) {
        addError("marks_obtained", "Required");
      }
    }
    if (
      data.marks_obtained &&
      data.maximum_marks &&
      data.marks_obtained > data.maximum_marks
    ) {
      addError("marks_obtained", "Obtained marks cannot exceed maximum marks");
    }

    if (data.obtained_percentage_cgpa > 100) {
      addError("obtained_percentagecgpa", "Percentage/CGPA cannot exceed 100");
    }

    if (
      data.medium_of_education === "Other" &&
      !data.if_other_please_specify?.trim()
    ) {
      addError("if_other_please_specify", "Please specify");
    }

    /* =====================================================
     * XII VALIDATIONS
     * ===================================================== */
    if (data.marking_scheme_12 === "Percentage") {
      if (data.maximum_marks_12 === undefined) {
        addError("maximum_marks_12", "Required");
      }

      if (data.marks_obtained_12 === undefined) {
        addError("marks_obtained_12", "Required");
      }
    }

    if (Number(data.marks_obtained_12) > Number(data.maximum_marks_12)) {
      addError(
        "marks_obtained_12",
        "Obtained marks cannot exceed maximum marks",
      );
    }

    if (Number(data.obtained_percentage_cgpa_12) > 100) {
      addError(
        "obtained_percentage_cgpa_12",
        "Percentage/CGPA cannot exceed 100",
      );
    }

    if (
      data.medium_of_education_12 === "Other" &&
      !data.other_medium_for_12?.trim()
    ) {
      addError("other_medium_for_12", "Please specify");
    }
    /* =====================================================
     * DIPLOMA VALIDATIONS
     * ===================================================== */

    if (
      data.maximum_marks_diploma &&
      data.marks_obtained_diploma &&
      Number(data.marks_obtained_diploma) > Number(data.maximum_marks_diploma)
    ) {
      addError(
        "marks_obtained_diploma",
        "Obtained marks cannot exceed maximum marks",
      );
    }

    /* =====================================================
     * UG VALIDATIONS
     * ===================================================== */

    if (data.table_ug.length > 2) {
      addError("table_ug", "Maximum 2 undergraduate qualifications allowed");
    }

    data.table_ug.forEach((ug, index) => {
      if (ug.marking_scheme_undergraduate === "Percentage") {
        if (ug.maximum_marks_under_graduate === undefined) {
          addError(
            ["table_ug", index, "maximum_marks_under_graduate"],
            "Required",
          );
        }

        if (ug.marks_obtaineds_undergraduate === undefined) {
          addError(
            ["table_ug", index, "marks_obtaineds_undergraduate"],
            "Required",
          );
        }
      }
      if (
        Number(ug.marks_obtaineds_undergraduate) >
        Number(ug.maximum_marks_under_graduate)
      ) {
        addError(
          ["table_ug", index, "marks_obtaineds_undergraduate"],
          "Obtained marks cannot exceed maximum marks",
        );
      }

      if (Number(ug.obtained_percentage_cgpa_undergraduate) > 100) {
        addError(
          ["table_ug", index, "obtained_percentage_cgpa_undergraduate"],
          "Percentage/CGPA cannot exceed 100",
        );
      }

      if (
        ug.university_undergraduate === "Other" &&
        !ug.if_other_please_specify_undergraduate?.trim()
      ) {
        addError(
          ["table_ug", index, "if_other_please_specify_undergraduate"],
          "Please specify university",
        );
      }

      if (
        ug.streams_undergradaute === "Other" &&
        !ug.if_other_please_specify_for_stream?.trim()
      ) {
        addError(
          ["table_ug", index, "if_other_please_specify_for_stream"],
          "Please specify stream",
        );
      }

      if (
        ug.city === "Other" &&
        !ug.other_city_under_graduate_details?.trim()
      ) {
        addError(
          ["table_ug", index, "other_city_under_graduate_details"],
          "Please specify city",
        );
      }
    });

    /* =====================================================
     * PG VALIDATIONS
     * ===================================================== */

    if (data.pg_enabled === "Yes") {
      if (data.table_pg.length > 2) {
        addError("table_pg", "Maximum 2 postgraduate qualifications allowed");
      }

      data.table_pg.forEach((pg, index) => {
        if (pg.marking_scheme === "Percentage") {
          if (pg.maximum_marks === undefined) {
            addError(["table_pg", index, "maximum_marks"], "Required");
          }

          if (pg.marks_obtaineds === undefined) {
            addError(["table_pg", index, "marks_obtaineds"], "Required");
          }
        }
        if (Number(pg.marks_obtaineds) > Number(pg.maximum_marks)) {
          addError(
            ["table_pg", index, "marks_obtaineds"],
            "Obtained marks cannot exceed maximum marks",
          );
        }

        if (Number(pg.obtained_percentagecgpas) > 100) {
          addError(
            ["table_pg", index, "obtained_percentagecgpas"],
            "Percentage/CGPA cannot exceed 100",
          );
        }

        if (pg.university === "Other" && !pg.if_other_please_specify?.trim()) {
          addError(
            ["table_pg", index, "if_other_please_specify"],
            "Please specify university",
          );
        }

        if (
          pg.streams === "Other" &&
          !pg.if_other_please_specify_for_stream?.trim()
        ) {
          addError(
            ["table_pg", index, "if_other_please_specify_for_stream"],
            "Please specify stream",
          );
        }
        if (pg.city === "Other" && !pg.if_other_post_graduate_details?.trim()) {
          addError(
            ["table_pg", index, "if_other_post_graduate_details"],
            "Please specify city",
          );
        }
      });
    }

    /* =====================================================
     * COMPETITIVE EXAMS VALIDATIONS
     * ===================================================== */

    if (data.have_you_taken_any_competitive_exams_before === "Yes") {
      if (data.competive.length > 5) {
        addError("competive", "Maximum 5 competitive exams allowed");
      }

      data.competive.forEach((exam, index) => {
        if (exam.percentile !== undefined && Number(exam.percentile) > 100) {
          addError(
            ["competive", index, "percentile"],
            "Percentile cannot exceed 100",
          );
        }
      });
    }

    /* =====================================================
     * YEAR GAP VALIDATIONS
     * ===================================================== */

    const xYear = Number(data.year_of_passing);
    const xiiYear = Number(data.year_of_passing_12);

    // X -> XII minimum 2 years
    if (!isNaN(xYear) && !isNaN(xiiYear)) {
      if (xiiYear - xYear < 2) {
        addError(
          "year_of_passing_12",
          "Class XII passing year must be at least 2 years after Class X",
        );
      }
    }

    // XII -> First UG minimum 3 years
    data.table_ug.forEach((ug, index) => {
      const ugYear = Number(ug.year_of_passing_undergraduate);

      if (index === 0) {
        if (!isNaN(xiiYear) && !isNaN(ugYear)) {
          if (ugYear - xiiYear < 3) {
            addError(
              ["table_ug", index, "year_of_passing_undergraduate"],
              "UG passing year must be at least 3 years after Class XII",
            );
          }
        }
      }

      // UG -> UG minimum 3 years
      if (index > 0) {
        const previousUgYear = Number(
          data.table_ug[index - 1].year_of_passing_undergraduate,
        );

        if (!isNaN(previousUgYear) && !isNaN(ugYear)) {
          if (ugYear - previousUgYear < 3) {
            addError(
              ["table_ug", index, "year_of_passing_undergraduate"],
              "Each UG qualification must be at least 3 years after the previous UG qualification",
            );
          }
        }
      }
    });

    if (
      data.pg_enabled === "Yes" &&
      data.table_pg.length > 0 &&
      data.table_ug.length > 0
    ) {
      const lastUgYear = Number(
        data.table_ug[data.table_ug.length - 1].year_of_passing_undergraduate,
      );

      data.table_pg.forEach((pg, index) => {
        const pgYear = Number(pg.year_of_passing);

        if (index === 0) {
          if (!isNaN(lastUgYear) && !isNaN(pgYear)) {
            if (pgYear - lastUgYear < 2) {
              addError(
                ["table_pg", index, "year_of_passing"],
                "PG passing year must be at least 2 years after UG",
              );
            }
          }
        }

        // PG -> PG minimum 2 years
        if (index > 0) {
          const previousPgYear = Number(
            data.table_pg[index - 1].year_of_passing,
          );

          if (!isNaN(previousPgYear) && !isNaN(pgYear)) {
            if (pgYear - previousPgYear < 2) {
              addError(
                ["table_pg", index, "year_of_passing"],
                "Each PG qualification must be at least 2 years after the previous PG qualification",
              );
            }
          }
        }
      });
    }
  });

export function QualificationDetailsForm({
  onNext,
  onBack,
  onExit,
  step,
}: StepComponentProps) {
  const form = useForm<any>({
    resolver: zodResolver(qualificationDetailsSchema),

    // Xth

    defaultValues: {
      // Xth
      name_of_institution: "",
      board: "",
      year_of_passing: "",
      marking_scheme: "",
      maximum_marks: "",
      marks_obtained: "",
      obtained_percentage_cgpa: "",
      medium_of_education: "",
      if_other_please_specify: "",
      // after_xth_education: "XII",

      // XII
      name_of_institution_12: "",
      board_12: "",
      stream_12: "",
      year_of_passing_12: "",
      marking_scheme_12: "",
      maximum_marks_12: "",
      marks_obtained_12: "",
      obtained_percentage_cgpa_12: "",
      medium_of_education_12: "",
      other_medium_for_12: "",
      // Diploma
      institute_diploma: "",
      rollno_diploma: "",
      year_passing_diploma: "",
      marking_schema_diploma: "",
      maximum_marks_diploma: "",
      marks_obtained_diploma: "",
      percentage_diploma: "",
      medium_education_diploma: "",

      degree_completed: "No",

      // PG
      pg_enabled: "No",

      // Competitive Exams
      have_you_taken_any_competitive_exams_before: "No",
      table_pg: [],
      table_ug: [],
      competive: [],
    },
  });

  const { data: doctype } = useQualificationFormDocTypeStore();
  const { data } = useQualificationFormStore();
  const { data: tableDoctype } = useApplicationTableFormDocTypeStore();
  const { handleQualificationFormSubmit } = useApplication();
  const initialized = React.useRef(false);
  const { pg, competitive, ug } = tableDoctype!!;
  const [cities, setCities] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await getAllCities();

      setCities(res.cities);
    })();
  }, [getAllCities]);
  React.useEffect(() => {
    if (!data || initialized.current) return;
    // console.log(data);
    form.reset({
      ...data,
      table_ug:
        data.table_ug.length === 0
          ? [
              {
                name_of_institutions_undergraduate: "",
                university_undergraduate: "",
                if_other_please_specify_undergraduate: "",
                streams_undergradaute: "",
                if_other_please_specify_for_stream: "",
                course_undergraduate: "",
                city: "",
                year_of_passing_undergraduate: "",
                marking_scheme_undergraduate: "",
                maximum_marks_under_graduate: "",
                marks_obtaineds_undergraduate: "",
                obtained_percentage_cgpa_undergraduate: "",
              },
            ]
          : data.table_ug,
      table_pg: data.table_pg.length === 0 ? [] : data.table_pg,
    });
    initialized.current = true;
  }, [data, form]);

  const onSubmit = async (values: any) => {
    try {
      await handleQualificationFormSubmit(values);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };
  const addPg = () => {
    const current = form.getValues("table_pg") || [];

    form.setValue("table_pg", [
      ...current,
      {
        name_of_institution: "",
        university: "",
        if_other_please_specify: "",
        streams: "",
        if_other_please_specify_for_stream: "",
        course_name: "",
        city: "",
        year_of_passing: "",
        marking_scheme: "",
        maximum_marks: "",
        marks_obtaineds: "",
        obtained_percentagecgpas: 0,
      },
    ]);
  };

  const removePg = (index: number) => {
    const current = form.getValues("table_pg") || [];
    // @ts-ignore
    const updated = current.filter((_, i) => i !== index);

    form.setValue("table_pg", updated, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const addUg = () => {
    const current = form.getValues("table_ug") || [];

    form.setValue("table_ug", [
      ...current,
      {
        name_of_institutions_undergraduate: "",
        university_undergraduate: "",
        if_other_please_specify_undergraduate: "",
        streams_undergradaute: "",
        if_other_please_specify_for_stream: "",
        course_undergraduate: "",
        city: "",
        year_of_passing_undergraduate: "",
        marking_scheme_undergraduate: "",
        maximum_marks_under_graduate: "",
        marks_obtaineds_undergraduate: "",
        obtained_percentage_cgpa_undergraduate: "",
      },
    ]);
  };

  const removeUg = (index: number) => {
    const current = form.getValues("table_ug") || [];
    // @ts-ignore
    const updated = current.filter((_, i) => i !== index);

    form.setValue("table_ug", updated, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const addCompetitiveExam = () => {
    const current = form.getValues("competive") || [];

    form.setValue("competive", [
      ...current,
      {
        examination: "",
        year: "",
        score: "",
        percentile: "",
      },
    ]);
  };

  const removeCompetitiveExam = (index: number) => {
    const current = form.getValues("competive") || [];

    form.setValue(
      "competive",
      current.filter((_: any, i: number) => i !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };
  const board10th = form.watch("board");
  const board12th = form.watch("board_12");
  const givenCpExam = form.watch("have_you_taken_any_competitive_exams_before");
  const onError = (val: any) => {
    console.log(val);
  };
  return (
    <div className="border border-[#d8d8d8] bg-white">
      {/* HEADER */}
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Qualification Details
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 px-4 py-5"
        >
          {/* XTH DETAILS */}
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Xth Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start ">
              <DynamicInput
                form={form}
                doctype={doctype}
                name="name_of_institution"
                required
              ></DynamicInput>
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="board"
                required
              ></DynamicSelect>
              {board10th === "Other" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="if_other_please_enter_resaon"
                    required
                  ></DynamicInput>
                </>
              )}

              <DynamicYearInput
                form={form}
                doctype={doctype}
                name="year_of_passing"
                required
              />

              <DynamicSelect
                form={form}
                doctype={doctype}
                name="marking_scheme"
                required
                search={false}
              ></DynamicSelect>

              {form.watch("marking_scheme") === "Percentage" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="maximum_marks"
                    required
                  ></DynamicInput>

                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="marks_obtained"
                    required
                  ></DynamicInput>
                </>
              )}

              <DynamicInput
                form={form}
                doctype={doctype}
                name="obtained_percentage_cgpa"
                required
              ></DynamicInput>

              <DynamicSelect
                form={form}
                doctype={doctype}
                name="medium_of_education"
                required
              ></DynamicSelect>
              {form.watch("medium_of_education") === "Other" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="if_other_please_specify"
                    required
                  ></DynamicInput>
                </>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              XII Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
              <DynamicInput
                form={form}
                doctype={doctype}
                name="name_of_institution_12"
                required
              />
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="board_12"
                required
              ></DynamicSelect>
              {board12th === "Other" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="if_other_please_enter_reason_12"
                    required
                  ></DynamicInput>
                </>
              )}

              <DynamicInput
                form={form}
                doctype={doctype}
                name="stream_12"
                required
              />
              <DynamicYearInput
                form={form}
                doctype={doctype}
                name="year_of_passing_12"
                required
              />
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="marking_scheme_12"
                required
                search={false}
              ></DynamicSelect>
              {form.watch("marking_scheme_12") === "Percentage" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="maximum_marks_12"
                    required
                  ></DynamicInput>

                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="marks_obtained_12"
                    required
                  ></DynamicInput>
                </>
              )}

              <DynamicInput
                form={form}
                doctype={doctype}
                name="obtained_percentage_cgpa_12"
                required
              ></DynamicInput>

              <DynamicSelect
                form={form}
                doctype={doctype}
                name="medium_of_education_12"
                required
              ></DynamicSelect>
              {form.watch("medium_of_education_12") === "Other" && (
                <>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="other_medium_for_12"
                    required
                  ></DynamicInput>
                </>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Under Graduate Details
              </h3>

              <Button
                type="button"
                className="rounded-none bg-[#0b6b63] hover:bg-[#0b6b63]"
                size="sm"
                onClick={() => addUg()}
              >
                + More
              </Button>
            </div>
            {/* @ts-ignore */}
            {form.watch("table_ug")?.map((_, index) => (
              <section key={index} className="space-y-5 border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#293d8f]">
                    Under Graduate {index + 1}
                  </h4>

                  <Button
                    className="rounded-none"
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => removeUg(index)}
                  >
                    <Trash2></Trash2>
                  </Button>
                </div>

                {/* ROW 1 */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
                  <DynamicInput
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.name_of_institutions_undergraduate`}
                    required
                  />
                  <DynamicSelect
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.university_undergraduate`}
                    required
                  />
                  {form.watch(`table_ug.${index}.university_undergraduate`) ===
                    "Other" && (
                    <DynamicInput
                      form={form}
                      doctype={ug}
                      name={`table_ug.${index}.if_other_please_specify_undergraduate`}
                      required
                    />
                  )}
                  <DynamicSelect
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.streams_undergradaute`}
                    required
                  />
                  {form.watch(`table_ug.${index}.streams_undergradaute`) ===
                    "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={ug}
                        name={`table_ug.${index}.if_other_please_specify_for_stream`}
                        required
                      ></DynamicInput>
                    </>
                  )}
                  <DynamicInput
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.course_undergraduate`}
                    required
                  ></DynamicInput>
                  <DynamicSelect
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.city`}
                    required
                    options={cities}
                  ></DynamicSelect>
                  {form.watch(`table_ug.${index}.city`) === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={ug}
                        name={`table_ug.${index}.other_city_under_graduate_details`}
                        required
                      ></DynamicInput>
                    </>
                  )}
                  <DynamicYearInput
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.year_of_passing_undergraduate`}
                    required
                  />

                  <DynamicSelect
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.marking_scheme_undergraduate`}
                    required
                  />

                  {form.watch(
                    `table_ug.${index}.marking_scheme_undergraduate`,
                  ) === "Percentage" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={ug}
                        name={`table_ug.${index}.maximum_marks_under_graduate`}
                        required
                      ></DynamicInput>

                      <DynamicInput
                        form={form}
                        doctype={ug}
                        name={`table_ug.${index}.marks_obtaineds_undergraduate`}
                        required
                      ></DynamicInput>
                    </>
                  )}

                  <DynamicInput
                    form={form}
                    doctype={ug}
                    name={`table_ug.${index}.obtained_percentage_cgpa_undergraduate`}
                    required
                  ></DynamicInput>
                </div>
              </section>
            ))}

            <p className="text-[11px] italic text-[#555]">
              Note: Please fill in your previous semester's scores if you are in
              the last year and graduating this year.
            </p>

            <div className="space-y-3">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="degree_completed"
              ></DynamicSelect>
            </div>
          </section>

          {/* POST GRADUATE DETAILS */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#293d8f]">
                Post Graduate Details
              </h3>

              <Button
                type="button"
                className="rounded-none bg-[#0b6b63] hover:bg-[#0b6b63]"
                size="sm"
                onClick={() => addPg()}
              >
                + More
              </Button>
            </div>
            {/* @ts-ignore */}
            {form.watch("table_pg")?.map((_, index) => (
              <section key={index} className="space-y-5 border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#293d8f]">
                    Post Graduate {index + 1}
                  </h4>

                  <Button
                    className="rounded-none"
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => removePg(index)}
                  >
                    <Trash2></Trash2>
                  </Button>
                </div>

                {/* ROW 1 */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
                  <DynamicInput
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.name_of_institutions`}
                    required
                  ></DynamicInput>
                  <DynamicSelect
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.university`}
                    required
                  />

                  {form.watch(`table_pg.${index}.university`) === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={pg}
                        name={`table_pg.${index}.if_other_please_specify`}
                        required
                      ></DynamicInput>
                    </>
                  )}
                  <DynamicSelect
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.streams`}
                    required
                  />

                  {form.watch(`table_pg.${index}.streams`) === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={pg}
                        name={`table_pg.${index}.if_other_please_specify_for_stream`}
                        required
                      ></DynamicInput>
                    </>
                  )}

                  <DynamicInput
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.course_name`}
                    required
                  ></DynamicInput>
                  <DynamicSelect
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.city`}
                    required
                    options={cities}
                  ></DynamicSelect>
                  {form.watch(`table_pg.${index}.city`) === "Other" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={pg}
                        name={`table_pg.${index}.if_other_post_graduate_details`}
                        required
                      ></DynamicInput>
                    </>
                  )}
                  <DynamicYearInput
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.year_of_passing`}
                    required
                  />

                  <DynamicSelect
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.marking_scheme`}
                    required
                  />
                  {form.watch(`table_pg.${index}.marking_scheme`) ===
                    "Percentage" && (
                    <>
                      <DynamicInput
                        form={form}
                        doctype={pg}
                        name={`table_pg.${index}.maximum_marks`}
                        required
                      ></DynamicInput>

                      <DynamicInput
                        form={form}
                        doctype={pg}
                        name={`table_pg.${index}.marks_obtaineds`}
                        required
                      ></DynamicInput>
                    </>
                  )}

                  <DynamicInput
                    form={form}
                    doctype={pg}
                    name={`table_pg.${index}.obtained_percentagecgpas`}
                    required
                  ></DynamicInput>
                </div>
              </section>
            ))}
          </section>
          <section className="space-y-5">
            <div className="space-y-3">
              <DynamicSelect
                form={form}
                search={false}
                doctype={doctype}
                name="have_you_taken_any_competitive_exams_before"
              ></DynamicSelect>
            </div>

            {givenCpExam === "Yes" && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#293d8f]">
                    Exam Details
                  </h3>

                  <Button
                    type="button"
                    size="sm"
                    className="rounded-none bg-[#0b6b63]"
                    onClick={addCompetitiveExam}
                  >
                    + More
                  </Button>
                </div>

                {/* @ts-ignore */}
                {form.watch("competive")?.map((_, index) => (
                  <section key={index} className="space-y-5 border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        Competitive Exam {index + 1}
                      </h4>

                      {index > 0 && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="destructive"
                          className="rounded-none"
                          onClick={() => removeCompetitiveExam(index)}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
                      <DynamicSelect
                        form={form}
                        doctype={competitive}
                        name={`competive.${index}.examination`}
                        required
                      ></DynamicSelect>

                      <DynamicYearInput
                        form={form}
                        doctype={competitive}
                        name={`competive.${index}.year`}
                        required
                      />

                      <DynamicInput
                        form={form}
                        doctype={competitive}
                        name={`competive.${index}.score`}
                        required
                      ></DynamicInput>

                      <DynamicInput
                        form={form}
                        doctype={competitive}
                        name={`competive.${index}.percentile`}
                        required
                      ></DynamicInput>
                    </div>
                  </section>
                ))}
              </>
            )}
          </section>
          <ApplicationFormFooter
            form={form}
            onSave={handleQualificationFormSubmit}
            onBack={onBack}
            onNext={onNext}
            onExit={onExit}
          />
        </form>
      </Form>
    </div>
  );
}
