"use server";

import { ApplicationFormDocType } from "@/types/application-form";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";
import { getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const getQualificationFormDocType = async () => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.get(
      `${BASE_URL}/api/method/get_academic_form_data`,
      {
        headers: {
          Cookie: cookie,
        },
      },
    );

    // console.log(response.data.message);
    // console.log(response.data.message.fields);
    const fields = response.data.message.fields;

    const fieldMap: ApplicationFormDocType = fields
      .filter(
        (field: any) =>
          !["Section Break", "Column Break", "Tab Break"].includes(
            field.fieldtype,
          ),
      )
      .reduce((acc: ApplicationFormDocType, field: any) => {
        acc[field.fieldname] = {
          label: field.label,
          fieldname: field.fieldname,
          fieldtype: field.fieldtype,
          placeholder: field.placeholder,
          description: field.description,
          options:
            typeof field.options === "string"
              ? field.options
                  .split("\n")
                  .map((o: string) => o.trim())
                  .filter(Boolean)
              : undefined,
        };

        return acc;
      }, {});
    // Save full field map
    // const fieldMapPath = path.join(
    //   process.cwd(),
    //   "logs",
    //   "qualification-application-field-map.json",
    // );

    // await writeFile(fieldMapPath, JSON.stringify(fieldMap, null, 2), "utf-8");

    // // Save labels only
    // const labels = Object.values(fieldMap)
    //   .map((field) => field.fieldname)
    //   .filter(Boolean);

    // const labelsPath = path.join(
    //   process.cwd(),
    //   "logs",
    //   "qualification-application-field-labels.txt",
    // );

    // await writeFile(labelsPath, labels.join("\n"), "utf-8");

    // console.info(`[APPLICATION FORM] Saved ${labels.length} field labels`);

    // console.log(fieldMap);

    return {
      fieldMap,
      // labels,
      success: true,
      message: response.data.message || "Application form doctype",
    };
  } catch (err: any) {
    console.error(
      "[APPLICATION FORM][DOCTYPE][ERROR]",
      err?.response?.data || err,
    );

    return {
      success: false,
      message:
        err?.response?.data?.message ||
        "Failed to request application form doctype",
    };
  }
};
