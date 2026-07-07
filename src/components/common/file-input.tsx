"use client";

import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ApplicationFormDocType } from "@/types/application-form";
import { uploadFile } from "@/actions/upload/upload.action";
import { getMetaKey } from "./util";

interface DynamicFileInputProps {
  form: any;
  doctype?: ApplicationFormDocType;
  name: keyof ApplicationFormDocType;

  required?: boolean;
  disabled?: boolean;
  className?: string;

  accept?: string;
  maxSizeMB?: number;

  label?: string;
  description?: string;
  multiple?: boolean;
}

export function DynamicFileInput({
  form,
  doctype,
  name,
  required,
  disabled,
  className,
  multiple = false,
  accept = ".jpeg,.jpg,.png,.pdf",
  maxSizeMB = 2,
}: DynamicFileInputProps) {
  const [uploading, setUploading] = useState(false);
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];
  if (!meta) return null;

  const allowedTypes = accept
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const files = Array.isArray(field.value)
          ? field.value
          : field.value
            ? [field.value]
            : [];

        return (
          <FormItem className={className}>
            <FormLabel className="text-[12px] font-semibold text-black">
              {meta.label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </FormLabel>

            <FormControl>
              <div className="space-y-2">
                <label className="block cursor-pointer border border-[#cfcfcf] bg-white px-3 py-2 text-sm hover:bg-gray-50">
                  {uploading
                    ? "Uploading..."
                    : multiple
                      ? files.length
                        ? `${files.length} File${files.length > 1 ? "s" : ""} Uploaded`
                        : "Choose Files"
                      : files.length
                        ? files[0]?.split("/").pop()
                        : "Choose File"}

                  <input
                    multiple={multiple}
                    type="file"
                    accept={accept}
                    disabled={disabled || uploading}
                    className="hidden"
                    onChange={async (e) => {
                      const selectedFiles = Array.from(e.target.files ?? []);

                      if (!selectedFiles.length) return;

                      setUploading(true);

                      try {
                        const uploadedUrls: string[] = [];
                        form.clearErrors(name);

                        for (const file of selectedFiles) {
                          // console.log("Checking file:", {
                          //   name: file.name,
                          //   sizeBytes: file.size,
                          //   sizeMB: (file.size / 1024 / 1024).toFixed(2),
                          //   type: file.type,
                          // });

                          const isValidType = allowedTypes.some((type) => {
                            if (type.startsWith(".")) {
                              return file.name
                                .toLowerCase()
                                .endsWith(type.toLowerCase());
                            }

                            return file.type === type;
                          });

                          if (!isValidType) {
                            // console.error("INVALID FILE TYPE", {
                            //   file: file.name,
                            //   fileType: file.type,
                            //   allowedTypes,
                            // });

                            form.setError(name, {
                              type: "manual",
                              message: `Invalid file type. Allowed: ${accept}`,
                            });

                            return;
                          }

                          const maxBytes = Number(maxSizeMB) * 1024 * 1024;

                          // console.log("SIZE CHECK", {
                          //   file: file.name,
                          //   actualBytes: file.size,
                          //   maxBytes,
                          //   actualMB: (file.size / 1024 / 1024).toFixed(2),
                          //   maxMB: maxSizeMB,
                          // });

                          if (file.size > maxBytes) {
                            // console.error("FILE TOO LARGE", {
                            //   file: file.name,
                            //   actualMB: (file.size / 1024 / 1024).toFixed(2),
                            //   maxMB: maxSizeMB,
                            // });

                            form.setError(name, {
                              type: "manual",
                              message: `${file.name} exceeds ${maxSizeMB} MB`,
                            });

                            // console.log(
                            //   "FORM ERROR AFTER SET",
                            //   form.formState.errors,
                            // );

                            return;
                          }

                          // console.log("VALID FILE", file.name);
                        }
                        for (const file of selectedFiles) {
                          const res = await uploadFile(file);

                          if (!res.success) {
                            form.setError(name, {
                              type: "manual",
                              message: res.message || "Upload failed",
                            });
                            return;
                          }

                          if (!res.url) {
                            form.setError(name, {
                              type: "manual",
                              message:
                                "Upload succeeded but file URL is missing",
                            });
                            return;
                          }

                          uploadedUrls.push(res.url);
                        }

                        form.clearErrors(name);

                        // REPLACE existing uploads entirely
                        if (multiple) {
                          form.setValue(name, uploadedUrls, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        } else {
                          form.setValue(name, uploadedUrls[0], {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }

                        await form.trigger(name);

                        e.target.value = "";
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </label>

                {files.length > 0 && (
                  <div className="rounded border border-gray-200 bg-gray-50 ">
                    {files.map((url: string, index: number) => (
                      <span key={`${url}-${index}`} className=" text-xs mr-1">
                        <a
                          href={`${process.env.NEXT_PUBLIC_DOMAIN}${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-blue-600 underline"
                        >
                          {url.split("/").pop()}
                        </a>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>

            <FormMessage />

            {meta.description && (
              <FormDescription className="mb-1 text-[11px] text-muted-foreground">
                {meta.description}
              </FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}
