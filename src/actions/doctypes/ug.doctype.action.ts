"use server";

import { PGFormDocType } from "@/types/application-form";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";

const BASE_URL = process.env.BACKEND_URL!;

export const getUGFormDocType = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resource/DocType/Under Graduate Details`,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION,
        },
      },
    );

    const fields = response.data.data.fields;

    const fieldMap: PGFormDocType = fields
      .filter(
        (field: any) =>
          !["Section Break", "Column Break", "Tab Break"].includes(
            field.fieldtype,
          ),
      )
      .reduce((acc: PGFormDocType, field: any) => {
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

    // console.log(fieldMap);
    // // Save full field map
    // const fieldMapPath = path.join(process.cwd(), "logs", "ug-field-map.json");

    // await writeFile(fieldMapPath, JSON.stringify(fieldMap, null, 2), "utf-8");

    // // Save labels only
    // const labels = Object.values(fieldMap)
    //   .map((field) => field.fieldname)
    //   .filter(Boolean);

    // const labelsPath = path.join(process.cwd(), "logs", "ug-field-labels.txt");

    // await writeFile(labelsPath, labels.join("\n"), "utf-8");

    // console.info(
    //   `[UNDER GRADUATE][APPLICATION FORM] Saved ${labels.length} field labels`,
    // );

    // console.log(fieldMap);

    return {
      fieldMap,
      // labels,
      success: true,
      message: response.data.message || "Under Graduation Form Doctype",
    };
  } catch (err: any) {
    console.error(
      "[UNDER GRADUATE][APPLICATION FORM][DOCTYPE][ERROR]",
      err?.response?.data || err,
    );

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request Under Graduation Form Doctype",
    };
  }
};
