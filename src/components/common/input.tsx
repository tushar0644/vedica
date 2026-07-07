import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ApplicationFormDocType } from "@/types/application-form";
import { getMetaKey } from "./util";
import { useWatch } from "react-hook-form";

interface DynamicInputProps {
  form: any;
  doctype: ApplicationFormDocType | undefined;
  name: any;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function DynamicInput({
  form,
  doctype,
  name,
  type = "text",
  required,
  disabled,
  readOnly,
  className,
  label,
  placeholder,
}: DynamicInputProps) {
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];

  const value = useWatch({
    control: form.control,
    name,
  });

  if (!meta) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel className="text-[12px] font-semibold text-black">
            {label ?? meta.label}
            {required && " *"}
          </FormLabel>

          <FormControl>
            <Input
              // @ts-ignore
              value={value ?? ""}
              onChange={(e) => {
                // console.log(`[DynamicInput:${String(name)}]`, e.target.value);

                form.setValue(name, e.target.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              type={type}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder ?? meta.placeholder}
              className="h-9 rounded-none border-[#cfcfcf] text-sm"
            />
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
