"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

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
  CommandList,
} from "@/components/ui/command";

import { ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";

import en from "react-phone-number-input/locale/en";

type PhoneInputWithCountryProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
};

const countries = getCountries().map((country) => ({
  country,
  code: `+${getCountryCallingCode(country)}`,
  label: en[country],
}));

export default function PhoneInputWithCountry({
  value = "",
  onChange,
  popoverClassName,
  className,
  disabled = false,
  placeholder,
}: PhoneInputWithCountryProps) {
  const parsed = useMemo(() => {
    const clean = value.replace(/\s/g, "");

    const matched = countries
      .sort((a, b) => b.code.length - a.code.length)
      .find((c) => {
        return (
          clean.startsWith(c.code) || clean.startsWith(c.code.replace("+", ""))
        );
      });

    if (!matched) {
      return {
        code: "+91",
        number: clean.replace(/\D/g, "").slice(-10),
      };
    }

    let number = clean;

    if (number.startsWith(matched.code)) {
      number = number.slice(matched.code.length);
    } else if (number.startsWith(matched.code.replace("+", ""))) {
      number = number.slice(matched.code.replace("+", "").length);
    }

    if (number.startsWith("0")) {
      number = number.slice(1);
    }

    return {
      code: matched.code,
      number: number.replace(/\D/g, "").slice(-10),
    };
  }, [value]);

  const [open, setOpen] = useState(false);

  const [countryCode, setCountryCode] = useState(parsed.code);

  const [phone, setPhone] = useState(parsed.number);

  useEffect(() => {
    setCountryCode(parsed.code);
    setPhone(parsed.number);
  }, [parsed.code, parsed.number]);

  const handlePhoneChange = (input: string) => {
    const cleanInput = input.replace(/\D/g, "");

    const matched = countries
      .sort((a, b) => b.code.length - a.code.length)
      .find((c) => {
        const code = c.code.replace("+", "");

        return cleanInput.startsWith(code) || input.startsWith(c.code);
      });

    if (matched && cleanInput.length > 10) {
      let number = cleanInput;

      const countryDigits = matched.code.replace("+", "");

      if (number.startsWith(countryDigits)) {
        number = number.slice(countryDigits.length);
      }

      if (number.startsWith("0")) {
        number = number.slice(1);
      }

      number = number.slice(-10);

      setCountryCode(matched.code);
      setPhone(number);

      onChange?.(`${matched.code}${number}`);

      return;
    }

    let localNumber = cleanInput;

    if (localNumber.startsWith("0") && localNumber.length > 10) {
      localNumber = localNumber.slice(1);
    }

    localNumber = localNumber.slice(0, 10);

    setPhone(localNumber);

    onChange?.(`${countryCode}${localNumber}`);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);

    onChange?.(`${code}${phone}`);

    setOpen(false);
  };

  return (
    <div className="flex gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            role="combobox"
            className={`w-[60px] justify-between bg-transparent ${popoverClassName}`}
          >
            {countryCode}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput showSearchIcon={false} />

            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>

              <CommandGroup>
                {countries.map((item) => (
                  <CommandItem
                    key={`${item.country}-${item.code}`}
                    value={`${item.label} ${item.code}`}
                    onSelect={() => handleCountryChange(item.code)}
                  >
                    <span className="text-muted-foreground">{item.code}</span>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        countryCode === item.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        disabled={disabled}
        className={className}
        value={phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder || "Enter phone number"}
      />
    </div>
  );
}
