"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { ApplicationFormDocType } from "@/types/application-form";
import { getMetaKey } from "./util";

interface DynamicSelectProps {
  form: any;
  doctype: ApplicationFormDocType | undefined;
  name: keyof ApplicationFormDocType;
  required?: boolean;
  className?: string;
  options?: string[];
  disabled?: boolean;
  search?: boolean;
}

export function DynamicSelect({
  form,
  doctype,
  search = true,
  name,
  required,
  className,
  options,
  disabled = false,
}: DynamicSelectProps) {
  const [open, setOpen] = React.useState(false);

  const metakey = getMetaKey(name);
  const meta = doctype?.[metakey];
  if (!meta) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-[12px] font-semibold text-black">
            {meta.label}
            {required && " *"}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "`w-full min-w-0 justify-start bg-transparent border-input hover:bg-transparent font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <span className="flex-1 min-w-0 truncate text-left">
                    {field.value || meta.placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                {search && (
                  <CommandInput
                    placeholder={`Search ${meta.label.toLowerCase()}...`}
                  />
                )}

                <CommandEmpty>No option found.</CommandEmpty>

                <CommandGroup className="max-h-64 overflow-y-auto">
                  {(options ?? meta.options ?? []).map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        field.onChange(option);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === option ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
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
