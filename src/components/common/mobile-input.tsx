"use client";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ApplicationFormDocType } from "@/types/application-form";
import { cn } from "@/lib/utils";
import { getMetaKey } from "./util";

export const CustomInput = ({ className, ...props }: any) => {
  return (
    <input
      {...props}
      className={cn(
        "w-full border-0 bg-transparent outline-none",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "text-sm",
        className,
      )}
    />
  );
};

interface DynamicPhoneInputProps {
  form: any;
  doctype?: ApplicationFormDocType;
  name: keyof ApplicationFormDocType;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
  className?: string;

  label?: string;
  placeholder?: string;
}

export function DynamicPhoneInput({
  form,
  doctype,
  name,
  required,
  disabled,
  defaultCountry = "IN",
  className,
  label,
  placeholder,
}: DynamicPhoneInputProps) {
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];
  if (!meta) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel className="text-[12px] font-semibold text-black">
            {label ?? meta.label}
            {required && " *"}
          </FormLabel>
          <FormControl>
            <div
              className={cn(
                "flex h-9 items-center rounded-none border px-3 ",
                disabled && "opacity-75",
                fieldState.error ? "border-destructive" : "border-[#cfcfcf]",
              )}
            >
              <PhoneInput
                international
                defaultCountry={defaultCountry as any}
                value={field.value?.replace("-", "") || undefined}
                disabled={disabled}
                onChange={(value) => {
                  if (!value) {
                    field.onChange("");
                    return;
                  }

                  const code = getCountryCallingCode(defaultCountry as any);

                  if (value.startsWith(`+${code}`)) {
                    const number = value.slice(code.length + 1);

                    field.onChange(`+${code}-${number}`);
                    return;
                  }

                  field.onChange(value);
                }}
                inputComponent={CustomInput}
                className="flex-1 disabled:opacity-25!"
                placeholder={
                  placeholder ?? meta.placeholder ?? "Enter mobile number"
                }
              />
            </div>
          </FormControl>
          <FormMessage />
          {meta.description && (
            <FormDescription className="text-[11px] text-muted-foreground -mt-1 mb-1">
              {meta.description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
