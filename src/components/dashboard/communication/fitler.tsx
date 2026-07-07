"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

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

const years = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => `${new Date().getFullYear() - i}`,
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function _SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [yearOpen, setYearOpen] = React.useState(false);
  const [monthOpen, setMonthOpen] = React.useState(false);

  const [selectedYear, setSelectedYear] = React.useState(
    searchParams.get("year") || "",
  );

  const [selectedMonth, setSelectedMonth] = React.useState(
    searchParams.get("month") || "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedYear) {
      params.set("year", selectedYear);
    } else {
      params.delete("year");
    }

    if (selectedMonth) {
      params.set("month", selectedMonth);
    } else {
      params.delete("month");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-md border">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_260px]">
        {/* Year Select */}
        <Popover open={yearOpen} onOpenChange={setYearOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={yearOpen}
              className="h-11 w-full justify-between bg-white text-left font-medium text-muted-foreground"
            >
              {selectedYear || "Select Year"}

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search year..." />

              <CommandList>
                <CommandEmpty>No year found.</CommandEmpty>

                <CommandGroup className="max-h-64 overflow-y-auto">
                  {years.map((year) => (
                    <CommandItem
                      key={year}
                      value={year}
                      onSelect={(currentValue) => {
                        setSelectedYear(currentValue);
                        setYearOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedYear === year ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {year}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Month Select */}
        <Popover open={monthOpen} onOpenChange={setMonthOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={monthOpen}
              className="h-11 w-full justify-between bg-white text-left font-medium text-muted-foreground"
            >
              {selectedMonth || "Select Month"}

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search month..." />

              <CommandList>
                <CommandEmpty>No month found.</CommandEmpty>

                <CommandGroup>
                  {months.map((month) => (
                    <CommandItem
                      key={month}
                      value={month}
                      onSelect={(currentValue) => {
                        setSelectedMonth(currentValue);
                        setMonthOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMonth === month ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {month}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-11 w-full bg-[#232d8b] text-white hover:bg-[#1d2677]"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}

// Dear Make A Mine,

// We are in receipt of your query. Your query will be answered shortly. You may check the status of your query at My Queries

// Best wishes,
// Vedica Foundation

export default function SearchFilterBar() {
  return (
    <React.Suspense>
      <_SearchFilterBar />
    </React.Suspense>
  );
}
