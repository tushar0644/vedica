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
import { Textarea } from "../ui/textarea";
import { getMetaKey } from "./util";
import { cn } from "@/lib/utils";

interface DynamicTextareaProps {
  form: any;
  doctype: ApplicationFormDocType | undefined;
  name: keyof ApplicationFormDocType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  rows?: number;
  label?: string;
  placeholder?: string;
  value?: string;
  maxWords?: number;
}
export function DynamicTextarea({
  form,
  doctype,
  name,
  required,
  disabled,
  readOnly,
  className,
  label,
  rows,
  placeholder,
  maxWords,
}: DynamicTextareaProps) {
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];

  if (!meta) return null;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const { onChange, ...rest } = field;

        const text = String(field.value ?? "");

        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        return (
          <>
            <FormItem className={className}>
              <FormLabel className="text-[12px] font-semibold text-black">
                {label ?? meta.label}
                {required && " *"}
              </FormLabel>

              <FormControl>
                <div className="flex flex-col ">
                  <Textarea
                    {...rest}
                    rows={rows}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    disabled={disabled}
                    readOnly={readOnly}
                    placeholder={placeholder ?? meta.placeholder}
                    className={cn(
                      "rounded-none border-[#cfcfcf] text-sm",
                      maxWords &&
                        "min-h-[140px] max-h-[220px] resize-none overflow-y-auto",
                    )}
                  />
                  {maxWords && (
                    <div className="pointer-events-none ml-auto mt-1 text-[11px] text-gray-500">
                      {`${words}/${maxWords} words`}
                    </div>
                  )}
                </div>
              </FormControl>

              <FormMessage />
              {meta.description && (
                <FormDescription className="text-[11px] text-muted-foreground -mt-1 mb-1">
                  {meta.description}
                </FormDescription>
              )}
            </FormItem>
          </>
        );
      }}
    />
  );
}
