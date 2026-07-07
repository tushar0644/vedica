"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { ApplicationFormDocType } from "@/types/application-form";
import { getMetaKey } from "./util";

interface DynamicDateInputProps {
  form: any;
  doctype?: ApplicationFormDocType;
  name: any;
  required?: boolean;
  disabled?: boolean;
}

export function DynamicDateInput({
  form,
  doctype,
  name,
  required,
  disabled,
}: DynamicDateInputProps) {
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];

  const fieldValue = useWatch({
    control: form.control,
    name,
  });

  if (!meta) return null;

  let selectedDate: Date | undefined;

  try {
    if (fieldValue) {
      // @ts-ignore
      let parsed = parseISO(fieldValue);

      if (!isValid(parsed)) {
        // @ts-ignore
        parsed = new Date(fieldValue);
      }

      if (isValid(parsed)) {
        selectedDate = parsed;
      } else {
        console.error(
          `[DynamicDateInput:${String(name)}] Invalid date received`,
          {
            rawValue: fieldValue,
            type: typeof fieldValue,
          },
        );
      }
    }
  } catch (error) {
    console.error(`[DynamicDateInput:${String(name)}] Error parsing date`, {
      rawValue: fieldValue,
      error,
    });
  }

  // console.log("REGISTERED FIELD", name, form.getFieldState(name));

  // console.log(`[DynamicDateInput:${String(name)}] Render`, {
  //   fieldValue,
  //   selectedDate,
  //   selectedDateValid: !!selectedDate,
  // });

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-[12px] font-semibold text-black">
            {meta.label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "h-9 justify-start rounded-none border-[#cfcfcf] text-left font-normal",
                    !fieldValue && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {selectedDate
                    ? format(selectedDate, "yyyy-MM-dd")
                    : meta.placeholder}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                startMonth={new Date(1950, 0)}
                endMonth={new Date()}
                selected={selectedDate}
                onSelect={(date) => {
                  console.log(
                    `[DynamicDateInput:${String(name)}] Date selected`,
                    date,
                  );

                  if (!date) return;

                  const value = format(date, "yyyy-MM-dd");

                  console.log(
                    `[DynamicDateInput:${String(name)}] Setting value`,
                    value,
                  );

                  form.setValue(name, value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });

                  console.log(
                    `[DynamicDateInput:${String(name)}] After set`,
                    form.getValues(name),
                  );
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);

                  return date > today;
                }}
              />
            </PopoverContent>
          </Popover>

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
