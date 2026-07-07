"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ApplicationFormDocType } from "@/types/application-form";
import { getMetaKey } from "./util";

interface DynamicYearInputProps {
  form: any;
  doctype?: ApplicationFormDocType;
  name: keyof ApplicationFormDocType;
  required?: boolean;
  min?: number;
  max?: number;
}

export function DynamicYearInput({
  form,
  doctype,
  name,
  required,
  min,
  max,
}: DynamicYearInputProps) {
  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];
  const currentYear = new Date().getFullYear();

  const effectiveMax = max ?? currentYear;

  const [startYear, setStartYear] = useState(() => {
    const initial = Math.floor(effectiveMax / 10) * 10;

    if (min && initial < min) {
      return Math.floor(min / 10) * 10;
    }

    return initial;
  });

  if (!meta) return null;

  const years = Array.from({ length: 10 }, (_, i) => startYear + i).filter(
    (year) =>
      (min === undefined || year >= min) && (max === undefined || year <= max),
  );
  const displayStart = min !== undefined ? Math.max(startYear, min) : startYear;
  const displayEnd =
    max !== undefined ? Math.min(startYear + 9, max) : startYear + 9;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-[12px] font-semibold text-black">
            {meta.label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 justify-start rounded-none border-[#cfcfcf] text-left font-normal"
                >
                  {field.value || meta.placeholder || "Select Year"}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="flex items-center justify-between border-b p-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={
                    min !== undefined && startYear <= Math.floor(min / 10) * 10
                  }
                  onClick={() => setStartYear((y) => y - 10)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {displayStart} - {displayEnd}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={
                    max !== undefined &&
                    startYear + 10 > Math.floor(max / 10) * 10
                  }
                  onClick={() => setStartYear((y) => y + 10)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 p-3">
                {years.map((year) => (
                  <Button
                    key={year}
                    type="button"
                    variant={String(year) === field.value ? "default" : "ghost"}
                    onClick={() => field.onChange(String(year))}
                  >
                    {year}
                  </Button>
                ))}
              </div>
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
