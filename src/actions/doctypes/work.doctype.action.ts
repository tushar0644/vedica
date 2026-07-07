"use server";

import { WorkExDocType } from "@/types/application-form";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";

const BASE_URL = process.env.BACKEND_URL!;

export const getWorkExDocType = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resource/DocType/Work Experience Details`,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION,
        },
      },
    );

    const fields = response.data.data.fields;

    const fieldMap: WorkExDocType = fields
      .filter(
        (field: any) =>
          !["Section Break", "Column Break", "Tab Break"].includes(
            field.fieldtype,
          ),
      )
      .reduce((acc: WorkExDocType, field: any) => {
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
    // const fieldMapPath = path.join(process.cwd(), "logs", "wr-field-map.json");

    // await writeFile(fieldMapPath, JSON.stringify(fieldMap, null, 2), "utf-8");

    // // Save labels only
    // const labels = Object.values(fieldMap)
    //   .map((field) => field.fieldname)
    //   .filter(Boolean);

    // const labelsPath = path.join(process.cwd(), "logs", "wr-field-labels.txt");

    // await writeFile(labelsPath, labels.join("\n"), "utf-8");

    // console.info(
    //   `[WORK EX][APPLICATION FORM] Saved ${labels.length} field labels`,
    // );

    // console.log(fieldMap);

    return {
      fieldMap,
      // labels,
      success: true,
      message: response.data.message || "Work Experience Form Doctype",
    };
  } catch (err: any) {
    console.error(
      "[WORK EX][APPLICATION FORM][DOCTYPE][ERROR]",
      err?.response?.data || err,
    );

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request Work Experience Form Doctype",
    };
  }
};
