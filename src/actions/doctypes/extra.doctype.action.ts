"use server";

import { ExtraCurDocType } from "@/types/application-form";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";

const BASE_URL = process.env.BACKEND_URL!;

export const getExtraCurDocType = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resource/DocType/Extra-Curricular Activities Details`,
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

    return {
      fieldMap,
      // labels,
      success: true,
      message: response.data.message || "Extra Curricular Form Doctype",
    };
  } catch (err: any) {
    console.error(
      "[EXTRA CUR][APPLICATION FORM][DOCTYPE][ERROR]",
      err?.response?.data || err,
    );

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request Extra Curricular Form Doctype",
    };
  }
};
