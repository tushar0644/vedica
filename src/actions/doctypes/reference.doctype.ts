"use server";

import { ExtraCurDocType } from "@/types/application-form";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";

const BASE_URL = process.env.BACKEND_URL!;

export const getReferenceDocType = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resource/DocType/Refrences`,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION,
        },
      },
    );

    const fields = response.data.data.fields;

    const fieldMap: ExtraCurDocType = fields
      .filter(
        (field: any) =>
          !["Section Break", "Column Break", "Tab Break"].includes(
            field.fieldtype,
          ),
      )
      .reduce((acc: ExtraCurDocType, field: any) => {
        acc[field.fieldname] = {
          label: field.label,
          fieldname: field.fieldname,
          fieldtype: field.fieldtype,
          placeholder: field.placeholder,
          description: field.description,
          options: field.options
            ? field.options
                .split("\n")
                .map((o: string) => o.trim())
                .filter(Boolean)
            : undefined,
        };

        return acc;
      }, {});

    // // Save full field map
    // const fieldMapPath = path.join(process.cwd(), "logs", "rf-field-map.json");

    // await writeFile(fieldMapPath, JSON.stringify(fieldMap, null, 2), "utf-8");

    // // Save labels only
    // const labels = Object.values(fieldMap)
    //   .map((field) => field.fieldname)
    //   .filter(Boolean);

    // const labelsPath = path.join(process.cwd(), "logs", "rf-field-labels.txt");

    // await writeFile(labelsPath, labels.join("\n"), "utf-8");

    // console.info(
    //   `[REFERENCE][SCHOLARSHIP FORM] Saved ${labels.length} field labels`,
    // );

    // console.log(fieldMap);

    return {
      fieldMap,
      // labels,
      success: true,
      message: response.data.message || "Reference Form Doctype",
    };
  } catch (err: any) {
    console.error(
      "[REFERENCE][SCHOLARSHIP FORM][DOCTYPE][ERROR]",
      err?.response?.data || err,
    );

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request Reference Form Doctype",
    };
  }
};
